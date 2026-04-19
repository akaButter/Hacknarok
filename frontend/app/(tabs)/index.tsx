import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('Wojowniku');

  useEffect(() => {
  const checkSession = async () => {
    const user = await AsyncStorage.getItem('user_id');
    if (!user) {
      router.replace('/login' as any);
    } else {
      setUserName(user);
    }
  };
  checkSession();
}, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Witaj w Midgardzie,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: '#1F2A36' }]} 
          onPress={() => router.push('/list' as any)}
        >
          <Ionicons name="boat-outline" size={38} color="#D4AF37" />
          <Text style={styles.menuText}>FLOTA DRAKKARÓW</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: '#1F2A36' }]} 
          onPress={() => router.push('/map' as any)}
        >
          <Ionicons name="map-outline" size={38} color="#D4AF37" />
          <Text style={styles.menuText}>MAPA WYPRAW</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: '#1F2A36' }]}
          onPress={() => router.push('/tour' as any)}
        >
          <Ionicons name="sparkles-outline" size={38} color="#D4AF37" />
          <Text style={styles.menuText}>GENERATOR WYPRAW</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>PRZEPOWIEDNIA WYROCZNI</Text>
        <View style={styles.infoCard}>
          <Ionicons name="sunny-outline" size={24} color="#D4AF37" />
          <Text style={styles.infoContent}>
            Należy szukać nowych lądów na zachód od Odynowskiego kamienia.
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetBtn} 
        onPress={async () => {
          await AsyncStorage.clear();
          router.replace('/login' as any);
        }}
      >
        <Text style={styles.resetText}>WYLOGUJ SIĘ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {  backgroundColor: '#121C28', flex:1, height: '100%' },
  scrollContent: { padding: 20, backgroundColor: '#121C28', minHeight: '100%' },
  header: { marginTop: 40, marginBottom: 30 },
  greeting: { color: '#B7C0C9', fontSize: 18, letterSpacing: 1, marginBottom: 6, fontFamily: 'ScandiFont' },
  userName: { color: '#D4AF37', fontSize: 34, fontWeight: '900', textTransform: 'uppercase',fontFamily: 'VikingFont' },
  menuGrid: { flexDirection: 'column', marginBottom: 30 },
  menuItem: { 
    width: '100%', 
    minHeight: 140, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 20,
    backgroundColor: '#1F2A36',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  menuText: { color: '#FFF', marginTop: 12, fontWeight: 'bold', letterSpacing: 2.5, fontSize: 16, fontFamily: 'ScandiFont' },
  infoSection: { marginBottom: 30 },
  infoTitle: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1.2,fontFamily: 'VikingFont' },
  infoCard: { 
    backgroundColor: '#192533', 
    padding: 20, 
    borderRadius: 18, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2F4460',fontFamily: 'VikingFont'
  },
  infoContent: { color: '#E8EBF1', marginLeft: 14, flex: 1, fontSize: 14, lineHeight: 22,fontFamily: 'ScandiFont' },
  resetBtn: { marginTop: 20, padding: 15, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#D4AF37' ,fontFamily: 'ScandiFont'},
  resetText: { color: '#D4AF37', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 ,fontFamily: 'ScandiFont'}
});