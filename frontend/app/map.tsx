import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, UrlTile, Polyline, Callout } from 'react-native-maps';
import data from './viking_city.json';

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { padding: 10, minWidth: 150 },
  name: { fontWeight: 'bold', fontSize: 16, color: '#3E2723' },
  type: { color: '#7f8c8d', fontSize: 12, marginBottom: 5 },
  hours: { fontSize: 12, color: '#2c3e50' }
});