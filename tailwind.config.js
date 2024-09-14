/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zcool: ['"ZCOOL KuaiLe"', "sans-serif"], // Font family with proper quotes
        sans: ['"Open Sans"', "sans-serif"], // Add Open Sans to your sans font family
      },
    },
  },
  plugins: [],
};
