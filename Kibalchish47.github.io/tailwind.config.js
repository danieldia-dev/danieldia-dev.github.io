// tailwind.config.js
module.exports = {
  content: ["./layouts/**/*.html", "./content/**/*.md", "./content/**/*.html"],
  theme: {
    extend: {
      colors: {
        "custom-red": {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          400: "#f87171",
          500: "#ef4444",
        },
        "custom-gray": {
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
        },
      },
      fontFamily: {
        sans: ['"Source Code Pro"', "monospace"],
      },
      backgroundImage: {
        "header-gradient": "linear-gradient(to right, #fee2e2, #fecaca)",
        "footer-gradient": "linear-gradient(to right, #fecaca, #fee2e2)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
