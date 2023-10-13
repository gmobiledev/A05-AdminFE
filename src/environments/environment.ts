// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  
  // apiUrl: 'http://localhost:3000/api',
  // apiGtalkUrl: 'http://localhost:3006/api',
  // // apiTelecomUrl: 'https://sandbox-admin.g99.vn/telecom/api',
  // apiTelecomUrl: 'http://localhost:3400/api',
  // // apiUrl: 'https://sandbox-api.g99.vn/api',
  // // apiGtalkUrl: 'https://sandbox-admin.g99.vn/virtual-number/api',


  apiUrl: 'https://sandbox-api.g99.vn/api',
  // apiUrl: 'http://localhost:3000/api',
  apiTelecomUrl: 'https://sandbox-admin.g99.vn/telecom/api',
  apiGtalkUrl: 'https://sandbox-admin.g99.vn/virtual-number/api',

  FCM_VAPID_PUBLIC_KEY: 'BD1zjiNqZGojPvrF2BBbUNe_zv_tq9q4ftHSlCJlxTugdNZpMbV7r_e6YjKIpToTWt_PVoJQwFisoEk-HI2ASEo',
  firebaseConfig: {
    apiKey: "AIzaSyC8R9fJFmjp0JtpRUQl3hrIhzGtiDc_sl8",
    authDomain: "s198app.firebaseapp.com",
    databaseURL: "https://s198app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "s198app",
    storageBucket: "s198app.appspot.com",
    messagingSenderId: "782505244414",
    appId: "1:782505244414:web:2b036b36bbcb9b9d9d97af",
    measurementId: "G-1HX7FEWFB3"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
