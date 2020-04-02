// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false, // environment.prod.ts では true にする
  firebase: {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    appId: '<your-app-id>',
    measurementId: '<your-measurement-id>',
    // messagingSenderId: '<your-messaging-sender-id>'
  },
  addFeedUrl: '<your-cloud-functions-url>',
  googleMapApiKey: '<your-google-map-api-key>'
};
