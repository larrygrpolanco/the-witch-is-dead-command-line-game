import random
import sys
import time
import os
import json
import openai

from dotenv import load_dotenv


class Game:
    def __init__(self):
        self.gm = ChatGPTGameMaster()
        self.player = None
        self.witch_hunter = None
        self.village = None
        self.twist = None

    def start_game(self):
        os.system("cls" if os.name == "nt" else "clear")
        slow_print("Welcome to 'The Witch is Dead'!")
        self.create_player()
        self.create_witch_hunter()
        self.create_village()
        self.main_game_loop()

    def create_player(self):
        name = "Lar"  # Debugging
        # name = slow_input("Enter your name: ")
        self.determine_animal(name)
        print()

    def determine_animal(self, name):
        slow_print("You are a cute woodland animal. Let's find out which one.")
        slow_print("Rolling the dice")
        slow_print("...", delay=0.5)
        animal_roll = roll_dice(10)
        self.player = Player(name, animal_roll)
        slow_print(
            f"You are a {self.player.animal}. \nYou have four traits:\n\
                CLEVER: {self.player.traits['Clever']}  (understand/interact with humans)\n\
                FIERCE: {self.player.traits['Fierce']}  (scare, drag, push, carry, bite, scratch)\n\
                SLY: {self.player.traits['Sly']}    (sneak, steal, hide)\n\
                QUICK: {self.player.traits['Quick']}    (outpace, climb, evade)",
            delay=0.0,  # Debugging change back to .01
        )
        print()
        slow_print(f"Your witch taught you one spell: {self.player.spell}")
        print()

        accept_character = "y"  # Debugging
        # accept_character = slow_input(
        #     f"Do you want to play as a {self.player.animal}? (y/n): "
        # )

        if accept_character.strip().lower() == "n":
            slow_print("Rerolling your animal.")
            slow_print("...", delay=0.5)
            print()
            self.determine_animal(name)
        else:
            slow_print(
                "Once upon a time, \nthere was a kind and wise and beautiful witch who lived in the forest with her familiars, \nand her life was peaceful and happy. \nUntil a FUCKING WITCH-HUNTER broke into her cottage and dragged her our and FUCKING MURDERED HER and now she’s DEAD. \nBut if you get revenge and kill him and bring his EYES to her corpse within a week she’ll come back to life. \nOr so you’ve heard. \nEven if it doesn’t work, at least he’s dead. \nThe Witch-Hunter has retreated to the village, the FUCKING COWARD. \nGet him.",
                delay=0.0,  # Debugging, needs to be faster thant the rest of it or just removed
            )
            print()
            slow_print(
                f"I am sorry for your loss, {self.player.name} the {self.player.animal}...",
                delay=0.0,  # Debugging change back to .03
            )
            print()
        # Upadate Game states
        self.gm.update_game_state("player_name", self.player.name)
        self.gm.update_game_state("player_animal", self.player.animal)
        self.gm.update_game_state("player_traits", self.player.traits)
        self.gm.update_game_state("player_spell", self.player.spell)
        self.gm.update_game_state("player_danger", self.player.danger)

    def create_witch_hunter(self):
        roll = roll_dice(10)
        self.witch_hunter = WitchHunter(roll)
        slow_print(f"The Witch-Hunter is {self.witch_hunter.description}")
        self.gm.update_game_state("witch_hunter", self.witch_hunter.description)

    def create_village(self):
        rolls = [roll_dice(10) for _ in range(2)]
        self.village = Village(rolls)
        slow_print(f"The village is {self.village.description}")

        twist_roll = roll_dice(10)
        self.twist = get_twist(twist_roll)
        slow_print("The twist is determined but kept secret by the GM.")

        self.gm.update_game_state("village", self.village.description)
        self.gm.update_game_state("twist", self.twist)

    def main_game_loop(self):
        while True:
            print()
            command = (
                slow_input(
                    "What do you want to do? (e.g., use quit to end and info for story details): "
                )
                .strip()
                .lower()
            )
            if command == "quit":
                slow_print("Thanks for playing!")
                break
            elif command == "info":
                slow_print("Game Information:")
                slow_print(f"Player Name: {self.player.name}")
                slow_print(f"Animal: {self.player.animal}")
                slow_print(f"Traits: {self.player.traits}")
                slow_print(f"Spell: {self.player.spell}")
                slow_print(f"Danger Level: {self.player.danger}")
                slow_print(f"Witch-Hunter Description: {self.witch_hunter.description}")
                slow_print(f"Village Description: {self.village.description}")
                slow_print(f"Twist: {self.twist}")
            else:
                # Determin Player action
                action_result = self.gm.determine_player_action(command)

                if action_result["Task"]:
                    # Extract task and trait from the result
                    task_trait = action_result["Trait"]
                    difficulty = action_result["Difficulty"]

                    task = action_result["Description"]
                    print()
                    roll_confirm = (
                        slow_input(
                            f"You are trying to {task} which will require you to roll for {task_trait}\n(You have {self.player.traits[task_trait]} and can add that to your roll). \nThis task requires a {difficulty}. Roll dice? (y/n): "
                        )
                        .strip()
                        .lower()
                    )

                    if roll_confirm == "y":
                        roll_result = self.roll_dice(10)
                        slow_print("...", delay=0.0)  # Debugging change back to .05
                        slow_print(f"You rolled a {roll_result}.")

                        # Second call to LLM: Evaluate the task based on the dice roll
                        task_result = self.gm.evaluate_task(command, roll_result)
                        slow_print(task_result)  # Display the task outcome
                    else:
                        slow_print("You chose not to roll the dice.")

                response = self.gm.generate_response(command)
                slow_print(response)


class Player:
    ANIMALS = {
        1: ("Fox", {"Clever": 2, "Fierce": 2, "Sly": 1, "Quick": 1}),
        2: ("Cat", {"Clever": 0, "Fierce": 1, "Sly": 3, "Quick": 2}),
        3: ("Toad", {"Clever": 1, "Fierce": 0, "Sly": 2, "Quick": 1}),
        4: ("Spider", {"Clever": 2, "Fierce": 0, "Sly": 3, "Quick": 1}),
        5: ("Owl", {"Clever": 3, "Fierce": 1, "Sly": 1, "Quick": 2}),
        6: ("Hare", {"Clever": 2, "Fierce": 2, "Sly": 1, "Quick": 1}),
        7: ("Magpie", {"Clever": 2, "Fierce": 1, "Sly": 1, "Quick": 2}),
        8: ("Crow", {"Clever": 2, "Fierce": 1, "Sly": 2, "Quick": 1}),
        9: ("Dog", {"Clever": 1, "Fierce": 3, "Sly": 0, "Quick": 1}),
        10: ("Rat", {"Clever": 1, "Fierce": 0, "Sly": 2, "Quick": 2}),
    }

    SPELLS = {
        1: "Unseen hand",
        2: "Conjure light",
        3: "Speak human",
        4: "Lock/unlock, open/close",
        5: "Conjure dinner",
        6: "Make flame",
        7: "Tidy, clean, and mend",
        8: "Plant Growth",
        9: "Distract/Confuse",
        10: "Make a book read itself aloud",
    }

    def __init__(self, name, animal_roll):
        self.name = name
        self.animal, self.traits = self.ANIMALS[animal_roll]
        self.spell = self.SPELLS[roll_dice(10)]
        self.danger = 0

    def use_spell(self):
        slow_print(f"Using spell: {self.spell}")
        # Implement spell mechanics

    def perform_task(self, task):
        trait = (
            slow_input(
                f"Which trait do you want to use for {task}? (Clever, Fierce, Sly, Quick): "
            )
            .strip()
            .capitalize()
        )
        if trait in self.traits:
            roll = roll_dice(10)
            if roll + self.traits[trait] >= task.difficulty:
                slow_print(f"Success! You completed the task.")
            else:
                slow_print(f"Failed! You gain a point of danger.")
                self.danger += 1
                if roll <= self.danger:
                    slow_print("You are in serious trouble!")
                    # Handle serious trouble
        else:
            slow_print("Invalid trait.")


class WitchHunter:
    DESCRIPTIONS = {
        1: "Armed and tough",
        2: "Wizened and wise",
        3: "Drunk and violent",
        4: "Pious and aggressive",
        5: "Guarded and cowardly",
        6: "Magical and jealous",
        7: "Clever and cruel",
        8: "Duplicitous and hidden",
        9: "Jolly and well-meaning",
        10: "Headstrong and wild",
    }

    def __init__(self, roll):
        self.description = self.DESCRIPTIONS[roll]


class Village:
    DESCRIPTIONS = {
        1: "under the thumb of the baron",
        2: "filled with cheery gnomes",
        3: "controlled by a creepy cult",
        4: "devoutly religious",
        5: "incredibly superstitious",
        6: "at war with forest tribes",
        7: "built around a wizard college",
        8: "full of hardy mining folk",
        9: "shady and dangerous",
        10: "oppressively perfect",
    }

    def __init__(self, rolls):
        self.description = (
            f"{self.DESCRIPTIONS[rolls[0]]} and {self.DESCRIPTIONS[rolls[1]]}"
        )


class ChatGPTGameMaster:
    def __init__(self):
        load_dotenv()
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.state_manager = GameState()
        self.session_system_prompt = (
            "You are the game master for 'The Witch is Dead.' Guide the player through the game, manage the story flow. You are a story teller do not talk about rules or mechanics. The player is always asked 'What do you want to do?' and you should respond to their actions. Keeping the story context in mind. Use simple langauge and keep your responses concise."
            + self.state_manager.get_context()
        )

    def send_prompt(self, prompt_messages):
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=prompt_messages,
            temperature=0.7,
            max_tokens=200,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.6,
        )
        return response.choices[0].message.content

    def generate_response(self, player_input):
        context = "\n".join(self.state_manager.summarize_history())
        user_prompt = f"{player_input}"

        prompt_messages = [
            {"role": "system", "content": self.session_system_prompt},
            {
                "role": "assistant",
                "content": f"The story so far: {context} What do yo want to do next?",
            },
            {"role": "user", "content": f"Player action: {user_prompt}"},
        ]

        answer = self.send_prompt(prompt_messages)
        self.state_manager.add_to_history(f"User: {player_input}")
        self.state_manager.add_to_history(f"ChatGPT: {answer}")

        return answer

    def determine_player_action(self, player_input):
        player_info = (
            self.state_manager.get_player_info()
        )  # not being given, extra information and uncessary
        task_rules = "Most tasks that are normal to humans are really difficult for animals, unless they’re broken down into smaller steps: remember, you don’t have opposable thumbs, and all you know of the human world is what the witch taught you. You can talk to other animals of the same or similar species. (The player can lower their danger by solving, or running away from, their problems.)\n\
        \
        Determine if this action is a task or worth rolling for, determine how difficult this task would be from 6-10, then determine if this task is dangerous for the character. Respond with JSON format: 'Task': True/False, 'Description': [description of attempted task],'Danger': True/False, 'Trait': '[Trait]', 'Difficulty': [Difficulty]\n\
        Example: 'Task': True, 'Description': 'Trying to steal the key from the witch hunter', 'Danger': True, 'Trait': 'Sly', 'Difficulty': 7\n\
        \
        The traits are CLEVER (understand/interact with humans)\n\
        FIERCE (scare, drag, push, carry, bite, scratch)\n\
        SLY (sneak, steal, hide)\n\
        QUICK (outpace, climb, evade)\n\
        Task difficulties are on a scale of 6-10: 6 - Simple, 7 - Basic, 8 - Challenging, 9 - Difficult, 10 - Near-impossible"
        response = self.client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": f"{self.session_system_prompt}\nRules: {task_rules}",
                },
                {"role": "user", "content": player_input},
            ],
        )
        json_response = json.loads(response.choices[0].message.content)
        print(json_response)  # Debugging
        return json_response

    def evaluate_task(self, player_input, roll_result):
        context = "\n".join(self.state_manager.summarize_history())
        full_prompt = f"{context}\nPlayer action: {player_input}; Dice roll: {roll_result}\nEvaluate the outcome."
        return self.send_prompt(full_prompt)

    def update_game_state(self, key, value):
        self.state_manager.update_state(key, value)


class GameState:
    def __init__(self):
        self.player_name = None
        self.player_animal = None
        self.player_traits = {}
        self.player_spell = None
        self.player_danger = 0
        self.witch_hunter = None
        self.village = None
        self.twist = None
        self.conversation_history = []

    def update_state(self, key, value):
        setattr(self, key, value)

    def add_to_history(self, message):
        self.conversation_history.append(message)

    def get_context(self):
        player_info = self.get_player_info()
        return f"Player info: {player_info}\n" + "\nStory:".join(
            self.conversation_history
        )

    def get_player_info(self):
        traits_info = "\n".join(
            [f"{trait}: {value}" for trait, value in self.player_traits.items()]
        )
        return (
            f"Player Name: {self.player_name}\n"
            f"Animal: {self.player_animal}\n"
            f"Traits:\n{traits_info}\n"
            f"Spell: {self.player_spell}\n"
            f"Danger Level: {self.player_danger}"
        )

    def summarize_history(self):
        # Implement a function that summarizes the history
        # For now, let's just keep the last 10 interactions
        return self.conversation_history[-10:]


# # Example of creating a game state object
# game_state = GameState()

# # Example of updating the state
# game_state.update_state("current_village", "Village A")
# game_state.update_state("current_twist", "A mysterious fog surrounds the village.")

# # Adding messages to conversation history
# game_state.add_to_history("Player moved to Village A.")
# game_state.add_to_history("A mysterious fog surrounds the village.")


class Task:
    def __init__(self, description, difficulty):
        self.description = description
        self.difficulty = difficulty


def get_twist(roll):
    twists = {
        1: "The village folk are in on it",
        2: "A rival witch set her up",
        3: "The Witch-Hunter didn’t do it",
        4: "The Witch-Hunter is waiting for you",
        5: "The village folk are having a festival",
        6: "The Witch-Hunter died, and is being buried",
        7: "There are two (rival) Witch-Hunters in the village",
        8: "The village is abandoned",
        9: "The Witch-Hunter has dragged a suspect up for interrogation",
        10: "The village folk hate the Witch-Hunter",
    }
    return twists[roll]


def roll_dice(sides):
    return random.randint(1, sides)


def slow_print(text, delay=0.0):
    """
    Prints the given text to the terminal one character at a time with a delay.

    :param text: The text to print.
    :param delay: The delay in seconds between each character.
    """
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()


def slow_input(prompt, delay=0.02):
    """
    Prints the given prompt to the terminal one character at a time with a delay,
    then captures the user's input.

    :param prompt: The prompt to print.
    :param delay: The delay in seconds between each character of the prompt.
    :return: The user's input as a string.
    """
    for char in prompt:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    return input()


if __name__ == "__main__":
    game = Game()
    game.start_game()
