import { getPaperDetails } from "@/lib/queries/papers";
import Link from "next/link";
import { ArrowLeft, User, Tag, Calendar, Globe, Building } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function PaperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await getPaperDetails(id);

  if (!paper) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/papers" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Papers
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
              {paper.year}
            </span>
            {paper.conference && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 flex items-center">
                <Building className="w-4 h-4 mr-1" />
                {paper.conference.name}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              DOI: {paper.doi}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{paper.title}</h1>
          <div className="prose max-w-none text-slate-600">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Abstract</h3>
            <p>{paper.abstract}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
            <User className="w-5 h-5 text-slate-500 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900">Authors</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {paper.authors.length > 0 ? (
              paper.authors.map(author => (
                <div key={author.id} className="p-4 flex items-center hover:bg-slate-50">
                  <div className="bg-slate-200 text-slate-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                    {author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{author.name}</div>
                    <div className="text-sm text-slate-500">{author.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-slate-500">No authors listed.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
            <Tag className="w-5 h-5 text-slate-500 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900">Topics</h2>
          </div>
          <div className="p-6">
            {paper.topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {paper.topics.map(topic => (
                  <span key={topic.id} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-700">
                    {topic.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-500">No topics listed.</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 mb-20">
        <Link 
          href={`/papers/${paper.id}/reviewers`}
          className="inline-flex items-center px-8 py-4 border border-transparent shadow-md text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Find Reviewers for this Paper
        </Link>
      </div>
    </div>
  );
}
