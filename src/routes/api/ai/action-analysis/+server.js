// API endpoint for analyzing player actions that aren't understood by the standard parser

import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const action = data.action || '';
    
    // This would typically call an LLM API like OpenAI
    // For now, we're creating a simple response generator
    const response = analyzePlayerAction(action);
    
    return json({ response });
  } catch (error) {
    console.error('Error analyzing action:', error);
    return json(
      { response: "I'm not sure what you're trying to do. Try a different command or type 'help'." }, 
      { status: 200 } // Still return 200 to avoid breaking the game flow
    );
  }
}

// Function to analyze player input when standard commands don't match
function analyzePlayerAction(action) {
  const lowercase = action.toLowerCase();
  
  // Check for various alternative phrasings or actions
  if (lowercase.includes('search') || lowercase.includes('examine') || lowercase.includes('inspect')) {
    return "You search carefully, taking in every detail. Try using 'look at' to examine specific objects or areas.";
  }
  
  if (lowercase.includes('cast') || lowercase.includes('spell') || lowercase.includes('magic')) {
    return "As a familiar, your magic is limited without your witch. You might be able to perform simple magical tasks with the right ingredients or in places of power.";
  }
  
  if (lowercase.includes('hide') || lowercase.includes('sneak') || lowercase.includes('stealth')) {
    return "You move silently, keeping to the shadows. Being a familiar has its advantages - you're naturally stealthy and can fit into small spaces.";
  }
  
  if (lowercase.includes('climb') || lowercase.includes('jump') || lowercase.includes('leap')) {
    return "You're agile and can climb or jump to most places without difficulty. Specify what you want to climb on or jump to.";
  }
  
  if (lowercase.includes('smell') || lowercase.includes('sniff') || lowercase.includes('scent')) {
    return "Your familiar senses are keen. You detect various scents - some human, some animal, some magical. The air carries information humans would never notice.";
  }
  
  if (lowercase.includes('eat') || lowercase.includes('drink') || lowercase.includes('consume')) {
    return "Your physical needs are different from humans. While you can eat and drink, your focus is on avenging your witch, not sustenance.";
  }
  
  if (lowercase.includes('remember') || lowercase.includes('think') || lowercase.includes('recall')) {
    return "You recall your life with the witch - the quiet evenings by the fire, the midnight herb gathering, the villagers who came seeking cures and those who whispered behind their hands. The memory of finding her dead is still raw.";
  }
  
  // If all else fails, give a generic response encouraging exploration
  return "You consider your options. As your witch's familiar, you have certain advantages - stealth, animal senses, and an attunement to magic. Try exploring your surroundings using commands like 'look', 'move', 'take', or 'talk'.";
}
