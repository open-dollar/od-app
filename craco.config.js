module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [],
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "util": false,
                    "assert": false,
                    "http": false,
                    "https": false,
                    "os": false,
                    "stream": false
                }
            }
        }
    }

}