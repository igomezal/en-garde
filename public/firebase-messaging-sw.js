importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js');
importScripts('https://unpkg.com/idb@5.0.4/build/iife/index-min.js');

function createDB() {
  idb.openDB('notifications', 1, function(upgradeDB) {
    if(!upgradeDB.objectStoreNames.contains('notifications')) upgradeDB.createObjectStore('notifications', {keyPath: 'id', autoIncrement:true});
  });
}

function addNotification(notification) {
  idb.openDB('notifications', 1).then((db) => {
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications')
    return store.add(notification);
  });
}

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

messaging.usePublicVapidKey('BM4mu4tlGOhepZM7w2mC-3lP0jtpK1WOU7b5btrfx3ymjRVrmpUMBmYL71vs0JIAFm8pCI_YMYsVJdYyoQI4Igk');

createDB();

messaging.onBackgroundMessage(({ notification }) => {
  addNotification(notification);
});