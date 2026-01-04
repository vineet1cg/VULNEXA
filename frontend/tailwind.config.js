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
          black: "rgb(var(--cyber-black) / <alpha-value>)",
          dark: "rgb(var(--cyber-dark) / <alpha-value>)",
          "dark-lighter": "rgba(255, 255, 255, 0.05)",
          blue: "rgb(var(--cyber-blue) / <alpha-value>)",
          purple: "rgb(var(--cyber-purple) / <alpha-value>)",
          green: "rgb(var(--cyber-green) / <alpha-value>)",
          slate: "rgb(var(--cyber-slate) / <alpha-value>)",
          white: "rgb(var(--cyber-white) / <alpha-value>)",
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
        'soft-glow': 'radial-gradient(circle at center, rgb(var(--cyber-blue) / 0.15) 0%, transparent 70%)',
        'purple-glow': 'radial-gradient(circle at center, rgb(var(--cyber-purple) / 0.15) 0%, transparent 70%)',
      },

      boxShadow: {
        'subtle-blue': '0 0 15px rgb(var(--cyber-blue) / 0.15)',
        'subtle-purple': '0 0 15px rgb(var(--cyber-purple) / 0.15)',
        'glass-pro': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      dropShadow: {
        'soft': '0 0 8px rgb(var(--cyber-blue) / 0.3)',
      }

    },
  },
  plugins: [],
};
