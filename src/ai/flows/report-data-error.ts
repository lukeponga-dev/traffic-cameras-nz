'use server';

/**
 * @fileOverview This file defines a Genkit flow for reporting data errors in the Speed Camera app.
 *
 * The flow takes user input for a data error report, uses GenAI to summarize the report
 * and suggest potential corrections, which moderators can then verify and apply.
 *
 * @exports {
 *   reportDataError,
 *   ReportDataErrorInput,
 *   ReportDataErrorOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportDataErrorInputSchema = z.object({
  cameraId: z.string().describe('The ID of the camera being reported.'),
  reportType: z.enum([
    'incorrect_speed_limit',
    'incorrect_location',
    'other',
  ]).describe('The type of data error being reported.'),
  description: z.string().describe('A detailed description of the data error.'),
  userLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional()
    .describe('The user reported location, if available.'),
});

export type ReportDataErrorInput = z.infer<typeof ReportDataErrorInputSchema>;

const ReportDataErrorOutputSchema = z.object({
  summary: z.string().describe('A summary of the data error report.'),
  suggestedCorrections: z
    .string()
    .describe('Suggested corrections for the data error.'),
});

export type ReportDataErrorOutput = z.infer<typeof ReportDataErrorOutputSchema>;

export async function reportDataError(
  input: ReportDataErrorInput
): Promise<ReportDataErrorOutput> {
  return reportDataErrorFlow(input);
}

const reportDataErrorPrompt = ai.definePrompt({
  name: 'reportDataErrorPrompt',
  input: {schema: ReportDataErrorInputSchema},
  output: {schema: ReportDataErrorOutputSchema},
  prompt: `You are an AI assistant helping to moderate user reports about speed camera data errors.

  A user has submitted the following report:
  Camera ID: {{{cameraId}}}
  Report Type: {{{reportType}}}
  Description: {{{description}}}
  User Location (if available): {{#if userLocation}}Latitude: {{{userLocation.latitude}}}, Longitude: {{{userLocation.longitude}}}{{else}}Not provided{{/if}}

  Please provide a concise summary of the report and suggest potential corrections for the data error.  The summary should be no more than two sentences.
  The suggested corrections should be actionable and specific.

  Summary:
  Suggested Corrections: `,
});

const reportDataErrorFlow = ai.defineFlow(
  {
    name: 'reportDataErrorFlow',
    inputSchema: ReportDataErrorInputSchema,
    outputSchema: ReportDataErrorOutputSchema,
  },
  async input => {
    const {output} = await reportDataErrorPrompt(input);
    return output!;
  }
);
