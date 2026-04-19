import { Stack } from 'expo-router';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';
import {Metamorphous_400Regular} from '@expo-google-fonts/metamorphous';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'VikingFont': MedievalSharp_400Regular,
          'ScandiFont': Metamorphous_400Regular
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
