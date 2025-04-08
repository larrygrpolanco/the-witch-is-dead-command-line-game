// AI Service for analyzing player actions and generating responses

/**
 * Analyzes a player action that wasn't recognized by the standard command parser
 * and returns an appropriate response.
 */
async function analyzeAction(actionText) {
  try {
    const response = await fetch('/api/ai/action-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: actionText })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in AI service:', error);
    return "I don't understand what you want to do. Try a different command or type 'help' for assistance.";
  }
}

/**
 * Generates a description for a given scene or object when the predefined
 * descriptions are not available.
 */
async function generateDescription(subject, context) {
  try {
    const response = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subject, context })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('Error generating description:', error);
    return "You see nothing unusual about it.";
  }
}

export const aiService = {
  analyzeAction,
  generateDescription
};
