'use client';

import * as React from 'react';
import { Users, FileCog, Bot, Download, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Segment, User } from '@/types';
import { useApp } from '@/context/app-context';
import { filterUsersByRules } from '@/lib/segmentation';
import { exportToCsv } from '@/lib/csv';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SegmentCardProps {
  segment: Segment;
  onEdit: (segment: Segment) => void;
  onAnalyze: (segment: Segment, usersInSegment: User[]) => void;
}

export function SegmentCard({ segment, onEdit, onAnalyze }: SegmentCardProps) {
  const { users, deleteSegment } = useApp();
  
  const usersInSegment = React.useMemo(() => filterUsersByRules(users, segment.rules), [users, segment.rules]);

  const handleExport = () => {
    exportToCsv(usersInSegment, segment.name);
  };
  
  const handleDelete = () => {
    deleteSegment(segment.id);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{segment.name}</span>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{segment.name}" segment. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
        <CardDescription>
          <Badge variant="secondary">{segment.rules.length} Rule{segment.rules.length !== 1 ? 's' : ''}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-4xl font-bold">
          <Users className="w-10 h-10 text-primary" />
          {usersInSegment.length}
        </div>
        <p className="text-sm text-muted-foreground">users in this segment</p>
      </CardContent>
      <Separator />
      <CardFooter className="grid grid-cols-2 gap-2 p-4">
        <Button variant="outline" onClick={() => onEdit(segment)}>
          <Pencil className="mr-2" /> Edit
        </Button>
        <Button variant="outline" onClick={handleExport} disabled={usersInSegment.length === 0}>
          <Download className="mr-2" /> Export
        </Button>
        <Button variant="default" className="col-span-2 bg-primary/90 hover:bg-primary" onClick={() => onAnalyze(segment, usersInSegment)}>
          <Bot className="mr-2" /> Analyze with AI
        </Button>
      </CardFooter>
    </Card>
  );
}
