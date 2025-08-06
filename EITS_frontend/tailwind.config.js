const withMT = require("@material-tailwind/react/utils/withMT");


module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          light: {
            100: "#aef5f0",
            200: "#5ae6db",
            300: "#10d1c4",
            400: "#0db09e",
            500: "#0a8979",
          },
          dark: {
            100: "#d0d1d5",
            200: "#a1a4ab",
            300: "#727681",
            400: "#1F2A40",
            500: "#141b2d", 
          }
        },
        redAccent: {
          light: {
            100: "#fde8e8",
            200: "#fbd2d2",
            300: "#f8b4b4",
            400: "#f98080",
            500: "#ef4444", // Tailwind red-500 in light mode
          },
          dark: {
            100: "#f8dcdb",
            200: "#f1b9b7",
            300: "#e99592",
            400: "#e2726e",
            500: "#db4f4a", // Dark mode red accent
          }
        },
        // Custom color family (light and dark)
        customColor: {
          light: {
            100: "#f0f4f8",
            200: "#dbe1e6",
            300: "#c5cfd2",
            400: "#a9b6c1",
            500: "#8d9da7",
          },
          dark: {
            100: "#d4e2e6",
            200: "#a8c5cc",
            300: "#7ab7b2",
            400: "#4c9a98",
            500: "#1e7d7e", // Dark mode custom color
          }
        }
      },
    },
  },
  plugins: [],
});


 
// module.exports = withMT({
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// });
