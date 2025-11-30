
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

  // Request Geolocation permission
  if ('geolocation' in navigator) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      console.log(`Geolocation permission is ${result.state}`);
       if (result.state === 'denied') {
        // Instructions for user to manually enable location services
        alert('Geolocation permission has been denied. To use this feature, please enable location services in your browser settings.');
      }
    });
  }
}
