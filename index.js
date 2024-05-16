import openai from './open-ai.js'
import readlineSync from 'readline-sync';
import colors from 'colors';


async function main() {
    console.log('Welcome to the AI Chatbot!'.green.bold);
    console.log('I am here to answer any questions you have!'.green);

    while (true) {
        const userMessage = readlineSync.question('You: '.blue);
    
        // If the user types 'exit', the program will end
        if (userMessage === 'exit') {
            console.log('Goodbye!'.green);
            return;
        }

        try {
            // Call the API with the user input
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: userMessage }],
                model: 'gpt-4o',
            });

            const response = completion.choices[0].message.content
            console.log(`AI: ${response}`.green);
        }
        catch (e) {
            console.log('Invalid input. Please try again.'.red);
            continue;
        }
    }
}


main();