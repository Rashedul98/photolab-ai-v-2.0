/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                'google': ['Google Sans', 'sans-serif'],
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    'scrollbar-width': 'none', /* Firefox */
                    '-ms-overflow-style': 'none', /* IE and Edge */
                },
                '.scrollbar-hide::-webkit-scrollbar': {
                    display: 'none', /* Chrome, Safari, and Opera */
                },
            });
        },
    ],
    safelist: [
        'text-[#037FFD]',
        'border-[#037FFD]',
        'border-transparent'
    ],
}

