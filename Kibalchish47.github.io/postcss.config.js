// postcss.config.js
const path = require("path"); // Import the path module

module.exports = {
  plugins: {
    // Use the 'tailwindcss' plugin key.
    // Provide a full, absolute path to your tailwind.config.js.
    tailwindcss: { config: path.join(__dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
};
