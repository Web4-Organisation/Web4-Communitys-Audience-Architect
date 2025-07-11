'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/context/app-context';
import type { Segment, Rule, Operator } from '@/types';
import sampleUsers from '@/data/sample-users.json';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface RuleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  segment: Segment | null;
}

const ruleSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'Field is required'),
  operator: z.string().min(1, 'Operator is required'),
  value: z.string().min(1, 'Value is required'),
});

const segmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required'),
  rules: z.array(ruleSchema).min(1, 'At least one rule is required'),
});

const USER_FIELDS = Object.keys(sampleUsers[0] || {}).filter(key => key !== 'id' && key !== 'email' && key !== 'name') as (keyof typeof sampleUsers[0])[];
const OPERATORS: Operator[] = ['>', '<', '=', '!=', 'contains', 'not contains'];

export function RuleEditor({ isOpen, onClose, segment }: RuleEditorProps) {
  const { addSegment, updateSegment } = useApp();
  
  const form = useForm<z.infer<typeof segmentSchema>>({
    resolver: zodResolver(segmentSchema),
    defaultValues: { name: '', rules: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (segment) {
        form.reset({
          name: segment.name,
          rules: segment.rules.map(r => ({ ...r, value: String(r.value) })),
        });
      } else {
        form.reset({ name: '', rules: [{ id: `new_${Date.now()}`, field: '', operator: '=', value: '' }] });
      }
    }
  }, [isOpen, segment, form]);

  const onSubmit = (data: z.infer<typeof segmentSchema>) => {
    const finalSegmentData = {
      name: data.name,
      rules: data.rules.map(r => ({
        ...r,
        // Attempt to convert value back to original type
        value: !isNaN(Number(r.value)) ? Number(r.value) : (r.value === 'true' || r.value === 'false' ? r.value === 'true' : r.value)
      })) as Rule[]
    };

    if (segment) {
      updateSegment({ ...finalSegmentData, id: segment.id });
    } else {
      addSegment(finalSegmentData);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{segment ? 'Edit Segment' : 'Create New Segment'}</SheetTitle>
          <SheetDescription>
            Define rules to create a user segment. Users must match all rules to be included.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4"/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
            <ScrollArea className="flex-grow pr-6">
                <div className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Segment Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Active Power Users" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <div className="space-y-4">
                        <FormLabel>Rules</FormLabel>
                        {fields.map((item, index) => (
                        <div key={item.id} className="p-4 space-y-4 border rounded-md relative">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name={`rules.${index}.field`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select field..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {USER_FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`rules.${index}.operator`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Operator</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select operator..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                            control={form.control}
                            name={`rules.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter value..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            {fields.length > 1 && (
                                <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                                >
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ id: `new_${Date.now()}`, field: '', operator: '=', value: '' })}
                    >
                        <Plus className="mr-2" />
                        Add Rule
                    </Button>
                </div>
            </ScrollArea>
            <SheetFooter className="pt-6 mt-auto">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Segment</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
