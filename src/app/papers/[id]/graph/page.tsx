"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { GraphData } from '@/types';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function GraphExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  const [paperId, setPaperId] = useState<string>('');
  const searchParams = useSearchParams();
  const reviewerId = searchParams.get('reviewerId');
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(p => setPaperId(p.id));
  }, [params]);

  useEffect(() => {
    if (!paperId || !reviewerId) return;

    const fetchGraph = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/papers/${paperId}/graph?reviewerId=${reviewerId}`);
        if (!res.ok) throw new Error('Failed to fetch graph data');
        const data = await res.json();
        const graphData: GraphData = data.graphData;
        
        // Transform for React Flow
        const rfNodes: Node[] = graphData.nodes.map((n, i) => {
          let bgColor = '#fff';
          let borderColor = '#000';
          
          if (n.type === 'Researcher') {
            bgColor = n.id === reviewerId ? '#fef2f2' : '#eff6ff';
            borderColor = n.id === reviewerId ? '#ef4444' : '#3b82f6';
          } else if (n.type === 'Paper') {
            bgColor = n.id === paperId ? '#f0fdf4' : '#f8fafc';
            borderColor = n.id === paperId ? '#22c55e' : '#cbd5e1';
          } else if (n.type === 'Topic') {
            bgColor = '#fdf4ff';
            borderColor = '#d946ef';
          } else if (n.type === 'University') {
            bgColor = '#fffbeb';
            borderColor = '#f59e0b';
          }

          return {
            id: n.id,
            position: { x: (i % 3) * 250, y: Math.floor(i / 3) * 150 }, // simple grid layout, a better algorithm like dagre would be ideal
            data: { label: `${n.type}\n${n.label}` },
            style: { 
              background: bgColor, 
              border: `2px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
              width: 180
            }
          };
        });

        const rfEdges: Edge[] = graphData.relationships.map((r, i) => ({
          id: `e-${i}`,
          source: r.source,
          target: r.target,
          label: r.type,
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          labelStyle: { fill: '#475569', fontWeight: 500 },
          labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [paperId, reviewerId, setNodes, setEdges]);

  if (!reviewerId) {
    return <div className="p-8 text-center text-red-500">Reviewer ID is required.</div>;
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <Link href={`/papers/${paperId}/reviewers`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center w-max">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Recommendations
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Relationship Explorer</h1>
        <p className="text-sm text-slate-500">Visualizing connections between the reviewer and the paper.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-50">
            <div className="text-red-600 font-medium bg-white p-4 rounded-lg shadow">{error}</div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background gap={24} size={2} color="#e2e8f0" />
        </ReactFlow>
      </div>
    </div>
  );
}
