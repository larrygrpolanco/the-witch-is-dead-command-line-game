// General AI API endpoint

import { json } from '@sveltejs/kit';

// The main handler for AI-related requests
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // This would typically call an LLM API like OpenAI
    // For now, we're mocking responses
    const response = {
      text: generateBasicResponse(data.prompt)
    };
    
    return json(response);
  } catch (error) {
    console.error('Error in AI service:', error);
    return json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}

// Temporary function to generate basic responses without a real API
function generateBasicResponse(prompt) {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('weather')) {
    return "The forest is misty today, with a chill in the air. Perfect weather for a familiar seeking revenge.";
  }
  
  if (lowercasePrompt.includes('help')) {
    return "You are a familiar whose witch has been murdered. Your goal is to find her killer and avenge her death. Try exploring the cottage, forest, and village for clues.";
  }
  
  if (lowercasePrompt.includes('witch') || lowercasePrompt.includes('master')) {
    return "Your witch was kind to those who respected nature, but feared by the villagers. She taught you much about the forest and its magic during your time together.";
  }
  
  // Default response
  return "As a familiar, you sense there may be more to discover. Explore your surroundings and use your abilities wisely.";
}
