'use client';

import * as React from 'react';
import { AppProvider, useApp } from '@/context/app-context';
import { Header } from '@/components/header';
import { SegmentCard } from '@/components/segment-card';
import { RuleEditor } from '@/components/rule-editor';
import { AIAnalysisDialog } from '@/components/ai-analysis-dialog';
import type { Segment, User } from '@/types';

function Dashboard() {
  const { segments, users, isLoading } = useApp();
  const [isRuleEditorOpen, setIsRuleEditorOpen] = React.useState(false);
  const [editingSegment, setEditingSegment] = React.useState<Segment | null>(null);
  const [analyzingSegment, setAnalyzingSegment] = React.useState<{segment: Segment, usersInSegment: User[]} | null>(null);

  const handleNewSegment = () => {
    setEditingSegment(null);
    setIsRuleEditorOpen(true);
  };

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setIsRuleEditorOpen(true);
  };
  
  const handleAnalyzeSegment = (segment: Segment, usersInSegment: User[]) => {
    setAnalyzingSegment({ segment, usersInSegment });
  };

  const handleEditorClose = () => {
    setIsRuleEditorOpen(false);
    setEditingSegment(null);
  };
  
  const handleAnalysisClose = () => {
    setAnalyzingSegment(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNewSegment={handleNewSegment} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <p>Loading data...</p>
        ) : segments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {segments.map((segment) => (
              <SegmentCard
                key={segment.id}
                segment={segment}
                onEdit={handleEditSegment}
                onAnalyze={handleAnalyzeSegment}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
             <div className="p-10 border border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">No Segments Yet</h2>
                <p className="mt-2">Click "New Segment" to get started.</p>
              </div>
          </div>
        )}
      </main>
      <RuleEditor
        isOpen={isRuleEditorOpen}
        onClose={handleEditorClose}
        segment={editingSegment}
      />
      {analyzingSegment && (
         <AIAnalysisDialog
          isOpen={!!analyzingSegment}
          onClose={handleAnalysisClose}
          segment={analyzingSegment.segment}
          usersInSegment={analyzingSegment.usersInSegment}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
