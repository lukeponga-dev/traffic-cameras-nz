
'use client';

export async function requestUserPermission() {
  // Request Notification permission
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  // Geolocation permission is implicitly requested by useGeolocation hook
  // but we can check the status here.
  if ('geolocation' in navigator) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      console.log(`Geolocation permission is ${result.state}`);
    });
  }
}
