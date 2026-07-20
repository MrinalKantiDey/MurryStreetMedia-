import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { verifyDownloadToken } from '@/lib/download-token';
import { getProduct, getProductFilePath } from '@/lib/products';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const token = params.token;
  if (!token) {
    return new Response('Not found', { status: 404 });
  }

  const payload = verifyDownloadToken(token);
  if (!payload) {
    return new Response('This download link is invalid or has expired', { status: 403 });
  }

  const product = await getProduct(payload.slug);
  if (!product) {
    return new Response('Not found', { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(getProductFilePath(product));
  } catch (error) {
    console.error(`Could not read product file for ${payload.slug}:`, error);
    return new Response('File temporarily unavailable', { status: 500 });
  }

  return new Response(new Uint8Array(file), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${product.data.name}.pdf"`,
      'Content-Length': String(file.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
};
