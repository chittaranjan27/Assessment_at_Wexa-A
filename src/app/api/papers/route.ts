import { NextResponse } from 'next/server';
import { getAllPapers } from '@/lib/queries/papers';

export async function GET() {
  try {
    const papers = await getAllPapers();
    return NextResponse.json({ papers });
  } catch (error: any) {
    console.error('Error fetching papers:', error);
    return NextResponse.json({ error: 'Unable to connect to the graph database. Please try again.' }, { status: 500 });
  }
}
