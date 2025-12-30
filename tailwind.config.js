/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode via class strategy
    theme: {
        extend: {
            colors: {
                // Custom colors if needed, though we seem to stick to standard slate/emerald/rose/indigo
            }
        },
    },
    plugins: [],
}
