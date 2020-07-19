// This is written in this way because the build will turn the not used configuration to undefined
// Hiding in practice the configuration of dev to prod and viceversa
const config =
  process.env.REACT_APP_STAGE === 'dev'
    ? {
        // LOCAL
        // url: 'http://localhost:3000/dev/',
        // DEV
        url: 'https://api-dev.henle-library.com/',

      }
    : {
        url: 'https://api.henle-library.com/',

      }

export default {
  ...config,
}
