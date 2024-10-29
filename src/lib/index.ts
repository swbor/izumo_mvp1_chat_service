import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env['ADAPTER_CUSTOM_OPENAI_API_KEY'],
});

export const callgpt = async (prompt: string) => {
    return await client.chat.completions
        .create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o-2024-08-06',
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'main_output',
                    schema: {
                        type: 'object',
                        properties: {
                            advices: {
                                description: 'Advices for the child today',
                                type: 'string',
                            },
                            weaknesses: {
                                description: 'Some weaknesses of the child today',
                                type: 'string',
                            },
                            feedback: {
                                description: 'Today feedback to child, to motivate him grow up',
                                type: 'string',
                            },
                        },
                        required: ['advices', 'weaknesses', 'feedback'],
                        additionalProperties: false,
                    },
                    strict: true,
                },
            },
        })
        ?.then(data => {
            const parsed = JSON.parse(data.choices[0]?.message?.content || '') as {
                advices: string;
                weaknesses: string;
                feedback: string;
            };
            return {
                advices: parsed?.advices,
                weaknesses: parsed?.weaknesses,
                feedback: parsed?.feedback,
            };
        });
};
