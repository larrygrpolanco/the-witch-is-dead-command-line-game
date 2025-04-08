// Game data file with locations, objects, characters, and items

const gameData = {
  // Locations in the game
  locations: {
    start: {
      name: "Witch's Cottage",
      description: "You're in your witch's cottage. Herbs hang from the rafters, and the air smells of magic and death. Your witch's body lies on the floor, a silver dagger protruding from her chest. The front door leads outside, and a small window shows the forest beyond.",
      objects: [
        {
          name: "Witch's Body",
          description: "Your witch lies still on the floor. The silver dagger in her chest bears a symbol you recognize - the mark of the village's church. Her grimoire is missing, and there are signs of a struggle.",
          canTake: false,
          cantTakeMessage: "You can't carry your witch's body. She deserves proper rites, but first, you must avenge her."
        },
        {
          name: "Silver Dagger",
          description: "A ceremonial silver dagger with the symbol of the local church engraved on its hilt. It's currently embedded in your witch's chest.",
          canTake: true,
          onTake: "You carefully remove the dagger from your witch's chest. The silver burns your paws slightly, but your familiar nature allows you to hold it. This will be evidence against her killer."
        },
        {
          name: "Herbs",
          description: "Bundles of dried herbs hang from the rafters - rosemary, sage, thyme, and other magical plants your witch used in her spells.",
          canTake: true,
          onTake: "You gather some of the herbs. They might be useful for simple magic."
        },
        {
          name: "Window",
          description: "Through the small window, you can see the dense forest surrounding the cottage. It's getting dark outside.",
          canTake: false
        }
      ],
      exits: [
        {
          name: "Outside",
          description: "The front door of the cottage leads outside to a small garden path.",
          leadsTo: "garden"
        }
      ]
    },
    garden: {
      name: "Cottage Garden",
      description: "The garden outside the cottage is overgrown with both ordinary and magical plants. A narrow path leads through the plants to the edge of the forest. You can see footprints in the soft earth - someone left in a hurry.",
      objects: [
        {
          name: "Footprints",
          description: "The footprints are fresh and deep, suggesting someone left in a hurry. They lead toward the village.",
          canTake: false
        },
        {
          name: "Magical Plants",
          description: "Your witch grew various magical plants here - moonflowers that glow softly in the twilight, bloodroot with its crimson sap, and dreamweed with its shifting colors.",
          canTake: true,
          onTake: "You collect some of the magical plants. They might be useful for simple spells or as offerings."
        }
      ],
      exits: [
        {
          name: "Cottage",
          description: "The door leads back into the witch's cottage.",
          leadsTo: "start"
        },
        {
          name: "Forest",
          description: "A narrow path leads into the dense forest.",
          leadsTo: "forest"
        },
        {
          name: "Village",
          description: "Following the footprints would lead you toward the village.",
          leadsTo: "village_edge"
        }
      ]
    },
    forest: {
      name: "Dense Forest",
      description: "The forest is dark and ancient. The trees seem to watch you as you move between them. This place knows you as the witch's familiar. Various animals observe you from hiding places - they might be willing to help you if approached correctly.",
      objects: [
        {
          name: "Trees",
          description: "Massive old trees with twisted trunks and dense canopies. They've stood here for centuries and have seen much.",
          canTake: false
        },
        {
          name: "Mushroom Circle",
          description: "A perfect circle of red mushrooms with white spots. This fairy ring might be a way to communicate with the spirits of the forest.",
          canTake: false
        }
      ],
      characters: [
        {
          name: "Fox",
          description: "A red fox watches you from behind a fallen log. Its eyes show intelligence beyond that of a normal animal.",
          dialogue: "The villagers came for your witch at dawn. The priest led them with that silver knife. They took her book of shadows.",
          onAttackSuccess: "The fox yelps and runs away into the underbrush. You've lost a potential ally.",
          onAttackFail: "The fox easily dodges your attack and disappears into the underbrush. You've lost a potential ally."
        }
      ],
      exits: [
        {
          name: "Garden",
          description: "The path leads back to the witch's garden.",
          leadsTo: "garden"
        },
        {
          name: "Deeper Forest",
          description: "The forest grows darker and more primeval in this direction.",
          leadsTo: "deep_forest"
        }
      ]
    },
    deep_forest: {
      name: "Ancient Heart of the Forest",
      description: "You've reached the ancient heart of the forest. The canopy is so thick that little light reaches the forest floor. Massive roots create natural alcoves, and the air vibrates with old magic. A massive oak stands at the center, its trunk wider than the witch's cottage.",
      objects: [
        {
          name: "Ancient Oak",
          description: "This oak is ancient beyond reckoning. Its bark is inscribed with symbols of old magic, and its roots dive deep into the earth, connecting to places unknown.",
          canTake: false
        },
        {
          name: "Crystal Pool",
          description: "A small pool of perfectly clear water collects among the roots of the ancient oak. The water seems to glow with an inner light and might have magical properties.",
          canTake: false
        }
      ],
      characters: [
        {
          name: "Forest Spirit",
          description: "A shimmer in the air near the ancient oak slowly takes form - a translucent figure made of light, leaves, and shadow. This is one of the old spirits of the forest.",
          dialogue: "Your witch was a friend to this forest. Her killers have broken the old pact. If you seek vengeance, you must be more than a familiar - you must become as clever as the fox, as fierce as the bear, as patient as the owl.",
          onAttackSuccess: "Your attack passes harmlessly through the spirit's form. It looks at you with disappointment.",
          onAttackFail: "Your attack passes harmlessly through the spirit's form. It looks at you with disappointment."
        }
      ],
      exits: [
        {
          name: "Forest",
          description: "The path leads back to the less dense part of the forest.",
          leadsTo: "forest"
        }
      ]
    },
    village_edge: {
      name: "Edge of the Village",
      description: "You've reached the outskirts of the village. Simple wooden houses with thatched roofs cluster together, with a larger stone building - the church - rising above them. Smoke rises from chimneys, and you can hear people moving about. The villagers have always feared your witch, and by extension, you. Caution would be wise here.",
      objects: [
        {
          name: "Church",
          description: "The village church is built of gray stone with a simple wooden door. A bell tower rises from one end, and a cross tops its roof. This is where the priest who likely led the attack on your witch would be found.",
          canTake: false
        }
      ],
      characters: [
        {
          name: "Farmer",
          description: "A weather-beaten man in simple clothes works in a field at the edge of the village. He looks nervous and keeps glancing toward the forest - your presence might be making him uneasy.",
          dialogue: "Don't hurt me, familiar! I warned the witch they were coming, but I was too late. It was the priest who drove them to it - said she was consorting with dark forces. They took her book to burn it.",
          onAttackSuccess: "The farmer cries out as you attack him. People will come running soon - this was perhaps not the wisest choice.",
          onAttackFail: "The farmer flinches away, dropping his tools, and runs toward the village shouting about the witch's familiar attacking."
        }
      ],
      exits: [
        {
          name: "Garden",
          description: "The path leads back to the witch's garden.",
          leadsTo: "garden"
        },
        {
          name: "Village",
          description: "You can proceed further into the village, though it would be dangerous for a known familiar.",
          leadsTo: "village_center"
        }
      ]
    },
    village_center: {
      name: "Village Center",
      description: "You've reached the center of the village. A well stands in the middle of a small square, and villagers move about on their evening business. Many of them eye you with suspicion or fear - the witch's familiar openly walking in the village is unprecedented. The church looms at one end of the square, its doors closed.",
      objects: [
        {
          name: "Well",
          description: "The village well is built of stone with a simple wooden roof over it. Villagers come here throughout the day to draw water.",
          canTake: false
        }
      ],
      characters: [
        {
          name: "Priest",
          description: "The village priest stands near the church doors. He's a thin man in black clothes with a silver cross hanging from his neck. He's speaking to several villagers, but stops when he notices you. His hand moves to something concealed in his robes - perhaps a weapon.",
          dialogue: "So the witch's familiar has come seeking revenge? Your mistress trafficked with dark powers. We did what was necessary to protect our village. Her foul grimoire will be purified by fire at midnight.",
          onAttackSuccess: "You launch yourself at the priest, catching him by surprise. He falls back, crying out, as villagers scatter in fear. He drops something - a key - before scrambling away toward the church.",
          onAttackFail: "The priest is quicker than he looks, dodging your attack while pulling out a silver knife. 'The familiar attacks! Proof that the witch was evil!' he shouts, rallying the villagers against you."
        },
        {
          name: "Child",
          description: "A small child with curious eyes watches you from behind a barrel. Unlike the adults, the child seems more fascinated than afraid of you.",
          dialogue: "My granny says not all witches are bad. She says your witch helped her with medicines. I saw the priest take a big book into the church basement after they came back this morning. Are you going to hurt him?",
          onAttackSuccess: "The child cries out in fear and pain as you attack. This was a terrible choice that will turn everyone against you.",
          onAttackFail: "The child darts away in fear, crying out for their parents. This was not a wise choice."
        }
      ],
      exits: [
        {
          name: "Village Edge",
          description: "You can return to the outskirts of the village.",
          leadsTo: "village_edge"
        },
        {
          name: "Church",
          description: "The church doors are closed but not locked. You could enter, though it would be dangerous.",
          leadsTo: "church"
        }
      ]
    },
    church: {
      name: "Village Church",
      description: "The interior of the church is dim, lit only by a few candles. Rows of simple wooden pews face an altar at the far end. The air smells of incense and beeswax. A door behind the altar likely leads to other rooms. There's also a heavy trapdoor in the floor that probably leads to a basement or crypt.",
      objects: [
        {
          name: "Altar",
          description: "A simple stone altar covered with a white cloth. A silver cross stands upon it, along with unlit candles.",
          canTake: false
        },
        {
          name: "Trapdoor",
          description: "A heavy wooden trapdoor in the floor, reinforced with iron bands. It appears to be locked.",
          canTake: false,
          locked: true,
          lockedMessage: "The trapdoor is locked. You'd need a key to open it."
        }
      ],
      exits: [
        {
          name: "Village Center",
          description: "The main doors of the church lead back to the village center.",
          leadsTo: "village_center"
        },
        {
          name: "Basement",
          description: "The trapdoor in the floor would lead to the church basement if it were unlocked.",
          leadsTo: "church_basement",
          locked: true,
          lockedMessage: "The trapdoor is locked. You'd need a key to open it."
        }
      ]
    },
    church_basement: {
      name: "Church Basement",
      description: "The church basement is cold and damp. Shelves line the walls, holding various religious items and supplies. A table in the center holds your witch's grimoire - her precious book of shadows. It's surrounded by kindling and firewood, clearly prepared for burning.",
      objects: [
        {
          name: "Grimoire",
          description: "Your witch's grimoire - her book of shadows. This is where she recorded all her knowledge of herbs, potions, and spells. It contains generations of wisdom and is irreplaceable.",
          canTake: true,
          onTake: "You take the grimoire. Its familiar weight and smell bring back memories of your witch working through its pages by candlelight. With this, her knowledge will not be lost. Now you can truly begin your revenge or seek justice for her murder."
        },
        {
          name: "Religious Items",
          description: "The shelves hold various religious items - additional crosses, communion chalices, censers for incense, and books of prayer. Some of these items might be made of silver, which could harm a familiar like you.",
          canTake: false
        }
      ],
      exits: [
        {
          name: "Church",
          description: "The ladder leads back up to the main church through the trapdoor.",
          leadsTo: "church"
        }
      ]
    }
  },
  
  // Items that can be found or used in the game
  items: {
    "silver dagger": {
      name: "Silver Dagger",
      description: "A ceremonial silver dagger with the symbol of the local church engraved on its hilt. It causes you slight pain to hold it, but as a familiar, you can manage. This is evidence of the church's involvement in your witch's murder.",
      useWith: {
        "priest": {
          message: "You brandish the silver dagger at the priest. He blanches when he recognizes it - the very weapon used to kill your witch. 'Where did you get that?' he stammers, backing away.",
        },
        "trapdoor": {
          message: "You try to use the dagger to force the trapdoor lock, but it's too sturdy. You'll need the actual key.",
        }
      }
    },
    "herbs": {
      name: "Herbs",
      description: "A bundle of dried herbs from your witch's cottage - rosemary, sage, thyme, and other plants with magical properties.",
      useWith: {
        "fox": {
          message: "You offer some of the herbs to the fox. It approaches cautiously and accepts your offering. 'The witch was kind to us forest creatures,' it says. 'The villagers fear what they don't understand. Be cautious in the village - not all there wished her harm.'",
        }
      }
    },
    "magical plants": {
      name: "Magical Plants",
      description: "Living magical plants from your witch's garden - moonflowers, bloodroot, and dreamweed. They still pulse with magical energy.",
      useWith: {
        "crystal pool": {
          message: "You place the magical plants in the crystal pool. The water begins to glow brighter, and the plants dissolve into pure magical essence. You feel a surge of power - temporarily, you can channel more of your witch's magic than a familiar normally could.",
        },
        "forest spirit": {
          message: "You offer the magical plants to the forest spirit. It seems pleased. 'A thoughtful offering,' it says. 'Your witch taught you well. In return, I give you this knowledge: the priest keeps his keys on a hook behind the altar.'",
        }
      }
    },
    "church key": {
      name: "Church Key",
      description: "A heavy iron key that likely opens various doors in the church, including the basement trapdoor.",
      useWith: {
        "trapdoor": {
          message: "You insert the key into the trapdoor's lock and turn it. With a heavy click, the mechanism unlocks, and you can now open the trapdoor to access the church basement.",
          unlocks: "basement"
        }
      }
    },
    "grimoire": {
      name: "Witch's Grimoire",
      description: "Your witch's precious book of shadows. Its pages contain generations of knowledge about herbs, potions, spells, and the natural world. With this, you could continue your witch's work or teach a worthy successor.",
      useWith: {
        "ancient oak": {
          message: "You open the grimoire before the ancient oak. The symbols on the tree seem to resonate with those on the pages. You feel a connection forming between the book, the tree, and yourself. The forest will remember your witch through her knowledge preserved in these pages.",
        },
        "crystal pool": {
          message: "You hold the grimoire over the crystal pool. Reflections from the water illuminate the pages, revealing hidden text written in magical ink. These are your witch's most secret spells and teachings, now accessible to you.",
        }
      }
    }
  }
};

export default gameData;
