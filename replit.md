# Overview

This is a tourist tracking and safety system built for SIH (Smart India Hackathon). The system provides real-time location tracking, emergency alerts, and risk assessment for tourists. It consists of a Node.js backend with MongoDB for data storage, real-time communication via Socket.io, and a Next.js frontend for the admin dashboard. The system includes features like panic alerts, geofencing, anomaly detection, and real-time location monitoring with risk scoring.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15.5.2 with React 19 RC for the admin tourist dashboard
- **Styling**: Tailwind CSS 4 for modern, responsive UI components
- **Real-time Communication**: Socket.io client for live location updates and alerts
- **Mapping**: React Leaflet integration for interactive maps and location visualization
- **Icons**: Lucide React for consistent iconography
- **Development**: Turbopack for fast development builds and hot reloading

## Backend Architecture
- **Runtime**: Node.js with ES modules (type: "module")
- **Framework**: Express.js 5.1.0 for RESTful API endpoints
- **Real-time Engine**: Socket.io server for bidirectional communication
- **Authentication**: JWT tokens with bcrypt password hashing and cookie-based sessions
- **Validation**: Joi for request validation and data sanitization
- **Development**: Nodemon for auto-restart during development

## Database Design
- **Primary Database**: MongoDB with Mongoose ODM for document modeling
- **User Schema**: Basic user information (name, email, hashed password)
- **Alert Schema**: Emergency alerts with tourist reference, type (panic/geofence/anomaly), location coordinates, police unit assignment, and status tracking
- **Location Schema**: Tourist location tracking with coordinates, risk scores (0-100), and timestamps

## Authentication & Authorization
- **Strategy**: JWT-based authentication with HTTP-only cookies
- **Security**: bcrypt for password hashing with salt rounds
- **Session Management**: 7-day token expiration with automatic refresh
- **Middleware**: Custom authentication verification for protected routes

## Real-time Features
- **Location Tracking**: Live GPS coordinate broadcasting via Socket.io
- **Emergency System**: Instant panic button alerts with location data
- **User Management**: Real-time connection/disconnection tracking
- **Risk Assessment**: Dynamic risk scoring based on location and behavior patterns

# External Dependencies

## Core Technologies
- **Database**: MongoDB for document storage and user/alert management
- **Real-time Communication**: Socket.io for bidirectional client-server communication
- **Authentication**: JSON Web Tokens (jsonwebtoken) for secure session management
- **Password Security**: bcryptjs for cryptographic password hashing

## Blockchain Integration
- **Ethereum Library**: ethers.js 6.15.0 for potential blockchain features and wallet connectivity

## Frontend Libraries
- **Mapping Service**: Leaflet with React Leaflet for interactive map components
- **UI Components**: Lucide React for scalable vector icons
- **Development Tools**: ESLint for code quality and Tailwind for styling

## Development Environment
- **Environment Variables**: dotenv for configuration management
- **Process Management**: Nodemon for development server auto-restart
- **Build System**: Next.js Turbopack for optimized builds and development