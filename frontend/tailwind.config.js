/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cyber: {
          black: "#030014",   // Deep Void Black (Main BG)
          dark: "#0F172A",    // Cosmic Navy (Card BG) -- slightly lighter than black for depth
          blue: "#00F3FF",    // Electric Cyan (Primary Accent)
          purple: "#BC13FE",  // Neon Purple (Secondary Accent)
          green: "#00FF94",   // Cyber Green (Success/Status)
          slate: "#94A3B8",   // Muted Text
          white: "#F1F5F9",   // Primary Text
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'neon-gradient': 'linear-gradient(to right, #00F3FF, #BC13FE)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 243, 255, 0.2), 0 0 10px rgba(0, 243, 255, 0.1)',
        'neon-purple': '0 0 20px rgba(188, 19, 254, 0.2), 0 0 10px rgba(188, 19, 254, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      dropShadow: {
        'glow': '0 0 10px rgba(0, 243, 255, 0.5)',
      }
    },
  },
  plugins: [],
};