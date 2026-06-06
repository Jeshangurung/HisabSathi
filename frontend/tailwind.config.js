/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        mist: "#F6F7F8",
        sathi: "#00A884",
        saffron: "#F5A524",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(17, 17, 17, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
