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
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useMount(() => {
    const getUrlAsync = async () => {
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

const DisplayDeepLink = ({link}) => {
  const dataParams = link.split('/');
  const params = dataParams[3].split('&');
  
  params.forEach(item => {
    const dataItem = item.split('=');

    console.log(dataItem[0], dataItem[1]);
  });

  return <>
    {params.map((item, index) => {
      const dataItem = item.split('=');
      return <View>
        <Text>{dataItem[0]}</Text>
        <Text>{dataItem[1]}</Text>
      </View>
    })}
  </>;
}

const App: () => React$Node = () => {
  const { url: initialUrl, processing } = useInitialURL();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text>AppPay</Text>

        {processing
          ? <ActivityIndicator></ActivityIndicator>
          : <DisplayDeepLink link={initialUrl || "None"}></DisplayDeepLink>}

        <OpenURLButton url="appshop://payment/order?status=1">Open Shop</OpenURLButton>
      </View>
    </>
  );
};

export default App;
