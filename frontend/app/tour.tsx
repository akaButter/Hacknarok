import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface TourStop {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  route_id: string;
}

export default function VikingTour() {
  const [tour, setTour] = useState<TourStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const generateVikingPath = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const res = await axios.get(`https://arguable-populace-hankering.ngrok-free.dev/generate-tour/${userId}`);

      if (res.data.status === "success") {
        setTour(res.data.viking_path);
        setScore(res.data.total_comfort_score);
      } else {
        Alert.alert("Błąd Wyroczni", res.data.error);
      }
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się połączyć z Valhallą.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>TWOJA WYPRAWA</Text>
      
      <TouchableOpacity style={styles.genBtn} onPress={generateVikingPath} disabled={loading}>
        {loading ? <ActivityIndicator color="#1A222D" /> : <Text style={styles.genBtnText}>WYGENERUJ TRASĘ</Text>}
      </TouchableOpacity>

      {score && (
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>Współczynnik Chwały (Fitness): {score.toFixed(2)}</Text>
        </View>
      )}

      {tour.map((stop, index) => (
        <View key={stop.id} style={styles.stopCard}>
          <View style={styles.indexCircle}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName}>{stop.name}</Text>
            <Text style={styles.stopType}>{stop.type} • Linia: {stop.route_id}</Text>
          </View>
          <Ionicons name="location-sharp" size={24} color="#D4AF37" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A222D', padding: 20 },
  header: { color: '#D4AF37', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 20 },
  genBtn: { backgroundColor: '#D4AF37', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  genBtnText: { color: '#1A222D', fontWeight: 'bold', fontSize: 16 },
  scoreBadge: { backgroundColor: '#3E2723', padding: 10, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  scoreText: { color: '#D4AF37', fontWeight: 'bold' },
  stopCard: { 
    backgroundColor: '#2C3E50', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37'
  },
  indexCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  indexText: { fontWeight: 'bold', color: '#1A222D' },
  stopInfo: { flex: 1 },
  stopName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  stopType: { color: '#BDC3C7', fontSize: 12 }
});