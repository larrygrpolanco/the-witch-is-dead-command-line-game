/**
 * Creates a delayed typing effect for displaying text character by character
 * @param {string} text - The text to display
 * @param {Function} updateFn - Callback function to update the display with current text
 * @param {number} speed - Milliseconds between characters (default: 30)
 * @returns {Promise} - Resolves when typing is complete
 */
export function typeText(text, updateFn, speed = 30) {
  return new Promise((resolve) => {
    let currentText = '';
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        updateFn(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
    
    // Return a function that can be used to speed up or cancel the typing
    return () => {
      clearInterval(interval);
      updateFn(text); // Show all text immediately
      resolve();
    };
  });
}

/**
 * Creates a flickering text effect like an old terminal or damaged sign
 * @param {string} text - The text to display with flickering effect
 * @param {Function} updateFn - Callback function to update the display with current text
 * @param {number} duration - Total duration of the effect in milliseconds
 * @param {number} intensity - How intense the flickering should be (0-1)
 * @returns {Promise} - Resolves when effect is complete
 */
export function flickerText(text, updateFn, duration = 2000, intensity = 0.3) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = 50; // Flicker interval in ms
    
    const flicker = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
        // Determine if we should show glitched text based on intensity
        if (Math.random() < intensity) {
          // Create a glitched version by replacing random characters
          let glitchedText = '';
          for (let i = 0; i < text.length; i++) {
            if (Math.random() < intensity * 0.5) {
              // Replace with a random character
              const randomChar = String.fromCharCode(Math.floor(Math.random() * 36) + 97);
              glitchedText += randomChar;
            } else {
              glitchedText += text[i];
            }
          }
          updateFn(glitchedText);
        } else {
          // Show normal text
          updateFn(text);
        }
        
        setTimeout(flicker, interval);
      } else {
        // Ensure we end with the correct text
        updateFn(text);
        resolve();
      }
    };
    
    flicker();
  });
}

/**
 * Creates a fade-in effect for text
 * @param {string} text - The text to display with fade-in
 * @param {Function} updateFn - Callback function that should handle opacity changes
 * @param {number} duration - Duration of fade in milliseconds
 * @returns {Promise} - Resolves when fade is complete
 */
export function fadeInText(text, updateFn, duration = 1000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = 16; // ~60fps
    
    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      updateFn(text, progress); // Pass both text and opacity
      
      if (progress < 1) {
        setTimeout(fade, interval);
      } else {
        resolve();
      }
    };
    
    fade();
  });
}

/**
 * Scrambles text and gradually resolves to the correct text
 * @param {string} text - The final text to display
 * @param {Function} updateFn - Callback to update display
 * @param {number} duration - Total duration of the effect
 * @returns {Promise} - Resolves when effect is complete
 */
export function unscrambleText(text, updateFn, duration = 2000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = 50;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/';
    
    const unscramble = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let result = '';
      for (let i = 0; i < text.length; i++) {
        // Characters gradually lock into place based on progress
        if (Math.random() < progress * 2 || text[i] === ' ') {
          result += text[i]; // Correct character
        } else {
          // Random character
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      updateFn(result);
      
      if (progress < 1) {
        setTimeout(unscramble, interval);
      } else {
        updateFn(text); // Ensure final text is correct
        resolve();
      }
    };
    
    unscramble();
  });
}
