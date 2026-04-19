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
  container: { flex: 1, backgroundColor: '#1A222D', padding: 30, justifyContent: 'center' },
  header: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  label: { color: '#D4AF37', marginBottom: 10 },
  input: { backgroundColor: '#2C3E50', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#D4AF37', padding: 20, borderRadius: 50, alignItems: 'center' },
  buttonText: { color: '#1A222D', fontWeight: 'bold' },
  linkText: { color: '#BDC3C7', textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }
});