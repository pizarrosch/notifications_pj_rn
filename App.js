import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Button} from 'react-native';
import * as Notifications from 'expo-notifications';
import {useEffect} from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  useEffect(() => {
    const subscription1  = Notifications.addNotificationReceivedListener((notification) => {
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

  return (
    <View style={styles.container}>
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler}/>
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
