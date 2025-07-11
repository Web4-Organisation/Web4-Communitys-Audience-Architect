'use server';

/**
 * @fileOverview A flow that analyzes the characteristics of a user segment using AI.
 *
 * - analyzeSegmentCharacteristics - A function that triggers the analysis of a segment.
 * - AnalyzeSegmentCharacteristicsInput - The input type for the analyzeSegmentCharacteristics function.
 * - AnalyzeSegmentCharacteristicsOutput - The return type for the analyzeSegmentCharacteristics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSegmentCharacteristicsInputSchema = z.object({
  segmentName: z.string().describe('The name of the segment to analyze.'),
  segmentRules: z.string().describe('The rules defined for the segment.'),
  sampleUsers: z.string().describe('A sample of users belonging to the segment (JSON format).'),
});
export type AnalyzeSegmentCharacteristicsInput = z.infer<
  typeof AnalyzeSegmentCharacteristicsInputSchema
>;

const AnalyzeSegmentCharacteristicsOutputSchema = z.object({
  analysis: z.string().describe('A descriptive analysis of the segment\'s key characteristics.'),
});
export type AnalyzeSegmentCharacteristicsOutput = z.infer<
  typeof AnalyzeSegmentCharacteristicsOutputSchema
>;

export async function analyzeSegmentCharacteristics(
  input: AnalyzeSegmentCharacteristicsInput
): Promise<AnalyzeSegmentCharacteristicsOutput> {
  return analyzeSegmentCharacteristicsFlow(input);
}

const analyzeSegmentCharacteristicsPrompt = ai.definePrompt({
  name: 'analyzeSegmentCharacteristicsPrompt',
  input: {schema: AnalyzeSegmentCharacteristicsInputSchema},
  output: {schema: AnalyzeSegmentCharacteristicsOutputSchema},
  prompt: `You are an expert marketing analyst tasked with understanding user segments.

  Based on the segment's name, rules, and a sample of its users, generate a concise but insightful analysis of the segment's key characteristics.

  Segment Name: {{{segmentName}}}
  Segment Rules: {{{segmentRules}}}
  Sample Users: {{{sampleUsers}}}

  Analysis:`,
});

const analyzeSegmentCharacteristicsFlow = ai.defineFlow(
  {
    name: 'analyzeSegmentCharacteristicsFlow',
    inputSchema: AnalyzeSegmentCharacteristicsInputSchema,
    outputSchema: AnalyzeSegmentCharacteristicsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSegmentCharacteristicsPrompt(input);
    return output!;
  }
);
