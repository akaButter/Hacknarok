import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Ikony wbudowane w Expo

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('Wojowniku');

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user_id');
      if (!user) {
        // Jeśli nie ma użytkownika, wyślij go do rejestracji
        router.replace('/register' as any);
      } else {
        setUserName(user);
      }
    };
    checkUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Nagłówek z klimatem */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Witaj w Midgardzie,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Główne Menu - Duże Kafle */}
      <View style={styles.menuGrid}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: '#3E2723' }]} 
          onPress={() => router.push('/list' as any)}
        >
          <Ionicons name="boat-outline" size={40} color="#D4AF37" />
          <Text style={styles.menuText}>FLOTA</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: '#2C3E50' }]} 
          onPress={() => router.push('/map' as any)}
        >
          <Ionicons name="map-outline" size={40} color="#D4AF37" />
          <Text style={styles.menuText}>MAPA WYPRAW</Text>
        </TouchableOpacity>
      </View>

      {/* Sekcja Informacyjna */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>PRZEPOWIEDNIA DZISIAJ</Text>
        <View style={styles.infoCard}>
          <Ionicons name="sunny-outline" size={24} color="#D4AF37" />
          <Text style={styles.infoContent}>
            Dobre warunki na podróż. AI sugeruje drakkary z niską wilgotnością dla Twojego wzrostu.
          </Text>
        </View>
      </View>

      {/* Przycisk resetu (do testów na hackathonie) */}
      <TouchableOpacity 
        style={styles.resetBtn} 
        onPress={async () => {
          await AsyncStorage.clear();
          router.replace('/register' as any);
        }}
      >
        <Text style={styles.resetText}>ZMIEŃ WOJOWNIKA (LOGOUT)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A222D', padding: 20 },
  header: { marginTop: 40, marginBottom: 30 },
  greeting: { color: '#BDC3C7', fontSize: 18 },
  userName: { color: '#D4AF37', fontSize: 32, fontWeight: 'bold', textTransform: 'uppercase' },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  menuItem: { 
    width: '48%', 
    height: 150, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37'
  },
  menuText: { color: '#FFF', marginTop: 10, fontWeight: 'bold', letterSpacing: 2 },
  infoSection: { marginBottom: 30 },
  infoTitle: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  infoCard: { 
    backgroundColor: '#243447', 
    padding: 20, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  infoContent: { color: '#FFF', marginLeft: 15, flex: 1, fontSize: 14, lineHeight: 20 },
  resetBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  resetText: { color: '#666', fontSize: 12, textDecorationLine: 'underline' }
});