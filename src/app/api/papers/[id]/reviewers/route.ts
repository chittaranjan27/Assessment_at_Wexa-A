import { NextRequest, NextResponse } from 'next/server';
import { getReviewerRecommendations } from '@/lib/services/recommendation-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidates = await getReviewerRecommendations(id);
    return NextResponse.json({ candidates });
  } catch (error: any) {
    console.error('Error fetching reviewers:', error);
    return NextResponse.json({ error: 'Unable to connect to the graph database. Please try again.' }, { status: 500 });
  }
}
