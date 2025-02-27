/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bluebutton: "var(--bluebutton)",
        purplebutton: "var(--purplebutton)",
        darkpurplebutton: "var(--darkpurplebutton)",
        textclr: "var(--textclr)",
      },
      fontFamily: {
        "plus-jakarta": ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  eslint: {
    ignoreDuringBuilds: true,
  },
  safelist: ["bg-background", "text-textclr", "font-plus-jakarta"],
};
