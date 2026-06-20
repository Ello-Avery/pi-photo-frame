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

  const result = await drive.files.list({
    q: `'${process.env.DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id, name, imageMediaMetadata/time)",
  });

  const images = (result.data.files ?? []).map((file) => ({
    id: file.id,
    src: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1920-h1080`,
    name: file.name,
    takenAt: file.imageMediaMetadata?.time ?? null,
  }));

  res.status(200).json({ images });
}
