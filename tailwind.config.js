module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            maxWidth: {
                split: '640px',
            },
            colors: {
                sky: '#5FD4F2',
                egg: '#FF9D0A',
                cement: '#ABABAB',
            },
            fontFamily: {
                poppins: ['Poppins', 'system-ui', 'sans-serif'],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}