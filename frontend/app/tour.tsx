import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';

interface TourStop {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  route_id: string;
}

export default function VikingTour() {
const router = useRouter();
  const [tour, setTour] = useState<TourStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
    const getCoordinates = () => {
    return tour.map(stop => ({
      latitude: stop.lat,
      longitude: stop.lng
    }));
  };
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
    <View style={styles.container}>
      <Text style={styles.header}>TWOJA WYPRAWA</Text>
      
      <TouchableOpacity style={styles.genBtn} onPress={generateVikingPath} disabled={loading}>
        {loading ? <ActivityIndicator color="#1A222D" /> : <Text style={styles.genBtnText}>WYGENERUJ TRASĘ</Text>}
      </TouchableOpacity>

      {tour.length > 0 && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            mapType="none"
            initialRegion={{
              latitude: tour[0].lat,
              longitude: tour[0].lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
            
            <Polyline
              coordinates={getCoordinates()}
              strokeColor="#D4AF37"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />

            {tour.map((stop, index) => (
              <Marker
                key={stop.id}
                coordinate={{ latitude: stop.lat, longitude: stop.lng }}
                title={`${index + 1}. ${stop.name}`}
                description={`${stop.type} • Linia: ${stop.route_id}`}
                pinColor="#D4AF37"
              />
            ))}
          </MapView>
        </View>
      )}

      <ScrollView style={styles.listContainer}>
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

        <TouchableOpacity 
          style={styles.woodButton} 
          onPress={() => router.replace('/' as any)}
        >
          <Text style={styles.woodButtonText}>← POWRÓT DO WIELKIEJ SALI</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121C28', paddingTop:60 },
  header: { color: '#D4AF37', fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 20, marginBottom: 22,fontFamily: 'VikingFont', letterSpacing: 1 },
  genBtn: { backgroundColor: '#D4AF37', padding: 18, borderRadius: 18, alignItems: 'center', marginBottom: 20, marginHorizontal: 20 },
  genBtnText: { color: '#121C28', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 , fontFamily: 'ScandiFont'},
  mapContainer: { height: 300, marginHorizontal: 20, marginBottom: 20, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: '#D4AF37' },
  map: { flex: 1 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  stopCard: { 
    backgroundColor: '#1F2A36', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#D4AF37'
  },
  indexCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  indexText: { fontWeight: 'bold', color: '#121C28', fontFamily: 'ScandiFont' },
  stopInfo: { flex: 1 },
  stopName: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'ScandiFont' },
  stopType: { color: '#B8C1CC', fontSize: 12, fontFamily: 'ScandiFont' },
  woodButton: {
    backgroundColor: '#3E2723',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#D4AF37'
  },
  woodButtonText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 14, letterSpacing: 1, fontFamily: 'ScandiFont' }
});
