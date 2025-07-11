'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import type { Segment, User } from '@/types';
import { analyzeSegmentCharacteristics } from '@/ai/flows/analyze-segment-characteristics';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface AIAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  segment: Segment;
  usersInSegment: User[];
}

export function AIAnalysisDialog({ isOpen, onClose, segment, usersInSegment }: AIAnalysisDialogProps) {
  const [analysis, setAnalysis] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen && usersInSegment.length > 0) {
      const runAnalysis = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
          // Take a sample of up to 20 users for the analysis
          const sampleUsers = usersInSegment.slice(0, 20);
          
          const result = await analyzeSegmentCharacteristics({
            segmentName: segment.name,
            segmentRules: JSON.stringify(segment.rules, null, 2),
            sampleUsers: JSON.stringify(sampleUsers, null, 2),
          });
          setAnalysis(result.analysis);
        } catch (e) {
          console.error("AI analysis failed:", e);
          setError("Failed to generate AI analysis. Please check your API key and try again.");
        } finally {
          setIsLoading(false);
        }
      };
      runAnalysis();
    }
  }, [isOpen, segment, usersInSegment]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            AI Analysis: <span className="font-semibold text-accent">{segment.name}</span>
          </DialogTitle>
          <DialogDescription>
            An AI-generated summary of the key characteristics of this user segment.
            <div className="flex flex-wrap gap-1 mt-2">
              {segment.rules.map(rule => (
                <Badge key={rule.id} variant="secondary">{`${rule.field} ${rule.operator} ${rule.value}`}</Badge>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-4">Analyzing segment data...</p>
            </div>
          )}
          {error && (
            <div className="p-4 text-center text-destructive-foreground bg-destructive rounded-md">
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && usersInSegment.length === 0 && (
             <div className="p-4 text-center text-muted-foreground bg-muted rounded-md">
              <p>Cannot analyze a segment with 0 users.</p>
            </div>
          )}
          {analysis && (
            <ScrollArea className="h-[250px] p-4 border rounded-md bg-background">
              <p className="whitespace-pre-wrap">{analysis}</p>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
