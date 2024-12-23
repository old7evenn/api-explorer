import { NextRequest, NextResponse } from 'next/server';

import { fetchGraphSchema } from '@/utils/graphql';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const urlDoc = searchParams.get('urlDoc');

  if (!urlDoc) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const schema = await fetchGraphSchema(urlDoc);

    return NextResponse.json(schema, { status: 200 });
  } catch (error) {
    const e = error as Error;

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
