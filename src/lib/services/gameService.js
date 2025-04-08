import { get } from 'svelte/store';
import { gameState } from '../stores/gameStore';
import { aiService } from './aiService';
import { rollDice } from '../utils/dice';
import gameData from '../data/gameData';

// Constants
const GAME_ACTIONS = {
  MOVE: 'move',
  LOOK: 'look',
  TAKE: 'take',
  USE: 'use',
  TALK: 'talk',
  ATTACK: 'attack',
  HELP: 'help',
};

// Initialize the game
export function initGame() {
  gameState.set({
    currentLocation: 'start',
    inventory: [],
    stats: {
      strength: rollDice(6),
      agility: rollDice(6),
      wits: rollDice(6),
      charm: rollDice(6),
      health: 100,
      inventory: [],
    },
    currentCharacter: {
      id: 'familiar',
      name: 'Familiar',
      type: 'animal',
    },
    messages: [
      {
        text: 'Your witch is dead. You are her familiar. Avenge her.',
        type: 'system',
      },
      {
        text: 'You find yourself in the witch\'s cottage. The smell of herbs and potions lingers in the air. Your witch\'s body lies on the floor, a silver dagger protruding from her chest.',
        type: 'narration',
      },
    ],
    waitingForInput: true,
    inputPlaceholder: 'What will you do?',
  });
}

// Main command processing function
export async function processCommand(command) {
  if (!command || command.trim() === '') return;
  
  // Add the player's command to the message list
  addMessage(`> ${command}`, 'command');
  
  // Set waiting for input to false to disable the input temporarily
  gameState.update(state => ({ ...state, waitingForInput: false }));
  
  // Parse the command
  const parsedCommand = parseCommand(command);
  
  // Process the parsed command
  try {
    await executeCommand(parsedCommand);
  } catch (error) {
    console.error('Error executing command:', error);
    addMessage('Something went wrong. Please try again.', 'system');
  }
  
  // Re-enable input
  gameState.update(state => ({ ...state, waitingForInput: true }));
}

// Helper function to parse the command
function parseCommand(commandString) {
  const lowerCommand = commandString.toLowerCase().trim();
  
  // Check for help command
  if (lowerCommand === 'help') {
    return { action: GAME_ACTIONS.HELP };
  }
  
  // Look for action verbs
  let action, target;
  
  if (lowerCommand.startsWith('look')) {
    action = GAME_ACTIONS.LOOK;
    target = lowerCommand.replace('look', '').trim();
    if (target.startsWith('at ')) target = target.replace('at ', '');
  } 
  else if (lowerCommand.startsWith('move') || lowerCommand.startsWith('go')) {
    action = GAME_ACTIONS.MOVE;
    target = lowerCommand.replace(/^(move|go)\s+to\s+|^(move|go)\s+/, '').trim();
  }
  else if (lowerCommand.startsWith('take') || lowerCommand.startsWith('pick up') || lowerCommand.startsWith('grab')) {
    action = GAME_ACTIONS.TAKE;
    target = lowerCommand.replace(/^(take|pick up|grab)\s+/, '').trim();
  }
  else if (lowerCommand.startsWith('use')) {
    action = GAME_ACTIONS.USE;
    target = lowerCommand.replace('use', '').trim();
    
    // Check for 'use X on Y' pattern
    const useMatch = /use\s+(.+?)\s+(?:on|with)\s+(.+)/i.exec(lowerCommand);
    if (useMatch) {
      return {
        action: GAME_ACTIONS.USE,
        item: useMatch[1].trim(),
        target: useMatch[2].trim()
      };
    }
  }
  else if (lowerCommand.startsWith('talk') || lowerCommand.startsWith('speak')) {
    action = GAME_ACTIONS.TALK;
    target = lowerCommand.replace(/^(talk|speak)\s+(?:to|with)?\s+/, '').trim();
  }
  else if (lowerCommand.startsWith('attack') || lowerCommand.startsWith('fight')) {
    action = GAME_ACTIONS.ATTACK;
    target = lowerCommand.replace(/^(attack|fight)\s+/, '').trim();
  }
  
  return { action, target };
}

// Execute the parsed command
async function executeCommand({ action, target, item }) {
  const state = get(gameState);
  const location = gameData.locations[state.currentLocation];
  
  if (!action) {
    // No recognized action, use AI to interpret the command
    const aiResponse = await aiService.analyzeAction(target || '');
    addMessage(aiResponse, 'narration');
    return;
  }
  
  switch (action) {
    case GAME_ACTIONS.HELP:
      displayHelp();
      break;
      
    case GAME_ACTIONS.LOOK:
      if (!target || target === '') {
        // Look at the current location
        addMessage(location.description, 'narration');
      } else {
        // Look at a specific object
        lookAtObject(target);
      }
      break;
      
    case GAME_ACTIONS.MOVE:
      moveToLocation(target);
      break;
      
    case GAME_ACTIONS.TAKE:
      takeObject(target);
      break;
      
    case GAME_ACTIONS.USE:
      useItem(item, target);
      break;
      
    case GAME_ACTIONS.TALK:
      talkToCharacter(target);
      break;
      
    case GAME_ACTIONS.ATTACK:
      attackTarget(target);
      break;
      
    default:
      // Use AI to interpret unknown commands
      const aiResponse = await aiService.analyzeAction(target || '');
      addMessage(aiResponse, 'narration');
  }
}

// Helper function to add a message to the game state
function addMessage(text, type = 'narration', speed = 30) {
  gameState.update(state => ({
    ...state,
    messages: [...state.messages, { text, type, speed }]
  }));
}

// Command handler functions
function displayHelp() {
  addMessage(
    'Available commands:\n' +
    '- LOOK: Look at your surroundings or a specific object\n' +
    '- MOVE/GO: Move to a different location\n' +
    '- TAKE/PICK UP: Take an object\n' +
    '- USE: Use an item, possibly on another object\n' +
    '- TALK/SPEAK: Talk to a character\n' +
    '- ATTACK/FIGHT: Attack a target\n\n' +
    'Examples:\n' +
    '- "look around"\n' +
    '- "go to forest"\n' +
    '- "take potion"\n' +
    '- "use key on door"\n' +
    '- "talk to villager"\n' +
    '- "attack guard"',
    'system'
  );
}

function lookAtObject(target) {
  const state = get(gameState);
  const location = gameData.locations[state.currentLocation];
  
  // Check if the target is in the location's objects
  const objects = location.objects || [];
  const foundObject = objects.find(obj => obj.name.toLowerCase() === target.toLowerCase());
  
  if (foundObject) {
    addMessage(foundObject.description, 'narration');
    return;
  }
  
  // Check if the target is a character in the location
  const characters = location.characters || [];
  const foundCharacter = characters.find(char => char.name.toLowerCase() === target.toLowerCase());
  
  if (foundCharacter) {
    addMessage(foundCharacter.description, 'narration');
    return;
  }
  
  // Check inventory
  const inventoryItem = state.stats.inventory.find(item => item.toLowerCase() === target.toLowerCase());
  if (inventoryItem) {
    const itemData = gameData.items[inventoryItem.toLowerCase()];
    if (itemData) {
      addMessage(itemData.description, 'narration');
      return;
    }
  }
  
  // If target is "around" or similar, describe the location
  if (['around', 'surroundings', 'here', 'room', 'area'].includes(target.toLowerCase())) {
    addMessage(location.description, 'narration');
    return;
  }
  
  // Nothing found
  addMessage(`You don't see ${target} here.`, 'narration');
}

function moveToLocation(target) {
  const state = get(gameState);
  const currentLocation = gameData.locations[state.currentLocation];
  
  // Check if the target is a valid exit
  const exits = currentLocation.exits || [];
  const foundExit = exits.find(exit => exit.name.toLowerCase() === target.toLowerCase());
  
  if (foundExit) {
    // Check if the exit is locked
    if (foundExit.locked) {
      addMessage(foundExit.lockedMessage || `The way to ${target} is locked or blocked.`, 'narration');
      return;
    }
    
    // Move to the new location
    const newLocationId = foundExit.leadsTo;
    const newLocation = gameData.locations[newLocationId];
    
    if (newLocation) {
      gameState.update(state => ({
        ...state,
        currentLocation: newLocationId
      }));
      
      addMessage(`You move to ${newLocation.name}.`, 'narration');
      addMessage(newLocation.description, 'narration');
      return;
    }
  }
  
  // Target not found
  addMessage(`You can't go to ${target} from here.`, 'narration');
}

function takeObject(target) {
  const state = get(gameState);
  const location = gameData.locations[state.currentLocation];
  
  // Check if the target is in the location's objects
  const objects = location.objects || [];
  const foundObjectIndex = objects.findIndex(obj => obj.name.toLowerCase() === target.toLowerCase());
  
  if (foundObjectIndex >= 0) {
    const foundObject = objects[foundObjectIndex];
    
    // Check if the object can be taken
    if (foundObject.canTake === false) {
      addMessage(foundObject.cantTakeMessage || `You can't take the ${target}.`, 'narration');
      return;
    }
    
    // Add to inventory
    gameState.update(state => ({
      ...state,
      stats: {
        ...state.stats,
        inventory: [...state.stats.inventory, foundObject.name]
      }
    }));
    
    // Remove from location
    if (foundObject.staysAfterTaking !== true) {
      // Create a function to update the location object in the game data
      // This is a simplified example - in a real game, you'd want to update the game data more carefully
      const updatedObjects = [...objects];
      updatedObjects.splice(foundObjectIndex, 1);
      // You'd update the location's objects here in a real implementation
    }
    
    addMessage(`You take the ${target}.`, 'narration');
    if (foundObject.onTake) {
      addMessage(foundObject.onTake, 'narration');
    }
    return;
  }
  
  // Target not found
  addMessage(`You don't see ${target} here.`, 'narration');
}

function useItem(item, target) {
  const state = get(gameState);
  
  // Check if item is in inventory
  const inventoryItem = state.stats.inventory.find(invItem => 
    invItem.toLowerCase() === item.toLowerCase());
  
  if (!inventoryItem) {
    addMessage(`You don't have ${item} in your inventory.`, 'narration');
    return;
  }
  
  const location = gameData.locations[state.currentLocation];
  
  // Check if target is in the current location
  const objects = location.objects || [];
  const targetObject = objects.find(obj => obj.name.toLowerCase() === target.toLowerCase());
  
  // Check if target is a character
  const characters = location.characters || [];
  const targetCharacter = characters.find(char => char.name.toLowerCase() === target.toLowerCase());
  
  // Check use cases
  if (targetObject) {
    // Check for interaction rules in game data
    const itemData = gameData.items[inventoryItem.toLowerCase()];
    if (itemData && itemData.useWith && itemData.useWith[target.toLowerCase()]) {
      const interaction = itemData.useWith[target.toLowerCase()];
      addMessage(interaction.message, 'narration');
      
      // Handle any state changes from the interaction
      if (interaction.unlocks) {
        // Update game state for unlocking things
        // This is simplified - real implementation would update the game data
      }
      
      return;
    }
  } else if (targetCharacter) {
    // Handle using items on characters
    // Similar logic as above
  }
  
  // Default case if no specific interaction is defined
  addMessage(`You try to use ${item} on ${target}, but nothing happens.`, 'narration');
}

function talkToCharacter(target) {
  const state = get(gameState);
  const location = gameData.locations[state.currentLocation];
  
  // Check if target is a character in the location
  const characters = location.characters || [];
  const targetCharacter = characters.find(char => char.name.toLowerCase() === target.toLowerCase());
  
  if (targetCharacter) {
    if (targetCharacter.dialogue) {
      addMessage(`${targetCharacter.name}: "${targetCharacter.dialogue}"`, 'character');
      return;
    } else {
      addMessage(`${targetCharacter.name} doesn't respond.`, 'narration');
      return;
    }
  }
  
  // Target not found
  addMessage(`There's no ${target} here to talk to.`, 'narration');
}

function attackTarget(target) {
  const state = get(gameState);
  const location = gameData.locations[state.currentLocation];
  
  // Check if target is a character in the location
  const characters = location.characters || [];
  const targetCharacter = characters.find(char => char.name.toLowerCase() === target.toLowerCase());
  
  if (targetCharacter) {
    // Roll for attack
    const attackRoll = rollDice(6);
    const strengthBonus = state.stats.strength - 3; // Strength above average adds to attack
    
    if (attackRoll + strengthBonus >= 4) { // Arbitrary difficulty
      addMessage(`You attack ${targetCharacter.name} and hit!`, 'narration');
      
      // Handle character's response to being attacked
      if (targetCharacter.onAttackSuccess) {
        addMessage(targetCharacter.onAttackSuccess, 'narration');
      } else {
        addMessage(`${targetCharacter.name} is hurt by your attack.`, 'narration');
      }
    } else {
      addMessage(`You attack ${targetCharacter.name} but miss!`, 'narration');
      
      // Handle character's response to failed attack
      if (targetCharacter.onAttackFail) {
        addMessage(targetCharacter.onAttackFail, 'narration');
      }
    }
    return;
  }
  
  // Check if target is an object
  const objects = location.objects || [];
  const targetObject = objects.find(obj => obj.name.toLowerCase() === target.toLowerCase());
  
  if (targetObject) {
    if (targetObject.canAttack === false) {
      addMessage(targetObject.cantAttackMessage || `You can't attack the ${target}.`, 'narration');
    } else {
      addMessage(`You attack the ${target}.`, 'narration');
      if (targetObject.onAttack) {
        addMessage(targetObject.onAttack, 'narration');
      }
    }
    return;
  }
  
  // Target not found
  addMessage(`There's no ${target} here to attack.`, 'narration');
}
