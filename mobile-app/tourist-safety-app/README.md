# Tourist Safety Mobile App

A React Native mobile application built with Expo for real-time tourist safety monitoring and emergency response.

## Features

- **Authentication System**: Secure login/register with JWT tokens
- **Real-time Location Tracking**: GPS-based location monitoring
- **Safety Dashboard**: Live safety scores and zone monitoring
- **Interactive Maps**: Heatmap visualization of risk zones
- **Emergency Alerts**: Panic button and location-based warnings
- **Safety Notifications**: Real-time alerts and notifications
- **Profile Management**: User settings and emergency contacts

## Tech Stack

- React Native with Expo
- React Navigation for routing
- Expo Location for GPS tracking
- React Native Maps for map visualization
- AsyncStorage for local data
- Socket.io for real-time communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-app/tourist-safety-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Backend Connection

Make sure to update the API URL in `src/contexts/AuthContext.js` to match your backend server:

```javascript
const API_URL = 'http://your-backend-url:3001/api';
```

## App Structure

```
src/
├── contexts/
│   └── AuthContext.js          # Authentication state management
├── screens/
│   ├── LoginScreen.js          # Login/Register screen
│   ├── DashboardScreen.js      # Main safety dashboard
│   ├── MapScreen.js            # Interactive map with heatmaps
│   ├── AlertsScreen.js         # Safety alerts and notifications
│   └── ProfileScreen.js        # User profile and settings
└── components/                 # Reusable components (future)
```

## Key Features

### 🔐 Authentication
- JWT-based secure authentication
- Persistent login with AsyncStorage
- Protected routes and user state management

### 📍 Location Services
- Real-time GPS tracking
- Location permission handling
- Distance calculations for risk zones

### 🗺️ Interactive Maps
- React Native Maps integration
- Heatmap visualization of risk zones
- Custom markers for different zone types
- User location tracking on map

### ⚠️ Safety System
- Dynamic safety score calculation
- Location-based warning system
- Emergency panic button
- Real-time risk zone monitoring

### 📱 Mobile-First Design
- Native mobile UI components
- Touch-optimized interactions
- Responsive layouts for all screen sizes
- Platform-specific adaptations

## Permissions

The app requires the following permissions:

- **Location**: For real-time location tracking and safety monitoring
- **Notifications**: For safety alerts and emergency notifications

## Development

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the Expo CLI
- **Android Emulator**: Press `a` in the Expo CLI  
- **Web**: Press `w` in the Expo CLI
- **Physical Device**: Scan QR code with Expo Go

### Building for Production

For production builds, you'll need to configure:

1. **iOS**: Apple Developer account and certificates
2. **Android**: Google Play Console and signing keys

Use Expo EAS Build for production builds:

```bash
npm install -g @expo/eas-cli
eas build --platform all
```

## Safety Features

### Emergency System
- One-tap emergency button
- Automatic location sharing with emergency services
- Quick dial to emergency numbers (100, 108, 1363)

### Risk Zone Detection
- Real-time monitoring of nearby risk areas
- Automatic alerts when entering dangerous zones
- Color-coded risk levels (High, Medium, Low)

### Location Intelligence
- Construction sites detection
- Traffic congestion areas
- Tourist-safe zones identification
- Police station proximity

## Contributing

This app was built for the Smart India Hackathon focusing on tourist safety and emergency response systems.

## License

This project is licensed under the MIT License.