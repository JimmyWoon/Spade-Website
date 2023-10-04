// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    // apiKey: "AIzaSyB_5pHfXZmELufKGy7h3eOFU9QwszuhIac",
    // authDomain: "spade-3cac3.firebaseapp.com",
    // projectId: "spade-3cac3",
    // storageBucket: "spade-3cac3.appspot.com",
    // messagingSenderId: "140360766430",
    // appId: "1:140360766430:web:4a0fdde2f9e144af47034f",
    // measurementId: "G-YYQQMSRQXV"
    apiKey: "AIzaSyACv692fcAIy1WDeaWpneBykrYKRPt9kMw",
    authDomain: "colus-website.firebaseapp.com",
    projectId: "colus-website",
    storageBucket: "colus-website.appspot.com",
    messagingSenderId: "1061144490406",
    appId: "1:1061144490406:web:38cfb5a2f033369fb91f67",
    measurementId: "G-HBLHRNSCSS"
  },
  production: false,
  

};

export const functionStart = 'firebase emulators:start --only functions';
export const baseUrl = "http://localhost:4200/";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
