/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We will add this font in the next step
      },
      colors: {
        cyber: {
          black: "#05080a",   // Ultra dark blue-black
          dark: "#0a0f18",    // Slightly lighter background
          blue: "#00f2ff",    // The main neon accent
          purple: "#7000ff",  // Secondary neon accent
          green: "#00ff88",   // Success state
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 242, 255, 0.3)',
      }
    },
  },
  plugins: [],
};