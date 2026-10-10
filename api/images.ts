import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const requested = Number(req.query.size);
  const size = Number.isFinite(requested)
    ? Math.min(Math.max(Math.round(requested), 640), 2560)
    : 1920;

  const files = [];
  let pageToken: string | undefined;
  do {
    const result = await drive.files.list({
      q: `'${process.env.DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      fields:
        "nextPageToken, files(id, name, imageMediaMetadata/time, thumbnailLink)",
      pageSize: 1000,
      pageToken,
    });
    files.push(...(result.data.files ?? []));
    pageToken = result.data.nextPageToken ?? undefined;
  } while (pageToken);

  const images = files.map((file) => ({
    id: file.id,
    src: file.thumbnailLink
      ? file.thumbnailLink.replace(/=s\d+$/, `=s${size}`)
      : `https://drive.google.com/thumbnail?id=${file.id}&sz=w${size}-h${size}`,
    name: file.name,
    takenAt: file.imageMediaMetadata?.time ?? null,
  }));

  res.status(200).json({ images });
}
