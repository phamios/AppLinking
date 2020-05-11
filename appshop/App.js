/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  Linking,
  View,
  Text,
  StatusBar,
} from 'react-native';
import 'react-native-gesture-handler';

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  });

  return { url, processing };
};

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};


const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text>AppShop</Text>
        <OpenURLButton url="apppay://order/id=123&item=xyz&quantity=2&price=1.99&currency=USD">Open Payment</OpenURLButton>
      </View>
    </>
  );
};

export default App;
