import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const params = await context.params; // await this!

  const filePath = path.join(process.cwd(), 'uploads', params.filename);

  try {
    const file = await fs.readFile(filePath);

    const ext = path.extname(params.filename).toLowerCase();
    const type =
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.webp' ? 'image/webp' :
      'application/octet-stream';

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
