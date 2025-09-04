import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [heatmapZones, setHeatmapZones] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 26.1445,
    longitude: 91.7362,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = currentLocation.coords;
      
      setLocation(coords);
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      
      generateHeatmapZones(coords.latitude, coords.longitude);
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
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180);
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Risk Zones</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Safe</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Caution</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>High Risk</Text>
          </View>
        </View>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        {/* Your current location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="Current position"
            pinColor="#2563eb"
          />
        )}

        {/* Heatmap zones */}
        {heatmapZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{
              latitude: zone.lat,
              longitude: zone.lng,
            }}
            radius={zone.radius}
            strokeColor={zone.color}
            strokeWidth={2}
            fillColor={`${zone.color}40`} // 25% opacity
          />
        ))}

        {/* Zone markers */}
        {heatmapZones.map((zone) => (
          <Marker
            key={`marker-${zone.id}`}
            coordinate={{
              latitude: zone.lat,
              longitude: zone.lng,
            }}
            title={zone.name}
            description={`Risk Level: ${zone.risk.toUpperCase()}`}
          >
            <View style={[styles.markerContainer, { backgroundColor: zone.color }]}>
              <Ionicons 
                name={zone.risk === 'high' ? 'warning' : zone.risk === 'medium' ? 'alert-circle' : 'checkmark-circle'}
                size={16} 
                color="#fff" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Refresh button */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="refresh" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Zone info panel */}
      {heatmapZones.length > 0 && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>
            {heatmapZones.length} zones detected nearby
          </Text>
          <Text style={styles.infoPanelText}>
            High Risk: {heatmapZones.filter(z => z.risk === 'high').length} • 
            Medium Risk: {heatmapZones.filter(z => z.risk === 'medium').length} • 
            Safe: {heatmapZones.filter(z => z.risk === 'low').length}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  legend: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoPanelText: {
    fontSize: 14,
    color: '#6b7280',
  },
});