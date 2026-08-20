import { getDashboardStats } from "@/lib/queries/stats";
import { getAllPapers } from "@/lib/queries/papers";
import Link from "next/link";
import { FileText, Users, Tag, Building2, ArrowRight } from "lucide-react";
import { Suspense } from "react";

export const revalidate = 0; // Dynamic page

async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Papers</p>
          <p className="text-3xl font-bold text-slate-900">{stats.papers}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
        <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Researchers</p>
          <p className="text-3xl font-bold text-slate-900">{stats.researchers}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
          <Tag className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Topics</p>
          <p className="text-3xl font-bold text-slate-900">{stats.topics}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
        <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Universities</p>
          <p className="text-3xl font-bold text-slate-900">{stats.universities}</p>
        </div>
      </div>
    </div>
  );
}

async function RecentPapers() {
  const papers = await getAllPapers();
  const recentPapers = papers.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900">Recent Papers</h2>
        <Link href="/papers" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
          View all <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="divide-y divide-slate-200">
        {recentPapers.map((paper) => (
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
            <div className="mt-4">
              <Link 
                href={`/papers/${paper.id}/reviewers`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Find Reviewers
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of the Reviewer Finder database.</p>
      </div>
      
      <Suspense fallback={<div className="h-32 bg-slate-100 rounded-xl animate-pulse mb-12"></div>}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-slate-100 rounded-xl animate-pulse"></div>}>
        <RecentPapers />
      </Suspense>
    </div>
  );
}
