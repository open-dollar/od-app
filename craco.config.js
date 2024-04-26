const cracoAlias = require('craco-alias')
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin')

module.exports = {
    content: ['./src/**/*.{html,js}'],
    eslint: {
        enable: false,
    },
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
        plugins: [
            sentryWebpackPlugin({
                org: process.env.SENTRY_ORG || 'open-dollar',
                project: process.env.SENTRY_PROJECT || 'open-dollar',
                authToken: process.env.SENTRY_AUTH_TOKEN,
                sourcemaps: {
                    ignore: 'node_modules/**'
                }
              }),
          ],
    },
}
