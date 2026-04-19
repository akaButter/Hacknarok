import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import axios from 'axios';
import Ionicons from '@expo/vector-icons/build/Ionicons';
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
<Text style={styles.navTitle}>FLOTA DRAKKARÓS</Text>
  <View style={{ width: 30 }} />
      <FlatList
        data={buses}
        keyExtractor={(item) => item.bus_id.toString()}
        renderItem={({ item }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => router.push(`/bus/${item.bus_id}` as any)}
  ><Text style={styles.busName}>Drakkar {item.bus_id}</Text>
    <Text style={styles.stats}>Ogólny komfort: {item.general_comfort_level}/8</Text>
  </TouchableOpacity>
)}/>
<TouchableOpacity 
  style={styles.woodButton} 
  onPress={() => router.replace('/' as any)}
><Text style={styles.woodButtonText}>← POWRÓT DO WIELKIEJ SALI</Text>
</TouchableOpacity>
</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121C28', padding: 20, paddingTop: 80 },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: '900', marginBottom: 20, textAlign: 'center', letterSpacing: 1 },
  card: { 
    backgroundColor: '#1F2A36', 
    padding: 22, 
    marginBottom: 16, 
    borderRadius: 18, 
    borderLeftWidth: 5, 
    borderLeftColor: '#D4AF37',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  busName: { color: '#FFF', fontSize: 18, fontWeight: 'bold',fontFamily: 'ScandiFont' },
  stats: { color: '#B8C1CC', marginTop: 6 ,fontFamily: 'ScandiFont'},
  topNav: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 40,
  paddingHorizontal: 20,
  paddingBottom: 10,
  backgroundColor: '#1A222D'
},
navTitle: {
  color: '#D4AF37',
  fontFamily: 'VikingFont',
  fontSize: 28, fontWeight: '900', marginBottom: 20, textAlign: 'center', letterSpacing: 1
},
woodButton: {
  backgroundColor: '#3E2723', // Ciemny brąz (drewno)
  padding: 15,
  margin: 20,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#D4AF37',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center'
},
woodButtonText: {
  color: '#D4AF37',
  fontFamily: 'VikingFont', // Twój nowy font!
  fontSize: 16,
  letterSpacing: 1
}
});