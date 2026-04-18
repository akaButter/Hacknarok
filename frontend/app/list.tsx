import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import axios from 'axios';
interface Bus {
  bus_id: string;
  temperature: number;
  people_count: number;
  general_comfort_level: number;
}
export default function BusList() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('https://arguable-populace-hankering.ngrok-free.dev/buses')
      .then(res => setBuses(res.data))
      .catch(err => console.log("Błąd w porcie:", err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flota Drakkarów</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.bus_id.toString()}
        renderItem={({ item }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => router.push(`/bus/${item.bus_id}` as any)}
  >
    <Text style={styles.busName}>Drakkar {item.bus_id}</Text>
    <Text style={styles.stats}>Ogólny komfort: {item.general_comfort_level}/8</Text>
  </TouchableOpacity>
)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A222D', padding: 20, paddingTop: 100 },
  title: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { 
    backgroundColor: '#2C3E50', 
    padding: 20, 
    marginBottom: 15, 
    borderRadius: 10, 
    borderLeftWidth: 4, 
    borderLeftColor: '#D4AF37' 
  },
  busName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  stats: { color: '#BDC3C7', marginTop: 5 }
});