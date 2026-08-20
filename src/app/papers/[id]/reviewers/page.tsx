import { getReviewerRecommendations } from "@/lib/services/recommendation-service";
import { getPaperDetails } from "@/lib/queries/papers";
import Link from "next/link";
import { ArrowLeft, User, AlertTriangle, CheckCircle2, ShieldAlert, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ReviewersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await getPaperDetails(id);
  
  if (!paper) {
    notFound();
  }

  const candidates = await getReviewerRecommendations(id);
  
  const eligibleReviewers = candidates.filter(c => c.eligible);
  const conflictedReviewers = candidates.filter(c => !c.eligible);

  return (
    <div>
      <div className="mb-6">
        <Link href={`/papers/${id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Paper
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reviewer Recommendations</h1>
        <p className="text-slate-600 mt-2">
          Found <span className="font-semibold text-slate-900">{eligibleReviewers.length}</span> eligible reviewers for 
          <span className="italic ml-1 text-slate-800">"{paper.title}"</span>.
        </p>
      </div>

      <div className="space-y-12">
        {/* Recommended Reviewers */}
        <section>
          <div className="flex items-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
            <h2 className="text-2xl font-semibold text-slate-900">Recommended Reviewers</h2>
          </div>
          
          {eligibleReviewers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {eligibleReviewers.map((candidate, idx) => (
                <div key={candidate.reviewer.id} className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col md:flex-row relative">
                  <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-bl-xl font-bold border-b border-l border-emerald-100">
                    Score: {candidate.score}
                  </div>
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50 flex flex-col justify-center">
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                        {candidate.reviewer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{candidate.reviewer.name}</h3>
                        <p className="text-sm text-slate-500">{candidate.reviewer.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-center space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1 text-slate-500" />
                        Matching Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.matchingTopics.map(t => (
                          <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">Explanation</h4>
                      <p className="text-sm text-slate-600">{candidate.explanation}</p>
                    </div>
                    <div className="pt-2">
                      <Link 
                        href={`/papers/${id}/graph?reviewerId=${candidate.reviewer.id}`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Explore Relationship Graph <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No eligible reviewers found</h3>
              <p className="text-slate-500 mt-1">Try expanding the paper's topics or check the conflicted list below.</p>
            </div>
          )}
        </section>

        {/* Excluded Reviewers */}
        {conflictedReviewers.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <ShieldAlert className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-semibold text-slate-900">Excluded Candidates (Conflicts)</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 opacity-90">
              {conflictedReviewers.map((candidate, idx) => (
                <div key={candidate.reviewer.id} className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden flex flex-col md:flex-row relative">
                  <div className="absolute top-0 right-0 bg-red-50 text-red-700 px-3 py-1 text-xs font-bold border-b border-l border-red-100 uppercase tracking-wider">
                    {candidate.conflicts[0].severity} Conflict
                  </div>
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-red-50/30 flex flex-col justify-center">
                    <div className="flex items-center mb-2">
                      <div className="bg-red-100 text-red-700 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                        {candidate.reviewer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{candidate.reviewer.name}</h3>
                        <p className="text-sm text-slate-500">{candidate.reviewer.title}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      Suitability Score: <span className="font-semibold text-slate-700">{candidate.score}</span>
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-center space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-red-900 mb-1 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                        Conflict Reason
                      </h4>
                      <p className="text-sm text-red-800 bg-red-50 p-3 rounded-md border border-red-100">
                        {candidate.conflicts[0].explanation}
                      </p>
                    </div>
                    {candidate.matchingTopics.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Matching Topics (Highly Qualified)</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.matchingTopics.map(t => (
                            <span key={t} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-2">
                      <Link 
                        href={`/papers/${id}/graph?reviewerId=${candidate.reviewer.id}`}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Explore Conflict Graph <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
