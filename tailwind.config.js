module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#46D9D9",
        "dark-primary": "#5FC7CC",
        secondary: "#E86E8A", // red
        accent: "#D9E021", // light-yellow
        "accent-hc": "#C4CC24", // dark-yellow
        "accent-two": "#4273FF", // blue
        "accent-two-hc": "#516EB5", // dark blue
        "accent-three": "#3F8588",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
