import { getAllPapers } from "@/lib/queries/papers";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function PapersPage() {
  const papers = await getAllPapers();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Research Papers</h1>
          <p className="text-slate-600 mt-2">Browse the database of submitted papers.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          {papers.length} Papers
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {papers.map((paper) => (
            <div key={paper.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/papers/${paper.id}`} className="text-lg font-medium text-indigo-600 hover:underline">
                    {paper.title}
                  </Link>
                  <p className="text-slate-500 mt-1 line-clamp-2">{paper.abstract}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 ml-4 whitespace-nowrap">
                  {paper.year}
                </span>
              </div>
              <div className="mt-4 flex space-x-3">
                <Link 
                  href={`/papers/${paper.id}`}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                >
                  View Details
                </Link>
                <Link 
                  href={`/papers/${paper.id}/reviewers`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Find Reviewers
                </Link>
              </div>
            </div>
          ))}
          {papers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No papers found in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
