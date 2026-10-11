import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!/^[\w-]+$/.test(id)) {
    res.status(400).json({ error: "Missing or invalid id" });
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  try {
    // Only answer for photos in the frame's folder, not any file the service
    // account happens to be able to read.
    const file = await drive.files.get({ fileId: id, fields: "parents" });
    if (!file.data.parents?.includes(process.env.DRIVE_FOLDER_ID ?? "")) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const comments = [];
    let pageToken: string | undefined;
    do {
      const result = await drive.comments.list({
        fileId: id,
        fields:
          "nextPageToken, comments(id, author/displayName, content, createdTime, deleted, replies(id, author/displayName, content, createdTime, deleted))",
        pageSize: 100,
        pageToken,
      });
      comments.push(...(result.data.comments ?? []));
      pageToken = result.data.nextPageToken ?? undefined;
    } while (pageToken);

    const toEntry = (c: {
      id?: string | null;
      author?: { displayName?: string | null } | null;
      content?: string | null;
      createdTime?: string | null;
    }) => ({
      id: c.id,
      author: c.author?.displayName ?? "Someone",
      content: c.content ?? "",
      createdTime: c.createdTime ?? null,
    });

    res.status(200).json({
      comments: comments
        .filter((c) => !c.deleted)
        .map((c) => ({
          ...toEntry(c),
          replies: (c.replies ?? []).filter((r) => !r.deleted).map(toEntry),
        })),
    });
  } catch {
    res.status(502).json({ error: "Could not load comments" });
  }
}
