'use client';

import type { User } from '@/types';

export function exportToCsv(users: User[], segmentName: string) {
  if (users.length === 0) {
    alert("No users in this segment to export.");
    return;
  }

  const headers = Object.keys(users[0]) as (keyof User)[];
  const csvRows = [
    headers.join(','), // header row
    ...users.map(user => 
      headers.map(header => {
        const value = user[header];
        let processedValue = value === null || value === undefined ? '' : String(value);
        // Handle values with commas, double quotes, or newlines by enclosing in double quotes
        // and escaping existing double quotes.
        if (/[",\n]/.test(processedValue)) {
          processedValue = `"${processedValue.replace(/"/g, '""')}"`;
        }
        return processedValue;
      }).join(',')
    )
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${segmentName.replace(/\s+/g, '_').toLowerCase()}_users.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// A simple CSV parser. Doesn't handle complex cases like quoted newlines.
export function parseCsv(text: string): User[] {
  const rows = text.split('\n').filter(row => row.trim() !== '');
  if (rows.length < 2) {
      return [];
  }
  const header = rows[0].split(',').map(h => h.trim());
  
  const users: User[] = rows.slice(1).map((row) => {
    // This regex handles comma-separated values, including quoted strings that may contain commas.
    const values = (row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []).map(v => {
      // Remove quotes from start and end
      return v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v;
    });

    const userObject = header.reduce((obj, key, index) => {
      let value: any = values[index]?.trim() || '';
      // Basic type coercion
      if (key === 'id' || key === 'postCount') {
          value = Number(value);
      } else if (key === 'isPro') {
          value = value.toLowerCase() === 'true';
      }
      obj[key] = value;
      return obj;
    }, {} as any);

    return userObject as User;
  });
  return users;
}
