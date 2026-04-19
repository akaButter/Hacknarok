import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    user_id: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
  });

  const handleRegister = async () => {
    if (!form.age || !form.height || !form.weight) {
      Alert.alert("Błąd!", "Wypełnij wszystkie pola, wojowniku.");
      return;
    }

    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        height: parseInt(form.height),
        weight: parseInt(form.weight),
      };

      await axios.post('https://arguable-populace-hankering.ngrok-free.dev/register', payload);

      await AsyncStorage.setItem('user_id', form.user_id);
      await AsyncStorage.setItem('user_profile', JSON.stringify(payload));

      Alert.alert("Chwała!", "Profil zapisany w runach.");
      router.push('/' as any);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd!", "Backend nie odpowiada. Sprawdź IP i czy serwer działa.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.header}>PROFIL WIKINGA</Text>
      <Text style={styles.label}>Imię wikinga:</Text>
      <TextInput style={styles.input} onChangeText={(v) => setForm({...form, user_id: v})} />
      
      <Text style={styles.label}>Płeć:</Text>
      <View style={styles.genderRow}>
        <TouchableOpacity 
          style={[styles.genderBtn, form.gender === 'male' && styles.activeBtn]}
          onPress={() => setForm({...form, gender: 'male'})}
        >
          <Text style={styles.btnText}>Wojownik</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.genderBtn, form.gender === 'female' && styles.activeBtn]}
          onPress={() => setForm({...form, gender: 'female'})}
        >
          <Text style={styles.btnText}>Tarczowniczka</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Przeżyte zimy:</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => setForm({...form, age: v})} />

      <Text style={styles.label}>Wzrost (cm):</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => setForm({...form, height: v})} />

      <Text style={styles.label}>Waga (kg):</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => setForm({...form, weight: v})} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>RUSZAJ W DROGĘ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Text style={styles.linkText}>Masz już konto? Zaloguj się!</Text>
            </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121C28', padding: 30, justifyContent: 'center' },
  header: { color: '#D4AF37', fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 30, letterSpacing: 1.2, fontFamily: 'VikingFont' },
  label: { color: '#D4AF37', marginBottom: 8, letterSpacing: 0.5, fontFamily: 'ScandiFont' },
  input: { backgroundColor: '#1F2A36', color: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2F4460', fontFamily: 'ScandiFont' },
  genderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  genderBtn: { backgroundColor: '#1F2A36', padding: 14, borderRadius: 14, width: '48%', alignItems: 'center', borderWidth: 1, borderColor: '#2F4460' },
  activeBtn: { backgroundColor: '#D4AF37' },
  btnText: { color: '#FFF', fontWeight: '700', fontFamily: 'ScandiFont' },
  button: { backgroundColor: '#D4AF37', padding: 18, borderRadius: 24, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#121C28', fontWeight: 'bold', letterSpacing: 1, fontFamily: 'ScandiFont' },
  linkText: { color: '#B8C1CC', textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontFamily: 'ScandiFont' }
});