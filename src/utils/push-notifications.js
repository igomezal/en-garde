const messaging = window.firebase.messaging();

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