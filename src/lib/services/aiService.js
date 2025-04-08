class AIService {
	constructor() {
		this.baseUrl = '/api/ai';
	}

	async generateBasicResponse(playerInput, gameContext) {
		try {
			const systemPrompt =
				"You are the game master for 'The Witch is Dead.' Guide the player through the game and manage the story flow. Player character animals don't have opposable thumbs, and all they know of the human world is what the witch taught them. They can talk to other animals of the same or similar species. You are a storyteller, so do not talk about rules or mechanics. Use simple language and keep your responses within 100 words.";

			const response = await fetch(`${this.baseUrl}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					prompt: playerInput,
					context: gameContext,
					systemPrompt
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get AI response');
			}

			const data = await response.json();
			return data.message;
		} catch (error) {
			console.error('Error generating AI response:', error);
			return 'Something went wrong with the magical forces that guide our story. Please try again.';
		}
	}

	async analyzeAction(playerInput, characterInfo) {
		try {
			const response = await fetch(`${this.baseUrl}/action-analysis`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					playerInput,
					characterInfo
				})
			});

			if (!response.ok) {
				throw new Error('Failed to analyze action');
			}

			return await response.json();
		} catch (error) {
			console.error('Error analyzing action:', error);
			// Return a default analysis that doesn't require a roll
			return { Task: false };
		}
	}

	async generateTaskResponse(playerInput, taskResult, gameContext) {
		try {
			const systemPrompt = `You are the game master for 'The Witch is Dead.' Give a story description of what just happened with this task. ${taskResult.Success ? 'The player succeeded' : 'The player failed'} ${taskResult.SeriousTrouble ? 'but is in serious trouble' : ''}.`;

			const response = await fetch(`${this.baseUrl}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					prompt: `Player tried to ${taskResult.Description}. Roll result: ${taskResult.Roll + taskResult.TraitValue} vs difficulty ${taskResult.Difficulty}.`,
					context: {
						...gameContext,
						taskResult
					},
					systemPrompt
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get task response');
			}

			const data = await response.json();
			return data.message;
		} catch (error) {
			console.error('Error generating task response:', error);
			return 'The magical forces guiding our story have faltered. Please try again.';
		}
	}
}

export const aiService = new AIService();
