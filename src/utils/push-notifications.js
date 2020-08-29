export const messaging = window.firebase.messaging.isSupported() ? window.firebase.messaging() : { 
  requestPermission: () => {},
  getToken: () => {},
  deleteToken: () => {},
  usePublicVapidKey: () => {},
  onMessage: () => {},
  onTokenRefresh: () => {},
};

messaging.usePublicVapidKey('BM4mu4tlGOhepZM7w2mC-3lP0jtpK1WOU7b5btrfx3ymjRVrmpUMBmYL71vs0JIAFm8pCI_YMYsVJdYyoQI4Igk');

export const setPermissionForNotification = (notificationPermission) => localStorage.setItem("notifications", notificationPermission);

export const getPermissionForNotification = () => JSON.parse(localStorage.getItem("notifications"))

export const askForPermissionToReceiveNotifications = async () => {
  try {
    await messaging.requestPermission();
    return messaging.getToken();
  } catch (error) {
    console.error(error);
  }
}

export const deleteRegisteredToken = async () => {
  return messaging.deleteToken();
}