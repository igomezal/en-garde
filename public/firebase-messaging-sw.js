importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDowr-wtoBZ2-4AteEgCvCj7ItZZthSqug",
  authDomain: "en-garde-1b8c5.firebaseapp.com",
  databaseURL: "https://en-garde-1b8c5.firebaseio.com",
  projectId: "en-garde-1b8c5",
  storageBucket: "en-garde-1b8c5.appspot.com",
  messagingSenderId: "262157195711",
  appId: "1:262157195711:web:c15a5f57b01519d78f690a",
  measurementId: "G-N7S6EZKF1H"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Notifications which comes from a click
});