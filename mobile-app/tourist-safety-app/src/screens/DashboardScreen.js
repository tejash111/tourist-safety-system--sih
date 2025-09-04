import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [safetyScore, setSafetyScore] = useState(100);
  const [heatmapZones, setHeatmapZones] = useState([]);
  const [isInRiskZone, setIsInRiskZone] = useState(false);

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for safety monitoring');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      generateHeatmapZones(currentLocation.coords.latitude, currentLocation.coords.longitude);
      
      // Start watching location
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          calculateSafetyScore(newLocation.coords.latitude, newLocation.coords.longitude);
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const generateHeatmapZones = (lat, lng) => {
    const zoneTypes = [
      { name: "Construction Site", risk: "high", color: "#ef4444" },
      { name: "Dense Traffic Area", risk: "medium", color: "#f59e0b" },
      { name: "Crowded Market", risk: "medium", color: "#f59e0b" },
      { name: "Industrial Zone", risk: "high", color: "#ef4444" },
      { name: "Railway Crossing", risk: "high", color: "#ef4444" },
      { name: "Bus Terminal", risk: "medium", color: "#f59e0b" },
      { name: "Tourist Hotspot", risk: "low", color: "#10b981" },
      { name: "Police Station Area", risk: "low", color: "#10b981" },
    ];

    const zones = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const distance = 0.005 + Math.random() * 0.015;
      const zoneType = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
      
      zones.push({
        id: i + 1,
        name: zoneType.name,
        lat: lat + distance * Math.cos(angle),
        lng: lng + distance * Math.sin(angle),
        radius: 500 + Math.random() * 1000,
        risk: zoneType.risk,
        color: zoneType.color,
      });
    }
    
    setHeatmapZones(zones);
  };

  const calculateSafetyScore = (lat, lng) => {
    let score = 100;
    let inRiskZone = false;
    
    heatmapZones.forEach(zone => {
      const distance = getDistance(lat, lng, zone.lat, zone.lng);
      if (distance < zone.radius) {
        inRiskZone = true;
        if (zone.risk === 'high') {
          score -= 30;
          Alert.alert('⚠️ Safety Alert', `You've entered ${zone.name}. Stay alert and follow safety protocols.`);
        } else if (zone.risk === 'medium') {
          score -= 15;
        }
      }
    });
    
    setIsInRiskZone(inRiskZone);
    setSafetyScore(Math.max(score, 0));
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handlePanicButton = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to send a panic alert? Emergency services will be notified immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Alert', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Alert Sent', 'Emergency alert sent! Help is on the way. Stay calm and stay where you are if safe.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Safety Status */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <Ionicons 
              name="shield-checkmark" 
              size={32} 
              color={safetyScore >= 70 ? '#10b981' : safetyScore >= 40 ? '#f59e0b' : '#ef4444'} 
            />
            <Text style={styles.safetyTitle}>Safety Status</Text>
          </View>
          <Text style={[
            styles.safetyScore,
            { color: safetyScore >= 70 ? '#10b981' : safetyScore >= 40 ? '#f59e0b' : '#ef4444' }
          ]}>
            {safetyScore}%
          </Text>
          <Text style={styles.safetyStatus}>
            {isInRiskZone ? 'Alert - Stay Vigilant' : 'Safe Zone'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#2563eb' }]}>
            <Ionicons name="location-outline" size={24} color="#2563eb" />
            <Text style={styles.statNumber}>{heatmapZones.length}</Text>
            <Text style={styles.statLabel}>Active Zones</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
            <Ionicons name="warning-outline" size={24} color="#ef4444" />
            <Text style={styles.statNumber}>{heatmapZones.filter(z => z.risk === 'high').length}</Text>
            <Text style={styles.statLabel}>Risk Areas</Text>
          </View>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity style={styles.panicButton} onPress={handlePanicButton}>
          <Ionicons name="warning" size={32} color="#fff" />
          <Text style={styles.panicButtonText}>EMERGENCY ALERT</Text>
        </TouchableOpacity>

        {/* Location Info */}
        {location && (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>📍 Current Location</Text>
            <Text style={styles.locationText}>
              Lat: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Accuracy: ±{location.accuracy?.toFixed(0)}m
            </Text>
          </View>
        )}

        {/* Nearby Risk Zones */}
        {heatmapZones.length > 0 && (
          <View style={styles.zonesCard}>
            <Text style={styles.zonesTitle}>🗺️ Nearby Risk Zones</Text>
            {heatmapZones.map((zone) => (
              <View key={zone.id} style={[
                styles.zoneItem,
                { borderLeftColor: zone.color }
              ]}>
                <View style={styles.zoneHeader}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={[
                    styles.zoneRisk,
                    { 
                      backgroundColor: zone.risk === 'high' ? '#fef2f2' : zone.risk === 'medium' ? '#fffbeb' : '#f0fdf4',
                      color: zone.color 
                    }
                  ]}>
                    {zone.risk.toUpperCase()}
                  </Text>
                </View>
                {location && (
                  <Text style={styles.zoneDistance}>
                    Distance: ~{Math.round(getDistance(location.latitude, location.longitude, zone.lat, zone.lng))}m
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Emergency Contacts */}
        <View style={styles.contactsCard}>
          <Text style={styles.contactsTitle}>📞 Emergency Contacts</Text>
          {[
            { name: 'Police', number: '100' },
            { name: 'Emergency Services', number: '108' },
            { name: 'Tourist Helpline', number: '1363' }
          ].map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactItem}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoutButton: {
    padding: 8,
  },
  safetyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  safetyScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  safetyStatus: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  panicButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  zonesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zonesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  zoneItem: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  zoneRisk: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneDistance: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  contactNumber: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});