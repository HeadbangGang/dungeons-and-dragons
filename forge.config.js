module.exports = {
    packagerConfig: {},
    repository: {
        owner: 'Tayden Flitcroft',
        name: 'Dungeons and Dragons'
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'dungeons_and_dragons'
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin'
            ]
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ]
}
