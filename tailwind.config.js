/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      height: () => {
        let heights = {};
        for (let i = 1; i <= 96; i++) {
          heights[i] = `${i * 0.25}rem`;
        }
        return heights;
      },
      width: () => {
        let widths = {};
        for (let i = 1; i <= 96; i++) {
          widths[i] = `${i * 0.25}rem`;
        }
        return widths;
      },
    },
    plugins: [],
  }
}