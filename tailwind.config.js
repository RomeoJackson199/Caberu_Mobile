/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5.9%, 90%)",
        input: "hsl(240, 5.9%, 90%)",
        ring: "hsl(199, 89%, 48%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(240, 10%, 3.9%)",
        primary: {
          DEFAULT: "hsl(199, 89%, 48%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(142.1, 76.2%, 36.3%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84.2%, 60.2%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 3.8%, 46.1%)",
        },
        accent: {
          DEFAULT: "hsl(279, 70%, 52%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 3.9%)",
        },
        dental: {
          primary: "hsl(199, 89%, 48%)",
          "primary-foreground": "hsl(0, 0%, 100%)",
          secondary: "hsl(142.1, 76.2%, 36.3%)",
          "secondary-foreground": "hsl(0, 0%, 100%)",
          accent: "hsl(279, 70%, 52%)",
          "accent-foreground": "hsl(0, 0%, 100%)",
          muted: "hsl(240, 4.8%, 95.9%)",
          "muted-foreground": "hsl(240, 3.8%, 46.1%)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};
