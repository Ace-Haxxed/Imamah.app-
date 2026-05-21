'use server';
/**
 * @fileOverview A Genkit flow for generating captivating, editorial-style biographies for newly approved sports teams.
 *
 * - generateTeamBiography - A function that generates a team biography.
 * - GenerateTeamBiographyInput - The input type for the generateTeamBiography function.
 * - GenerateTeamBiographyOutput - The return type for the generateTeamBiography function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTeamBiographyInputSchema = z.object({
  teamName: z.string().describe('The name of the team.'),
  aboutText: z.string().describe("The 'About' section provided by the team, which should be used to generate the biography."),
});
export type GenerateTeamBiographyInput = z.infer<typeof GenerateTeamBiographyInputSchema>;

const GenerateTeamBiographyOutputSchema = z.object({
  biography: z.string().describe('The generated editorial-style biography for the team.'),
});
export type GenerateTeamBiographyOutput = z.infer<typeof GenerateTeamBiographyOutputSchema>;

export async function generateTeamBiography(input: GenerateTeamBiographyInput): Promise<GenerateTeamBiographyOutput> {
  return generateTeamBiographyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTeamBiographyPrompt',
  input: { schema: GenerateTeamBiographyInputSchema },
  output: { schema: GenerateTeamBiographyOutputSchema },
  prompt: `You are an expert sports writer and content creator for "imamah Sports", an online platform with a luxury dark editorial feel.

Your task is to write a captivating, editorial-style biography for a sports team named '{{{teamName}}}'.
Use the provided 'About' section to craft a high-quality, engaging narrative. Focus on making the team sound prestigious and inspiring, fitting the high-end sports magazine aesthetic of imamah Sports.

Team Name: {{{teamName}}}
About Section: """{{{aboutText}}}"""

Produce a biography that is suitable for a professional sports profile page.`,
});

const generateTeamBiographyFlow = ai.defineFlow(
  {
    name: 'generateTeamBiographyFlow',
    inputSchema: GenerateTeamBiographyInputSchema,
    outputSchema: GenerateTeamBiographyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
