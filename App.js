import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, View, Alert, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import {useEffect} from "react";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  useEffect(() => {
    async function configurePushNotifications() {
      const {status} = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Please give the permission to get push notifications');
      }

      const projectId = Constants?.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        Alert.alert('Project ID not found');
      }

      try {
        const pushTokenData = await Notifications.getExpoPushTokenAsync({projectId});
      } catch (error) {
        console.log(error);
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync(
          'default',
          {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT
          }
        )
      }
    }

    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received -->', notification);
      console.log(notification.request.content.data.userName);
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received: -->', response)
    })

    return () => {
      subscription1.remove();
      subscription2.remove();
    }
  }, []);

  async function scheduleNotificationHandler() {
    const {status} = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'My first local notification',
          body: 'This is the body of notification',
          data: {userName: 'Zaur'}
        },
        trigger: {
          seconds: 5
        }
      });
    }
  }

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "to": "ExponentPushToken[1c3xjjIsydtfFEY7fL4lpN]",
        "title": "Important update",
        "body": "You have received new notification from Police"
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler}/>
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler}/>
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
