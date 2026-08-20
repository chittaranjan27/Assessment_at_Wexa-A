import { NextRequest, NextResponse } from 'next/server';
import { getPaperDetails } from '@/lib/queries/papers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paper = await getPaperDetails(id);
    
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ paper });
  } catch (error: any) {
    console.error(`Error fetching paper ${error}:`, error);
    return NextResponse.json({ error: 'Unable to connect to the graph database. Please try again.' }, { status: 500 });
  }
}
