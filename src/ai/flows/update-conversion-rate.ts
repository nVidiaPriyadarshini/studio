// Currency Conversion GenAI flow.
'use server';

/**
 * @fileOverview Updates the currency conversion rate between two currencies.
 *
 * - updateConversionRate - A function that updates the conversion rate.
 * - UpdateConversionRateInput - The input type for the updateConversionRate function.
 * - UpdateConversionRateOutput - The return type for the updateConversionRate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getExchangeRate} from '@/services/currency-converter';

const UpdateConversionRateInputSchema = z.object({
  sourceCurrency: z.string().describe('The source currency code (e.g., USD)'),
  targetCurrency: z.string().describe('The target currency code (e.g., EUR)'),
});

export type UpdateConversionRateInput = z.infer<
  typeof UpdateConversionRateInputSchema
>;

const UpdateConversionRateOutputSchema = z.object({
  rate: z.number().describe('The updated exchange rate'),
});

export type UpdateConversionRateOutput = z.infer<
  typeof UpdateConversionRateOutputSchema
>;

export async function updateConversionRate(
  input: UpdateConversionRateInput
): Promise<UpdateConversionRateOutput> {
  return updateConversionRateFlow(input);
}

const shouldUpdateConversionRate = ai.defineTool({
  name: 'shouldUpdateConversionRate',
  description: 'Determines whether the currency conversion rate should be updated based on current market conditions.',
  inputSchema: z.object({
    sourceCurrency: z.string().describe('The source currency code (e.g., USD)'),
    targetCurrency: z.string().describe('The target currency code (e.g., EUR)'),
  }),
  outputSchema: z.boolean().describe('Whether the conversion rate should be updated.'),
},
async input => {
    // TODO: actually query an LLM here
    return true;
  }
);

const updateConversionRatePrompt = ai.definePrompt({
  name: 'updateConversionRatePrompt',
  tools: [shouldUpdateConversionRate],
  input: {
    schema: z.object({
      sourceCurrency: z.string().describe('The source currency code (e.g., USD)'),
      targetCurrency: z.string().describe('The target currency code (e.g., EUR)'),
    }),
  },
  output: {
    schema: z.object({
      rate: z.number().describe('The updated exchange rate'),
    }),
  },
  prompt: `You are a currency exchange expert. Determine if the conversion rate between {{sourceCurrency}} and {{targetCurrency}} needs to be updated. Use the shouldUpdateConversionRate tool to determine if the conversion rate needs to be updated. If it does, then use the getExchangeRate service to get the current conversion rate.
`,
});

const updateConversionRateFlow = ai.defineFlow<
  typeof UpdateConversionRateInputSchema, // input type
  typeof UpdateConversionRateOutputSchema // output type
>(
  {
    name: 'updateConversionRateFlow',
    inputSchema: UpdateConversionRateInputSchema,
    outputSchema: UpdateConversionRateOutputSchema,
  },
  async input => {
    const {sourceCurrency, targetCurrency} = input;

    const {output} = await updateConversionRatePrompt({
      sourceCurrency: sourceCurrency,
      targetCurrency: targetCurrency,
    });

    if (!output) {
      const exchangeRate = await getExchangeRate(sourceCurrency, targetCurrency);

      return {
        rate: exchangeRate.rate,
      };
    }

    return {
      rate: output.rate,
    };
  }
);
