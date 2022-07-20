// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBgdhXPiADyIvswqgwgwpvwuSpMg9d9LuY",
    authDomain: "smartclock-api.firebaseapp.com",
    databaseURL: "https://smartclock-api.firebaseio.com",
    projectId: "smartclock-api",
    storageBucket: "smartclock-api.appspot.com",
    messagingSenderId: "212228267803",
    appId: "1:212228267803:web:139f0935949b171239fdbe",
    measurementId: "G-6X70N876LY",
  },
  openWeather: {
    apiKey: "7d83068566f71e51d798a6cf184d000c",
    apiURL: "https://api.openweathermap.org",
  },
  helperApi: {
    url: "http://localhost:8080",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
