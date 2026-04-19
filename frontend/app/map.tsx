import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, UrlTile, Polyline, Callout } from 'react-native-maps';
import data from './viking_city.json';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Route {
  id: string;
  name: string;
  color: string;
  path: { lat: number; lng: number }[];
}

interface Attraction {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  open: number;
  close: number;
}

export default function VikingMap() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={{
          latitude: 69.6919, 
          longitude: 18.6183,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <UrlTile 
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* RYSOWANIE TRAS (Bifrost, Iron Path itd.) */}
        {data.routes.map((route: Route) => (
          <Polyline
            key={route.id}
            coordinates={route.path.map(p => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor={route.color}
            strokeWidth={4}
            lineDashPattern={[5, 2]}
          />
        ))}

        {data.attractions.map((place: Attraction) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
  
            pinColor={place.type === 'MUSEUM' ? '#D4AF37' : '#27ae60'}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.name}>{place.name}</Text>
                <Text style={styles.type}>{place.type}</Text>
                <Text style={styles.hours}>
                  🕒 {place.open}:00 - {place.close}:00
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity 
  style={styles.backButtonFloating} 
  onPress={() => router.replace('/' as any)}
>
  <Ionicons name="home" size={24} color="#1A222D" />
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { padding: 12, minWidth: 160, backgroundColor: '#1F2A36', borderRadius: 14, borderWidth: 1, borderColor: '#2F4460' },
  name: { fontWeight: 'bold', fontSize: 16, color: '#D4AF37' },
  type: { color: '#B8C1CC', fontSize: 12, marginBottom: 6 },
  hours: { fontSize: 12, color: '#E8EBF1' },
  backButtonFloating: {
  position: 'absolute',
  top: 50, // Pod status barem
  left: 20,
  backgroundColor: '#D4AF37',
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5, // Cień na Android
  shadowColor: '#000', // Cień na iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  borderWidth: 2,
  borderColor: '#3E2723'
}
});