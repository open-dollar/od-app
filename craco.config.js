const cracoAlias = require('craco-alias')

module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {},
    },
    plugins: [
        {
            plugin: cracoAlias,
            options: {
                source: 'tsconfig',
                baseUrl: '.',
                tsConfigPath: './tsconfig.json',
            },
        },
    ],
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    util: false,
                    assert: false,
                    http: false,
                    https: false,
                    os: false,
                    stream: false,
                },
            },
        },
    },
}
