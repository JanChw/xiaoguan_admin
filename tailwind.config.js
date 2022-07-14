module.exports = {
    // important: 'body',
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                nature: 'url(./src/assets/img/bg.nature.webp)',
                building: 'url(./src/assets/img/bg.building.webp)'
            }
        }
    },
    variants: {},
    plugins: []
}