import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
	try {
		const { playerInput, characterInfo } = await request.json();

		const taskRules = `Basic tasks do not require rules and get a false. Most tasks that are normal to humans are really difficult for animals, unless they're broken down into smaller steps.
    The player can lower their danger by solving, or running away from, their problems.
    The traits are CLEVER (understand/interact with humans), FIERCE (scare, drag, push, carry, bite, scratch), 
    SLY (sneak, steal, hide), QUICK (outpace, climb, evade).
    Task difficulties are on a scale of 6-10: 6 - Simple, 7 - Basic, 8 - Challenging, 9 - Difficult, 10 - Near-impossible.
    Determine if this action is a task worth rolling for, determine how difficult this task would be from 6-10, then determine if this task is dangerous for the character.`;

		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: `You are analyzing player actions in the game 'The Witch is Dead'. ${taskRules}`
				},
				{
					role: 'user',
					content: `Character Info: ${JSON.stringify(characterInfo)}\nPlayer Action: "${playerInput}"`
				}
			]
		});

		const result = JSON.parse(response.choices[0].message.content);
		return json(result);
	} catch (err) {
		console.error('Action analysis error:', err);
		return error(500, 'Failed to analyze action');
	}
}
