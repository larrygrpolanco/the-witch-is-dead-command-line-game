import random
import sys
import time
import os
import json
import openai

from dotenv import load_dotenv


class Game:
    def __init__(self):
        self.gm = ChatGPTGameMaster(self)
        self.player = None
        self.witch_hunter = None
        self.village = None
        self.twist = None

    def start_game(self):
        os.system("cls" if os.name == "nt" else "clear")
        slow_print("Welcome to 'The Witch is Dead'!")
        slow_print(
            "\nOnce upon a time, \nthere was a kind and wise and beautiful witch who lived in the forest with her familiars, \nand her life was peaceful and happy. \nUntil a FUCKING WITCH-HUNTER broke into her cottage and dragged her our and FUCKING MURDERED HER and now she’s DEAD. \nBut if you get revenge and kill him and bring his EYES to her corpse within a week she’ll come back to life. \nOr so you’ve heard. \nEven if it doesn’t work, at least he’s dead. \nThe Witch-Hunter has retreated to the village, the FUCKING COWARD. \nGet him.",
            delay=0.01,
        )
        self.create_player()
        self.create_witch_hunter()
        self.create_village()
        self.main_game_loop()

    def create_player(self):
        name = slow_input("Enter your name: ")
        self.determine_animal(name)
        print()

    def determine_animal(self, name):
        print()
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
            delay=0.02,
        )
        print()
        slow_print(f"Your witch taught you one spell: {self.player.spell}")
        print()

        accept_character = slow_input(
            f"Do you want to play as a {self.player.animal}? (y/n): "
        )  # Ask the player if they want to accept the character

        if accept_character.strip().lower() == "n":
            slow_print("Rerolling your animal.")
            slow_print("...", delay=0.5)
            print()
            self.determine_animal(name)
        else:
            print()
            slow_print(
                f"I am sorry for your loss, {self.player.name} the {self.player.animal}...",
                delay=0.03,
            )
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

    def restart_game(self):
        choice = slow_input("Do you want to play again? (y/n): ").strip().lower()
        if choice == "y":
            self.__init__()  # Reinitialize the game instance
            self.start_game()
        else:
            slow_print("Thanks for playing!")
            sys.exit()  # Exit the program

    def main_game_loop(self):
        while True:
            print()
            command = (
                slow_input("What do you do next?: ").strip().lower()
            )  # Get player input
            print()
            if command == "quit":  # Check if the player wants to quit
                slow_print("Thanks for playing!")
                break
            elif (
                command == "info"
            ):  # Check if the player wants to see the game information
                slow_print("Game Information:")
                slow_print(f"Player Name: {self.player.name}")
                slow_print(f"Animal: {self.player.animal}")
                slow_print(f"Traits: {self.player.traits}")
                slow_print(f"Spell: {self.player.spell}")
                slow_print(f"Danger Level: {self.player.danger}")
                slow_print(f"Witch-Hunter Description: {self.witch_hunter.description}")
                slow_print(f"Village Description: {self.village.description}")
                slow_print(f"Twist: {self.twist}")
            elif (
                command == "context"
            ):  # Check if the player wants to see the game context
                slow_print(self.gm.state_manager.get_context())
            else:
                # Determine Player action
                action_result = self.gm.determine_player_action(command)

                if action_result["Task"]:  # Check if the player is attempting a task
                    # Extract task and trait from the result
                    task_trait = action_result["Trait"]
                    difficulty = action_result["Difficulty"]
                    dangerous = action_result["Danger"]
                    player_trait_value = self.player.traits[task_trait]

                    warning = "This is a dangrous task!" if dangerous else ""

                    task = action_result["Description"]

                    print()
                    roll_confirm = (
                        slow_input(
                            f"You are trying to {task} which will require you to roll a {difficulty} for {task_trait}\n {warning}\n(You have {player_trait_value} and can add that to your roll). \n Roll dice? (y/n): "
                        )  # Ask the player if they want to roll the dice
                        .strip()
                        .lower()
                    )

                    if (
                        roll_confirm == "y"
                    ):  # Check if the player wants to roll the dice
                        roll_result = roll_dice(10)
                        slow_print("Rolling the dice")
                        slow_print("...", delay=0.5)
                        slow_print(
                            f"You rolled a {roll_result} + {player_trait_value}."
                        )
                        print()

                        task_info = {
                            "Description": task,
                            "Danger": dangerous,
                            "Trait": task_trait,
                            "Difficulty": difficulty,
                            "Roll": roll_result,
                            "Trait Value": player_trait_value,
                        }

                        # Perform the task
                        task_result = self.gm.generate_task_response(
                            player_input=command, task_json=task_info
                        )
                        slow_print(task_result)
                        continue  # Skip the rest of the loop

                    else:  # If the player chooses not to roll the dice
                        slow_print("You chose not to roll the dice.")
                        continue

                response = self.gm.generate_basic_response(command)
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
    }  # Animals and traits

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
        # Not implemented yet. Could be included as an attribute to the task json. Same can be done with a do_task function


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

    def __init__(self, roll):  # Witch hunter description
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

    def __init__(self, rolls):  # Village description
        self.description = (
            f"{self.DESCRIPTIONS[rolls[0]]} and {self.DESCRIPTIONS[rolls[1]]}"
        )


class ChatGPTGameMaster:
    def __init__(self, game):
        self.game = game  # Game instance for calling game over
        load_dotenv()
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.state_manager = GameState()
        self.session_system_prompt = (
            "You are the game master for 'The Witch is Dead.' Guide the player through the game and manage the story flow. "
            "Player character animals don’t have opposable thumbs, and all they know of the human world is what the witch taught them. They can talk to other animals of the same or similar species."
            "You are a storyteller, so do not talk about rules or mechanics. Use simple language and keep your responses within 100 words."
            + self.state_manager.get_context()
        )  # System prompt for the game

    def send_prompt(self, prompt_messages):  # Send prompt to the ChatGPT model
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=prompt_messages,
            temperature=0.7,
            max_tokens=500,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.6,
        )
        return response.choices[0].message.content

    def generate_basic_response(self, player_input):
        context = "\n".join(self.state_manager.summarize_history())

        prompt_messages = [
            {"role": "system", "content": self.session_system_prompt},
            {
                "role": "assistant",
                "content": f"The story so far: {context} What do yo want to do next?",
            },
            {"role": "user", "content": f"Player action: {player_input}"},
        ]  # Prompt messages for the model

        answer = self.send_prompt(prompt_messages)  # Send the prompt to the model
        self.state_manager.add_to_history(f"User: {player_input}")
        self.state_manager.add_to_history(f"ChatGPT: {answer}")

        return answer

    def generate_task_response(
        self, player_input, task_json
    ):  # Generate response for a task
        context = "\n".join(self.state_manager.summarize_history())
        description = task_json["Description"]
        danger = task_json["Danger"]
        trait = task_json["Trait"]
        difficulty = task_json["Difficulty"]
        trait_value = task_json["Trait Value"]
        roll = task_json["Roll"]

        # Update Danger state if task is dangerous
        if danger:
            self.state_manager.update_state(
                "player_danger", self.state_manager.player_danger + 1
            )
            slow_print(
                f"You gained a point of danger. Your danger level is now {self.state_manager.player_danger}."
            )

        # Check if player is in serious trouble (They roll equal to or under their danger)
        serious_trouble = roll <= self.state_manager.player_danger

        game_over = False
        task_result = ""

        # Check if the player succeeded or failed the task
        if roll + trait_value >= difficulty:  # Succeeded the task
            if serious_trouble:
                task_result = "You succeeded in your task, but found yourself in a perilous situation—dead, trapped, lost, or captured. The story ends here."
                game_over = True
            else:
                task_result = f"With your {trait} skill, you successfully {description}. Your effort pays off!"
        else:  # Failed the task
            if serious_trouble:
                task_result = "Your attempt to complete the task fails, and you find yourself in grave danger—dead, trapped, lost, or captured. The story ends here."
                game_over = True
            else:
                task_result = f"Despite your best efforts, you couldn't {description}. Try something else."

        # Generate the response
        prompt_messages = [
            {
                "role": "system",
                "content": f"{self.session_system_prompt} \nGive a story description of what just happened with this task.",
            },
            {
                "role": "assistant",
                "content": f"The story so far: {context}. \nThe player is trying to {description} which requires a roll of {difficulty} for {trait}. {task_result}",
            },
            {"role": "user", "content": f"Player action: {player_input}"},
        ]

        answer = self.send_prompt(prompt_messages)
        self.state_manager.add_to_history(f"User: {player_input}")
        self.state_manager.add_to_history(f"ChatGPT: {answer}")

        if game_over:  # Check if the game is over
            slow_print(answer)
            self.game.restart_game()

        return answer

    def determine_player_action(
        self, player_input
    ):  # Determine if the player action is a task which requires rolling the dice
        task_rules = (
            "Basic tasks do not require rules and get a false. Most tasks that are normal to humans are really difficult for animals, unless they’re broken down into smaller steps: "
            "The player can lower their danger by solving, or running away from, their problems.\n"
            "The traits are CLEVER (understand/interact with humans)\n"
            "FIERCE (scare, drag, push, carry, bite, scratch)\n"
            "SLY (sneak, steal, hide)\n"
            "QUICK (outpace, climb, evade)\n"
            "Task difficulties are on a scale of 6-10: 6 - Simple, 7 - Basic, 8 - Challenging, 9 - Difficult, 10 - Near-impossible\n\n"
            "Determine if this action is a task worth rolling for, determine how difficult this task would be from 6-10, then determine if this task is dangerous for the character.\n"
            "Respond with JSON format: {'Task': True/False, 'Description': [description of attempted task],'Danger': True/False, 'Trait': '[Clever/Fierce/Sly/Quick]', 'Difficulty': [number 6-10]}\n"
            "Example: {'Task': True, 'Description': 'Trying to steal the key from the witch hunter', 'Danger': True, 'Trait': 'Sly', 'Difficulty': 7}\n"
        )
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
        return json_response

    def update_game_state(self, key, value):
        self.state_manager.update_state(key, value)


class GameState:  # Game state manager
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

    def get_context(self):  # Get the game context e.g., player info, village info
        player_info = self.get_player_info()
        village_info = self.get_village_info()
        return f"Story Context:\n{player_info}\n{village_info}" + "\n".join(
            self.conversation_history
        )

    def get_player_info(self):
        traits_info = "\n".join(
            [f"{trait}: {value}" for trait, value in self.player_traits.items()]
        )
        return (
            f"The players name is {self.player_name}\n"
            f"They are a {self.player_animal}\n"
            f"Their trait stats are: \n{traits_info}\n"
            f"The only spell they know is: {self.player_spell}\n"
            f"Danger Level: {self.player_danger}"
        )

    def get_village_info(self):
        return (
            f"The Witch Hunter is {self.witch_hunter}\n"
            f"The village is {self.village}\n"
            f"The twist is {self.twist}"
        )

    def summarize_history(self):
        # Implement a function that summarizes the history
        # For now, let's just keep the last 20 interactions
        return self.conversation_history[-20:]


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


def slow_print(text, delay=0.05):  # Print text slowly
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
