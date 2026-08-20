import { NextRequest, NextResponse } from 'next/server';
import { getRelationshipGraph } from '@/lib/queries/graph';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // We expect reviewerId in the search params
    const searchParams = request.nextUrl.searchParams;
    const reviewerId = searchParams.get('reviewerId');
    
    if (!reviewerId) {
      return NextResponse.json({ error: 'reviewerId is required' }, { status: 400 });
    }

    const graphData = await getRelationshipGraph(id, reviewerId);
    return NextResponse.json({ graphData });
  } catch (error: any) {
    console.error('Error fetching graph:', error);
    return NextResponse.json({ error: 'Unable to connect to the graph database. Please try again.' }, { status: 500 });
  }
}
