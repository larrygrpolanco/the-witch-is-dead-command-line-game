import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
	try {
		const { prompt, context, systemPrompt } = await request.json();

		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: systemPrompt || "You are the game master for 'The Witch is Dead.'"
				},
				{ role: 'user', content: `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}` }
			],
			temperature: 0.7,
			max_tokens: 500,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.6
		});

		return json({
			message: response.choices[0].message.content
		});
	} catch (err) {
		console.error('OpenAI API error:', err);
		return error(500, 'Failed to communicate with AI service');
	}
}
