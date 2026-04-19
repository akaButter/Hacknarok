import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!userId) {
      Alert.alert("Błąd", "Wpisz swoje imię/ID, wojowniku!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://arguable-populace-hankering.ngrok-free.dev/login', {
        user_id: userId
      });

      if (response.data.status === "success") {
        const userData = response.data.user_data;
        await AsyncStorage.setItem('user_id', userData.user_id);
        await AsyncStorage.setItem('user_profile', JSON.stringify(userData));

        Alert.alert("Witaj ponownie!", response.data.message);
        router.replace('/' as any);
      }
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Nie znaleziono wikinga w Wielkiej Sali.";
      Alert.alert("Niepowodzenie", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>POWRÓT DO VALHALLI</Text>
      
      <Text style={styles.label}>Twoje ID wikinga:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="np. viking123" 
        placeholderTextColor="#666"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "SPRAWDZANIE..." : "ZALOGUJ SIĘ"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register' as any)}>
        <Text style={styles.linkText}>Nie masz jeszcze profilu? Zarejestruj się.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121C28', padding: 30, justifyContent: 'center' },
  header: { color: '#D4AF37', fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 40, letterSpacing: 1.2, fontFamily: 'VikingFont' },
  label: { color: '#D4AF37', marginBottom: 10, letterSpacing: 0.5, fontFamily: 'ScandiFont' },
  input: { backgroundColor: '#1F2A36', color: '#FFF', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#2F4460' },
  button: { backgroundColor: '#D4AF37', padding: 18, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: '#121C28', fontWeight: 'bold', letterSpacing: 1, fontFamily: 'ScandiFont' },
  linkText: { color: '#B8C1CC', textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontFamily: 'ScandiFont' }
});