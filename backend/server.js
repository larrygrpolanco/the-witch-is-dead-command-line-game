const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config(); // Add this line to configure dotenv

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize game state
let gameState = {
  playerName: '',
  playerAnimal: '',
  playerTraits: [],
  playerSpell: '',
  playerDanger: 0,
  witchHunter: '',
  village: '',
  twist: '',
  conversationHistory: [],
  stage: 'ask-name',
};

// game attributes to roll for
const twists = {
  1: 'The village folk are in on it',
  2: 'A rival witch set her up',
  3: 'The Witch-Hunter didn’t do it',
  4: 'The Witch-Hunter is waiting for you',
  5: 'The village folk are having a festival',
  6: 'The Witch-Hunter died, and is being buried',
  7: 'There are two (rival) Witch-Hunters in the village',
  8: 'The village is abandoned',
  9: 'The Witch-Hunter has dragged a suspect up for interrogation',
  10: 'The village folk hate the Witch-Hunter',
};

villageDescription = {
  1: 'under the thumb of the baron',
  2: 'filled with cheery gnomes',
  3: 'controlled by a creepy cult',
  4: 'devoutly religious',
  5: 'incredibly superstitious',
  6: 'at war with forest tribes',
  7: 'built around a wizard college',
  8: 'full of hardy mining folk',
  9: 'shady and dangerous',
  10: 'oppressively perfect',
};

witchHunter = {
  1: 'Armed and tough',
  2: 'Wizened and wise',
  3: 'Drunk and violent',
  4: 'Pious and aggressive',
  5: 'Guarded and cowardly',
  6: 'Magical and jealous',
  7: 'Clever and cruel',
  8: 'Duplicitous and hidden',
  9: 'Jolly and well-meaning',
  10: 'Headstrong and wild',
};

// function for rolling a d10
function rollD10() {
  return Math.floor(Math.random() * 10) + 1;
}

// function to set the non-player game state
function setNonPlayerGameState() {
  gameState.witchHunter = witchHunter[rollD10()];
  gameState.village =
    'The Village is ' +
    villageDescription[rollD10()] +
    ' and ' +
    villageDescription[rollD10()] +
    '.';
  gameState.twist = twists[rollD10()];
}

setNonPlayerGameState();

// Add this endpoint to fetch game state
app.get('/game-state', (req, res) => {
  res.json(gameState);
});

// Handle game start and initial question
app.post('/start-game', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are now taking on the roll of game master for a game of The Witch is Dead. Introduce the game to the player. Hint at the setting and the situation without giving too much away. The players don\'t kow this yet, but the village is ${gameState.village}. The Witch-Hunter is ${gameState.witchHunter}. The twist is ${gameState.twist}. Do this in a way that makes the player want to play. Keep it under 100 words. \n\
          Here is the original intoruction Once upon a time, there was a kind and wise and beautiful witch who lived in the forest with her familiars, and her life was peaceful and happy until a FUCKING WITCH-HUNTER broke into her cottage and dragged her our and FUCKING MURDERED HER and now she’s DEAD. But if you get revenge and kill him and bring his EYES to her corpse within a week she’ll come back to life. Or so you’ve heard. Even if it doesn’t work, at least he’s dead. The Witch-Hunter has retreated to the village, the FUCKING COWARD. Get him.`,
        },
      ],
    });

    res.json({
      role: 'assistant',
      content: response.choices[0].message.content,
      gameState: gameState, // Include game state in the response
    });
  } catch (error) {
    console.error('Error starting the game:', error);
    res.status(500).send('Error starting the game');
  }
});

// Handle player's input and continue the game
app.post('/next-step', async (req, res) => {
  const { role, content } = req.body;

  gameState.conversationHistory.push({ role, content });

  let responseContent;
  try {
    if (gameState.stage === 'ask-name') {
      gameState.playerName = content;
      gameState.stage = 'assign-animal-spell';

      responseContent = `Hello ${content}, you are now assigned an animal and a spell. Do you want to continue with the game or roll again for another animal?`;
    } else if (gameState.stage === 'assign-animal-spell') {
      if (content.toLowerCase() === 'roll again') {
        gameState.playerAnimal = rollD10(); // Example logic to roll for animal
        gameState.playerSpell = rollD10(); // Example logic to roll for spell
        responseContent = `You have rolled again. Your new animal is ${gameState.playerAnimal} and your spell is ${gameState.playerSpell}. Do you want to continue or roll again?`;
      } else {
        gameState.stage = 'ask-next-step';
        responseContent =
          'Great! Let us proceed with the game. [Next steps in the game...]';
      }
    } else {
      responseContent = await createCompletion([
        {
          role: 'system',
          content:
            "Continue the game of The Witch is Dead based on the player's input.",
        },
        { role, content },
      ]);
    }

    res.json({
      role: 'assistant',
      content: responseContent,
      gameState,
    });
  } catch (error) {
    console.error('Error getting response from the game:', error);
    res.status(500).send('Error getting response from the game');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
