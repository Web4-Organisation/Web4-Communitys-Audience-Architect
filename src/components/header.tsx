'use client';

import * as React from 'react';
import { Upload, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { parseCsv } from '@/lib/csv';

interface HeaderProps {
  onNewSegment: () => void;
}

export function Header({ onNewSegment }: HeaderProps) {
  const { importUsers } = useApp();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const newUsers = parseCsv(text);
          importUsers(newUsers);
          toast({
            title: "Import Successful",
            description: `${newUsers.length} users have been imported.`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "Could not parse the CSV file. Please check the format.",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16 max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mr-auto">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Audience Architect</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="mr-2" />
            Import CSV
          </Button>
          <Button onClick={onNewSegment}>
            <Plus className="mr-2" />
            New Segment
          </Button>
        </div>
      </div>
    </header>
  );
}
