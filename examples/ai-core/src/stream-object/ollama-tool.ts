#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

console.log(
  'Probably object-tool is not working as expected with ollama tools, depends of the model capabilities',
)

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamObject({
    maxTokens: 2000,
    mode: 'tool',
    model: ollama(model),
    prompt:
      'Generate 3 character descriptions for a fantasy role playing game.',
    schema: z.object({
      characters: z.array(
        z.object({
          class: z
            .string()
            .describe('Character class, e.g. warrior, mage, or thief.'),
          description: z.string(),
          name: z.string(),
        }),
      ),
    }),
  })

  for await (const partialObject of result.partialObjectStream) {
    console.clear()
    console.log(partialObject)
  }
}

buildProgram('llama3.1', main).catch(console.error)
