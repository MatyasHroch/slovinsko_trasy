/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "src/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
