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
                blue: {
                    100: '#D0F1FF',
                    400: '#89DCFF',
                    800: '#43C7FF',
                    1200: '#1499DA',
                    1600: '#0079AD',
                    2000: '#00587E',
                    2400: '#00374E',
                    2600: '#002B40',
                    3000: '#001828',
                }
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