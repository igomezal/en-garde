export const messaging = window.firebase.messaging();

messaging.usePublicVapidKey('BM4mu4tlGOhepZM7w2mC-3lP0jtpK1WOU7b5btrfx3ymjRVrmpUMBmYL71vs0JIAFm8pCI_YMYsVJdYyoQI4Igk');

export const askForPermissionToReceiveNotifications = async () => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('User\'s token:', token);
    return token;
  } catch (error) {
    console.error(error);
  }
}

export const deleteRegisteredToken = async () => {
  return messaging.deleteToken();
}