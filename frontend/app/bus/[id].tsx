import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Typy danych z Twojego API
interface BusDetailData {
  bus_id: string;
  sensor: { temperature: number; humidity: number; pressure: number };
  edge: { people_count: number; general_comfort_level: number };
}

export default function BusProfile() {
  const { id } = useLocalSearchParams(); // Pobiera 'id' z adresu URL
  const [bus, setBus] = useState<BusDetailData | null>(null);
  const [personalComfort, setPersonalComfort] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        
        const resBus = await axios.get(`https://arguable-populace-hankering.ngrok-free.dev/bus/${id}`);
        setBus(resBus.data);

        const resComfort = await axios.get(`https://arguable-populace-hankering.ngrok-free.dev/bus/${id}/comfort`, {
          params: { user_id: userId }
        });
        setPersonalComfort(resComfort.data.ai.comfort_level);

      } catch (err) {
        console.error("Błąd w odczycie run:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DRAKKAR {bus?.bus_id}</Text>

      {/* Główna karta AI */}
      <View style={styles.comfortCard}>
        <Text style={styles.comfortLabel}>TWÓJ KOMFORT (PRZEPOWIEDNIA AI)</Text>
        <Text style={styles.comfortValue}>{personalComfort}/8</Text>
      </View>

      {/* Dane z czujników */}
      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Temperatura</Text>
          <Text style={styles.statValue}>{bus?.sensor.temperature}°C</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Wilgotność</Text>
          <Text style={styles.statValue}>{bus?.sensor.humidity}%</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Wojownicy</Text>
          <Text style={styles.statValue}>{bus?.edge.people_count}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Ogólny stan</Text>
          <Text style={styles.statValue}>{bus?.edge.general_comfort_level}/8</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A222D', padding: 20 },
  loader: { flex: 1, backgroundColor: '#1A222D', justifyContent: 'center' },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  comfortCard: { 
    backgroundColor: '#3E2723', 
    padding: 25, 
    borderRadius: 20, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#D4AF37',
    marginBottom: 20 
  },
  comfortLabel: { color: '#D4AF37', fontSize: 12, letterSpacing: 1 },
  comfortValue: { color: '#FFF', fontSize: 64, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { 
    backgroundColor: '#2C3E50', 
    width: '48%', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15,
    alignItems: 'center'
  },
  statLabel: { color: '#BDC3C7', fontSize: 14, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});