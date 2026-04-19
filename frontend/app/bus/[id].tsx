import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';



interface BusDetailData {
  bus_id: string;
  sensor: { temperature: number; humidity: number; pressure: number };
  edge: { people_count: number; general_comfort_level: number };
}

export default function BusProfile() {
  const { id } = useLocalSearchParams();
  const [bus, setBus] = useState<BusDetailData | null>(null);
  const [personalComfort, setPersonalComfort] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFeedback, setUserFeedback] = useState(4); 
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const sendFeedback = async () => {
  setIsSending(true);
  try {
    const userId = await AsyncStorage.getItem('user_id') || "unknown_viking";
    
    const payload = {
      user_id: userId,
      feedback: userFeedback 
    };

    await axios.post(`https://arguable-populace-hankering.ngrok-free.dev/bus/${id}/comfort/feedback`, payload);
    
    Alert.alert("Topór w górę!", "Twoja opinia została zapisana w kronikach.");
  } catch (err) {
    console.error(err);
    Alert.alert("Błąd!", "Nie udało się połączyć z serwerem.");
  } finally {
    setIsSending(false);
  }
  };
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
<View style={styles.comfortCard}>
        <Text style={styles.comfortLabel}>TWÓJ KOMFORT (PRZEPOWIEDNIA AI)</Text>
        <Text style={styles.comfortValue}>{personalComfort}/8</Text>
      </View>
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
      <View style={styles.feedbackContainer}>
  <Text style={styles.feedbackTitle}>OCEŃ PRZEPOWIEDNIĘ AI (1-8)</Text>
  <View style={styles.scaleDescription}>
    <Text style={styles.scaleText}>1 - Lodowe piekło</Text>
    <Text style={styles.scaleText}>8 - Valhalla</Text>
  </View>
  <Slider
    value={userFeedback}
    onValueChange={(v: any) => setUserFeedback(Math.floor(v))}
    minimumValue={1}
    maximumValue={8}
    step={1}
    minimumTrackTintColor="#D4AF37"
    thumbTintColor="#D4AF37"
  />  
  <Text style={styles.bigNumber}>{userFeedback}</Text>
  <TouchableOpacity 
    style={styles.confirmBtn} 
    onPress={sendFeedback}
    disabled={isSending}
  ><Text style={styles.confirmBtnText}>
      {isSending ? "PRZESYŁANIE..." : "POTWIERDŹ KOMFORT"}
    </Text>
  </TouchableOpacity>
</View>
<TouchableOpacity 
  style={styles.woodButton} 
  onPress={() => router.replace('/list' as any)}
><Text style={styles.woodButtonText}>← POWRÓT DO LISTY DRAKKARÓW</Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121C28', padding: 20 },
  loader: { flex: 1, backgroundColor: '#121C28', justifyContent: 'center' },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: '900', textAlign: 'center', marginVertical: 20, letterSpacing: 1, marginTop: 60, fontFamily: 'VikingFont' },
  comfortCard: { 
    backgroundColor: '#1F2A36', 
    padding: 26, 
    borderRadius: 22, 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#2F4460',
    marginBottom: 20 
  },
  comfortLabel: { color: '#D4AF37', fontSize: 12, letterSpacing: 1.0, fontFamily: 'ScandiFont' },
  comfortValue: { color: '#FFF', fontSize: 64, fontWeight: '900', fontFamily: 'ScandiFont' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { 
    backgroundColor: '#1F2A36', 
    width: '48%', 
    padding: 18, 
    borderRadius: 18, 
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2F4460'
  },
  statLabel: { color: '#B8C1CC', fontSize: 14, marginBottom: 8 },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold', fontFamily: 'ScandiFont' },
  feedbackContainer: {
    backgroundColor: '#1F2A36',
    padding: 20,
    borderRadius: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2F4460',
  },
  feedbackTitle: { color: '#D4AF37', textAlign: 'center', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1, fontFamily: 'ScandiFont' },
  scaleDescription: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, fontFamily: 'ScandiFont' },
  scaleText: { color: '#B8C1CC', fontSize: 10, fontFamily: 'ScandiFont' },
  bigNumber: { color: '#FFF', fontSize: 42, textAlign: 'center', fontWeight: 'bold', marginVertical: 12 },
  confirmBtn: { backgroundColor: '#D4AF37', padding: 16, borderRadius: 14, alignItems: 'center' },
  confirmBtnText: { color: '#121C28', fontWeight: 'bold', letterSpacing: 1, fontFamily: 'ScandiFont' },
  woodButton: {
  backgroundColor: '#3E2723',
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
  fontFamily: 'VikingFont',
  fontSize: 16,
  letterSpacing: 1
}
});