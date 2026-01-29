module.exports = {
    packagerConfig: {
        name: 'ClipSnap',
        executableName: 'ClipSnap',
        asar: true,
        icon: './icon' // Add icon path if you have one
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32', 'linux'],
            config: {}
        }
    ],
    plugins: [],
};
