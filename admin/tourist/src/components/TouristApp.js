"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, HelpCircle, IdCard, LogOut, AlertTriangle, Shield, Phone, MapPin, Navigation, Users, Activity, Send } from "lucide-react";

// Import Leaflet CSS dynamically
import("leaflet/dist/leaflet.css");

// Socket.io connection
const socketUrl = "http://localhost:3000";

export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
});

// Dynamic imports for Leaflet with better error handling
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-full rounded-lg"></div> }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

const TouristApp = () => {

    const Prompt = {
    "contents": [
      {
        "parts": [
          {
            "text": `
            You are given district-level safety data with four parameters, consider an area unsafe if: 
            - Crimes against Women >= 25%
            - Crimes against Children >= 25%
            - Violence >= 50%
            - Fraud >= 5%

            Write a short human-like safety note (5-6 sentences) using the data provided that:  
              - Reassures the reader that the district is generally safe.  
              - Notify the concerns in a friendly, conversational way (avoid giving raw statistics).  
              - Encourages awareness and simple precautions instead of fear. 

            District data:

[
  {
    "district_name": "Anjaw",
    "Women_Prop": "20.00%",
    "Children_Prop": "18.00%",
    "Violence_Prop": "56.00%",
    "Fraud_Prop": "6.00%"
  },
  {
    "district_name": "Changlang",
    "Women_Prop": "24.28%",
    "Children_Prop": "2.06%",
    "Violence_Prop": "69.55%",
    "Fraud_Prop": "4.12%"
  },
  {
    "district_name": "Papum Pare",
    "Women_Prop": "21.01%",
    "Children_Prop": "13.38%",
    "Violence_Prop": "57.58%",
    "Fraud_Prop": "8.03%"
  },
  {
    "district_name": "Dibang Valley",
    "Women_Prop": "13.64%",
    "Children_Prop": "2.27%",
    "Violence_Prop": "84.09%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "East Kameng",
    "Women_Prop": "16.02%",
    "Children_Prop": "7.03%",
    "Violence_Prop": "74.61%",
    "Fraud_Prop": "2.34%"
  },
  {
    "district_name": "West Kameng",
    "Women_Prop": "21.47%",
    "Children_Prop": "0.61%",
    "Violence_Prop": "73.62%",
    "Fraud_Prop": "4.29%"
  },
  {
    "district_name": "Kurung Kumey",
    "Women_Prop": "15.89%",
    "Children_Prop": "3.74%",
    "Violence_Prop": "75.70%",
    "Fraud_Prop": "4.67%"
  },
  {
    "district_name": "Lohit",
    "Women_Prop": "31.90%",
    "Children_Prop": "3.68%",
    "Violence_Prop": "57.06%",
    "Fraud_Prop": "7.36%"
  },
  {
    "district_name": "Longding",
    "Women_Prop": "16.76%",
    "Children_Prop": "1.62%",
    "Violence_Prop": "80.00%",
    "Fraud_Prop": "1.62%"
  },
  {
    "district_name": "Lower Dibang Valley",
    "Women_Prop": "18.00%",
    "Children_Prop": "5.33%",
    "Violence_Prop": "74.67%",
    "Fraud_Prop": "2.00%"
  },
  {
    "district_name": "East Siang",
    "Women_Prop": "24.04%",
    "Children_Prop": "13.40%",
    "Violence_Prop": "59.57%",
    "Fraud_Prop": "2.98%"
  },
  {
    "district_name": "Upper Siang",
    "Women_Prop": "12.09%",
    "Children_Prop": "20.88%",
    "Violence_Prop": "65.93%",
    "Fraud_Prop": "1.10%"
  },
  {
    "district_name": "West Siang",
    "Women_Prop": "28.71%",
    "Children_Prop": "8.91%",
    "Violence_Prop": "57.76%",
    "Fraud_Prop": "4.62%"
  },
  {
    "district_name": "Lower Subansiri",
    "Women_Prop": "6.33%",
    "Children_Prop": "3.80%",
    "Violence_Prop": "88.61%",
    "Fraud_Prop": "1.27%"
  },
  {
    "district_name": "Upper Subansiri",
    "Women_Prop": "20.58%",
    "Children_Prop": "10.29%",
    "Violence_Prop": "66.67%",
    "Fraud_Prop": "2.47%"
  },
  {
    "district_name": "Tawang",
    "Women_Prop": "26.09%",
    "Children_Prop": "4.35%",
    "Violence_Prop": "67.39%",
    "Fraud_Prop": "2.17%"
  },
  {
    "district_name": "Tirap",
    "Women_Prop": "18.02%",
    "Children_Prop": "3.60%",
    "Violence_Prop": "74.77%",
    "Fraud_Prop": "3.60%"
  },
  {
    "district_name": "Namsai",
    "Women_Prop": "13.45%",
    "Children_Prop": "10.34%",
    "Violence_Prop": "74.83%",
    "Fraud_Prop": "1.38%"
  },
  {
    "district_name": "Siang",
    "Women_Prop": "22.22%",
    "Children_Prop": "0.93%",
    "Violence_Prop": "75.00%",
    "Fraud_Prop": "1.85%"
  },
  {
    "district_name": "Kamrup Metro",
    "Women_Prop": "4.85%",
    "Children_Prop": "6.64%",
    "Violence_Prop": "75.57%",
    "Fraud_Prop": "12.94%"
  },
  {
    "district_name": "Barpeta",
    "Women_Prop": "10.08%",
    "Children_Prop": "15.99%",
    "Violence_Prop": "71.30%",
    "Fraud_Prop": "2.64%"
  },
  {
    "district_name": "Baksa",
    "Women_Prop": "14.44%",
    "Children_Prop": "27.51%",
    "Violence_Prop": "56.22%",
    "Fraud_Prop": "1.82%"
  },
  {
    "district_name": "Bongaigaon",
    "Women_Prop": "20.38%",
    "Children_Prop": "21.90%",
    "Violence_Prop": "57.58%",
    "Fraud_Prop": "0.15%"
  },
  {
    "district_name": "Cachar",
    "Women_Prop": "8.96%",
    "Children_Prop": "24.93%",
    "Violence_Prop": "62.21%",
    "Fraud_Prop": "3.90%"
  },
  {
    "district_name": "Chirang",
    "Women_Prop": "15.71%",
    "Children_Prop": "18.38%",
    "Violence_Prop": "63.87%",
    "Fraud_Prop": "2.04%"
  },
  {
    "district_name": "Darrang",
    "Women_Prop": "23.82%",
    "Children_Prop": "10.75%",
    "Violence_Prop": "63.61%",
    "Fraud_Prop": "1.82%"
  },
  {
    "district_name": "Dhemaji",
    "Women_Prop": "20.25%",
    "Children_Prop": "19.79%",
    "Violence_Prop": "58.16%",
    "Fraud_Prop": "1.81%"
  },
  {
    "district_name": "Dhubri",
    "Women_Prop": "21.39%",
    "Children_Prop": "12.93%",
    "Violence_Prop": "61.32%",
    "Fraud_Prop": "4.36%"
  },
  {
    "district_name": "Dibrugarh",
    "Women_Prop": "13.05%",
    "Children_Prop": "20.19%",
    "Violence_Prop": "60.93%",
    "Fraud_Prop": "5.83%"
  },
  {
    "district_name": "Goalpara",
    "Women_Prop": "12.23%",
    "Children_Prop": "18.93%",
    "Violence_Prop": "66.87%",
    "Fraud_Prop": "1.97%"
  },
  {
    "district_name": "Golaghat",
    "Women_Prop": "16.76%",
    "Children_Prop": "18.57%",
    "Violence_Prop": "63.21%",
    "Fraud_Prop": "1.46%"
  },
  {
    "district_name": "Hailakandi",
    "Women_Prop": "24.91%",
    "Children_Prop": "11.08%",
    "Violence_Prop": "60.26%",
    "Fraud_Prop": "3.75%"
  },
  {
    "district_name": "West Karbi Anglong",
    "Women_Prop": "21.07%",
    "Children_Prop": "14.93%",
    "Violence_Prop": "59.73%",
    "Fraud_Prop": "4.27%"
  },
  {
    "district_name": "Jorhat",
    "Women_Prop": "14.86%",
    "Children_Prop": "12.77%",
    "Violence_Prop": "61.44%",
    "Fraud_Prop": "10.92%"
  },
  {
    "district_name": "Kamrup",
    "Women_Prop": "20.67%",
    "Children_Prop": "13.00%",
    "Violence_Prop": "54.75%",
    "Fraud_Prop": "11.58%"
  },
  {
    "district_name": "Karbi Anglong",
    "Women_Prop": "10.29%",
    "Children_Prop": "23.07%",
    "Violence_Prop": "63.39%",
    "Fraud_Prop": "3.25%"
  },
  {
    "district_name": "Karimganj",
    "Women_Prop": "18.38%",
    "Children_Prop": "10.07%",
    "Violence_Prop": "67.46%",
    "Fraud_Prop": "4.09%"
  },
  {
    "district_name": "Kokrajhar",
    "Women_Prop": "27.11%",
    "Children_Prop": "24.99%",
    "Violence_Prop": "47.49%",
    "Fraud_Prop": "0.41%"
  },
  {
    "district_name": "Lakhimpur",
    "Women_Prop": "14.05%",
    "Children_Prop": "22.12%",
    "Violence_Prop": "57.45%",
    "Fraud_Prop": "6.39%"
  },
  {
    "district_name": "Marigaon",
    "Women_Prop": "13.69%",
    "Children_Prop": "18.84%",
    "Violence_Prop": "67.29%",
    "Fraud_Prop": "0.18%"
  },
  {
    "district_name": "Dima Hasao",
    "Women_Prop": "6.65%",
    "Children_Prop": "24.93%",
    "Violence_Prop": "62.60%",
    "Fraud_Prop": "5.82%"
  },
  {
    "district_name": "Nagaon",
    "Women_Prop": "16.36%",
    "Children_Prop": "23.13%",
    "Violence_Prop": "58.34%",
    "Fraud_Prop": "2.17%"
  },
  {
    "district_name": "Nalbari",
    "Women_Prop": "18.27%",
    "Children_Prop": "11.98%",
    "Violence_Prop": "63.45%",
    "Fraud_Prop": "6.29%"
  },
  {
    "district_name": "Sivasagar",
    "Women_Prop": "13.46%",
    "Children_Prop": "22.87%",
    "Violence_Prop": "58.57%",
    "Fraud_Prop": "5.11%"
  },
  {
    "district_name": "Sonitpur",
    "Women_Prop": "13.78%",
    "Children_Prop": "16.35%",
    "Violence_Prop": "69.79%",
    "Fraud_Prop": "0.08%"
  },
  {
    "district_name": "Tinsukia",
    "Women_Prop": "13.78%",
    "Children_Prop": "17.70%",
    "Violence_Prop": "67.30%",
    "Fraud_Prop": "1.22%"
  },
  {
    "district_name": "Udalguri",
    "Women_Prop": "14.53%",
    "Children_Prop": "11.50%",
    "Violence_Prop": "71.64%",
    "Fraud_Prop": "2.33%"
  },
  {
    "district_name": "Majuli",
    "Women_Prop": "18.69%",
    "Children_Prop": "15.81%",
    "Violence_Prop": "62.83%",
    "Fraud_Prop": "2.67%"
  },
  {
    "district_name": "Biswanath",
    "Women_Prop": "15.91%",
    "Children_Prop": "29.56%",
    "Violence_Prop": "51.12%",
    "Fraud_Prop": "3.41%"
  },
  {
    "district_name": "Hojai",
    "Women_Prop": "20.62%",
    "Children_Prop": "21.38%",
    "Violence_Prop": "52.36%",
    "Fraud_Prop": "5.64%"
  },
  {
    "district_name": "South Salmara Mancachar",
    "Women_Prop": "19.47%",
    "Children_Prop": "13.83%",
    "Violence_Prop": "64.61%",
    "Fraud_Prop": "2.10%"
  },
  {
    "district_name": "Charaideo",
    "Women_Prop": "12.99%",
    "Children_Prop": "23.77%",
    "Violence_Prop": "62.75%",
    "Fraud_Prop": "0.49%"
  },
  {
    "district_name": "Bishnupur",
    "Women_Prop": "8.03%",
    "Children_Prop": "16.44%",
    "Violence_Prop": "75.33%",
    "Fraud_Prop": "0.19%"
  },
  {
    "district_name": "Chandel",
    "Women_Prop": "0.89%",
    "Children_Prop": "10.71%",
    "Violence_Prop": "84.82%",
    "Fraud_Prop": "3.57%"
  },
  {
    "district_name": "Churachandpur",
    "Women_Prop": "4.63%",
    "Children_Prop": "12.96%",
    "Violence_Prop": "78.24%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Imphal West",
    "Women_Prop": "18.18%",
    "Children_Prop": "15.96%",
    "Violence_Prop": "55.04%",
    "Fraud_Prop": "10.82%"
  },
  {
    "district_name": "Imphal East",
    "Women_Prop": "11.76%",
    "Children_Prop": "13.18%",
    "Violence_Prop": "71.46%",
    "Fraud_Prop": "3.59%"
  },
  {
    "district_name": "Senapati",
    "Women_Prop": "4.03%",
    "Children_Prop": "6.45%",
    "Violence_Prop": "87.90%",
    "Fraud_Prop": "1.61%"
  },
  {
    "district_name": "Tamenglong",
    "Women_Prop": "1.15%",
    "Children_Prop": "4.60%",
    "Violence_Prop": "94.25%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Thoubal",
    "Women_Prop": "14.41%",
    "Children_Prop": "22.74%",
    "Violence_Prop": "56.50%",
    "Fraud_Prop": "6.36%"
  },
  {
    "district_name": "Ukhrul",
    "Women_Prop": "3.41%",
    "Children_Prop": "20.45%",
    "Violence_Prop": "76.14%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "East Garo Hills",
    "Women_Prop": "15.02%",
    "Children_Prop": "32.02%",
    "Violence_Prop": "43.48%",
    "Fraud_Prop": "9.49%"
  },
  {
    "district_name": "North Garo Hills",
    "Women_Prop": "11.40%",
    "Children_Prop": "38.16%",
    "Violence_Prop": "41.23%",
    "Fraud_Prop": "9.21%"
  },
  {
    "district_name": "South Garo Hills",
    "Women_Prop": "7.51%",
    "Children_Prop": "36.62%",
    "Violence_Prop": "53.99%",
    "Fraud_Prop": "1.88%"
  },
  {
    "district_name": "South West Garo Hills",
    "Women_Prop": "24.32%",
    "Children_Prop": "25.68%",
    "Violence_Prop": "48.65%",
    "Fraud_Prop": "1.35%"
  },
  {
    "district_name": "West Garo Hills",
    "Women_Prop": "12.37%",
    "Children_Prop": "31.59%",
    "Violence_Prop": "40.34%",
    "Fraud_Prop": "15.69%"
  },
  {
    "district_name": "West Jaintia Hills",
    "Women_Prop": "10.92%",
    "Children_Prop": "35.31%",
    "Violence_Prop": "51.08%",
    "Fraud_Prop": "2.70%"
  },
  {
    "district_name": "East Jaintia Hills",
    "Women_Prop": "20.62%",
    "Children_Prop": "27.17%",
    "Violence_Prop": "50.48%",
    "Fraud_Prop": "1.73%"
  },
  {
    "district_name": "East Khasi Hills",
    "Women_Prop": "14.38%",
    "Children_Prop": "31.70%",
    "Violence_Prop": "50.09%",
    "Fraud_Prop": "3.83%"
  },
  {
    "district_name": "South West Khasi Hills",
    "Women_Prop": "9.63%",
    "Children_Prop": "37.16%",
    "Violence_Prop": "47.71%",
    "Fraud_Prop": "5.50%"
  },
  {
    "district_name": "West Khasi Hills",
    "Women_Prop": "13.65%",
    "Children_Prop": "54.00%",
    "Violence_Prop": "31.19%",
    "Fraud_Prop": "1.17%"
  },
  {
    "district_name": "Ri Bhoi",
    "Women_Prop": "26.77%",
    "Children_Prop": "25.24%",
    "Violence_Prop": "44.34%",
    "Fraud_Prop": "3.66%"
  },
  {
    "district_name": "Aizawl",
    "Women_Prop": "17.34%",
    "Children_Prop": "26.09%",
    "Violence_Prop": "48.81%",
    "Fraud_Prop": "7.76%"
  },
  {
    "district_name": "Champhai",
    "Women_Prop": "12.50%",
    "Children_Prop": "51.21%",
    "Violence_Prop": "32.26%",
    "Fraud_Prop": "4.03%"
  },
  {
    "district_name": "Kolasib",
    "Women_Prop": "11.61%",
    "Children_Prop": "28.76%",
    "Violence_Prop": "56.99%",
    "Fraud_Prop": "2.64%"
  },
  {
    "district_name": "Lawngtlai",
    "Women_Prop": "12.67%",
    "Children_Prop": "29.33%",
    "Violence_Prop": "54.00%",
    "Fraud_Prop": "4.00%"
  },
  {
    "district_name": "Lunglei",
    "Women_Prop": "11.45%",
    "Children_Prop": "27.86%",
    "Violence_Prop": "58.40%",
    "Fraud_Prop": "2.29%"
  },
  {
    "district_name": "Mamit",
    "Women_Prop": "13.31%",
    "Children_Prop": "37.26%",
    "Violence_Prop": "47.15%",
    "Fraud_Prop": "2.28%"
  },
  {
    "district_name": "Saiha",
    "Women_Prop": "4.90%",
    "Children_Prop": "42.16%",
    "Violence_Prop": "52.94%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Serchhip",
    "Women_Prop": "12.50%",
    "Children_Prop": "33.15%",
    "Violence_Prop": "51.09%",
    "Fraud_Prop": "3.26%"
  },
  {
    "district_name": "Dimapur",
    "Women_Prop": "3.46%",
    "Children_Prop": "18.81%",
    "Violence_Prop": "62.05%",
    "Fraud_Prop": "15.68%"
  },
  {
    "district_name": "Kiphire",
    "Women_Prop": "14.81%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "77.78%",
    "Fraud_Prop": "7.41%"
  },
  {
    "district_name": "Kohima",
    "Women_Prop": "15.14%",
    "Children_Prop": "12.84%",
    "Violence_Prop": "57.80%",
    "Fraud_Prop": "14.22%"
  },
  {
    "district_name": "Longleng",
    "Women_Prop": "9.09%",
    "Children_Prop": "4.55%",
    "Violence_Prop": "72.73%",
    "Fraud_Prop": "13.64%"
  },
  {
    "district_name": "Mokokchung",
    "Women_Prop": "6.06%",
    "Children_Prop": "10.10%",
    "Violence_Prop": "71.72%",
    "Fraud_Prop": "12.12%"
  },
  {
    "district_name": "Mon",
    "Women_Prop": "7.69%",
    "Children_Prop": "14.42%",
    "Violence_Prop": "75.00%",
    "Fraud_Prop": "2.88%"
  },
  {
    "district_name": "Peren",
    "Women_Prop": "10.00%",
    "Children_Prop": "13.33%",
    "Violence_Prop": "76.67%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Phek",
    "Women_Prop": "16.67%",
    "Children_Prop": "14.58%",
    "Violence_Prop": "64.58%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Tuensang",
    "Women_Prop": "9.84%",
    "Children_Prop": "21.31%",
    "Violence_Prop": "63.93%",
    "Fraud_Prop": "4.92%"
  },
  {
    "district_name": "Wokha",
    "Women_Prop": "1.14%",
    "Children_Prop": "14.77%",
    "Violence_Prop": "84.09%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Zunheboto",
    "Women_Prop": "3.95%",
    "Children_Prop": "25.00%",
    "Violence_Prop": "68.42%",
    "Fraud_Prop": "2.63%"
  },
  {
    "district_name": "Gangtok",
    "Women_Prop": "10.47%",
    "Children_Prop": "44.38%",
    "Violence_Prop": "38.08%",
    "Fraud_Prop": "7.07%"
  },
  {
    "district_name": "Mangan",
    "Women_Prop": "7.27%",
    "Children_Prop": "60.00%",
    "Violence_Prop": "32.73%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Namchi",
    "Women_Prop": "8.52%",
    "Children_Prop": "47.87%",
    "Violence_Prop": "40.82%",
    "Fraud_Prop": "2.79%"
  },
  {
    "district_name": "Gyalshing",
    "Women_Prop": "7.01%",
    "Children_Prop": "50.18%",
    "Violence_Prop": "38.01%",
    "Fraud_Prop": "4.80%"
  },
  {
    "district_name": "Dhalai",
    "Women_Prop": "7.31%",
    "Children_Prop": "12.12%",
    "Violence_Prop": "79.71%",
    "Fraud_Prop": "0.86%"
  },
  {
    "district_name": "Gomati",
    "Women_Prop": "13.78%",
    "Children_Prop": "16.25%",
    "Violence_Prop": "67.49%",
    "Fraud_Prop": "2.48%"
  },
  {
    "district_name": "West Tripura",
    "Women_Prop": "10.87%",
    "Children_Prop": "15.40%",
    "Violence_Prop": "63.86%",
    "Fraud_Prop": "9.86%"
  },
  {
    "district_name": "Khowai",
    "Women_Prop": "12.75%",
    "Children_Prop": "16.63%",
    "Violence_Prop": "68.00%",
    "Fraud_Prop": "2.63%"
  },
  {
    "district_name": "North Tripura",
    "Women_Prop": "16.98%",
    "Children_Prop": "15.33%",
    "Violence_Prop": "67.22%",
    "Fraud_Prop": "0.47%"
  },
  {
    "district_name": "Sepahijala",
    "Women_Prop": "12.01%",
    "Children_Prop": "35.78%",
    "Violence_Prop": "52.21%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "South Tripura",
    "Women_Prop": "9.46%",
    "Children_Prop": "11.62%",
    "Violence_Prop": "77.57%",
    "Fraud_Prop": "1.34%"
  },
  {
    "district_name": "Unakoti",
    "Women_Prop": "12.95%",
    "Children_Prop": "12.71%",
    "Violence_Prop": "71.91%",
    "Fraud_Prop": "2.43%"
  },
  {
    "district_name": "Kamle",
    "Women_Prop": "10.20%",
    "Children_Prop": "4.08%",
    "Violence_Prop": "79.59%",
    "Fraud_Prop": "6.12%"
  },
  {
    "district_name": "Kra Daadi",
    "Women_Prop": "16.67%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "79.17%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Lower Siang",
    "Women_Prop": "16.00%",
    "Children_Prop": "0.80%",
    "Violence_Prop": "77.60%",
    "Fraud_Prop": "5.60%"
  },
  {
    "district_name": "Leparada",
    "Women_Prop": "30.00%",
    "Children_Prop": "6.00%",
    "Violence_Prop": "60.00%",
    "Fraud_Prop": "4.00%"
  },
  {
    "district_name": "Shi Yomi",
    "Women_Prop": "10.00%",
    "Children_Prop": "10.00%",
    "Violence_Prop": "80.00%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Pakke Kessang",
    "Women_Prop": "29.03%",
    "Children_Prop": "16.13%",
    "Violence_Prop": "48.39%",
    "Fraud_Prop": "6.45%"
  },
  {
    "district_name": "Bajali",
    "Women_Prop": "20.83%",
    "Children_Prop": "4.17%",
    "Violence_Prop": "51.39%",
    "Fraud_Prop": "23.61%"
  },
  {
    "district_name": "Tamulpur",
    "Women_Prop": "17.80%",
    "Children_Prop": "50.00%",
    "Violence_Prop": "32.20%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kakching",
    "Women_Prop": "25.41%",
    "Children_Prop": "45.90%",
    "Violence_Prop": "28.69%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kamjong",
    "Women_Prop": "0.00%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "100.00%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kangpokpi",
    "Women_Prop": "4.35%",
    "Children_Prop": "4.35%",
    "Violence_Prop": "82.61%",
    "Fraud_Prop": "8.70%"
  },
  {
    "district_name": "Jiribam",
    "Women_Prop": "7.89%",
    "Children_Prop": "23.68%",
    "Violence_Prop": "68.42%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Noney",
    "Women_Prop": "3.23%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "93.55%",
    "Fraud_Prop": "3.23%"
  },
  {
    "district_name": "Pherzawl",
    "Women_Prop": "22.22%",
    "Children_Prop": "22.22%",
    "Violence_Prop": "55.56%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Tengnoupal",
    "Women_Prop": "9.52%",
    "Children_Prop": "20.63%",
    "Violence_Prop": "46.03%",
    "Fraud_Prop": "23.81%"
  },
  {
    "district_name": "Eastern West Khasi Hills",
    "Women_Prop": "17.39%",
    "Children_Prop": "47.83%",
    "Violence_Prop": "34.78%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Saitual",
    "Women_Prop": "0.00%",
    "Children_Prop": "28.57%",
    "Violence_Prop": "71.43%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Khawzawl",
    "Women_Prop": "28.57%",
    "Children_Prop": "45.71%",
    "Violence_Prop": "25.71%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Hnahthial",
    "Women_Prop": "30.77%",
    "Children_Prop": "15.38%",
    "Violence_Prop": "53.85%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Soreng",
    "Women_Prop": "5.56%",
    "Children_Prop": "66.67%",
    "Violence_Prop": "27.78%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Pakyong",
    "Women_Prop": "11.48%",
    "Children_Prop": "21.31%",
    "Violence_Prop": "65.57%",
    "Fraud_Prop": "1.64%"
  },
  {
    "district_name": "Siaha",
    "Women_Prop": "23.17%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "76.83%",
    "Fraud_Prop": "0.00%"
  }
]
`
          }
        ]
      }
    ]
  }

   const handleAI = async () => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCr7RlUz910nhaLin7YMj98DqEh83TgLCA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Prompt)
      });

      const data = await response.json();

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        setAiData(aiText);
      } else {
        console.error("AI response format unexpected:", data);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };
  
  const [aiData,setAiData]=useState("")
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userLocations, setUserLocations] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your travel assistant. How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [leafletIcon, setLeafletIcon] = useState(null);
  const [userLocationIcon, setUserLocationIcon] = useState(null);
  const [safetyScore, setSafetyScore] = useState(100);
  const [isInRiskZone, setIsInRiskZone] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [emergencyContacts] = useState([
    { name: "Police", number: "100" },
    { name: "Emergency Services", number: "108" },
    { name: "Tourist Helpline", number: "1363" },
    { name: "Fire Department", number: "101" }
  ]);

  // Heatmap zones with risk levels around user location
  const [heatmapZones, setHeatmapZones] = useState([]);

 const generateHeatmapZones = (userLat, userLng) => {
  const zones = [];

  // ✅ Add user's current location
  zones.push({
    id: 0,
    name: "You Are Here",
    lat: userLat,
    lng: userLng,
    radius: 700,
    risk: "low",
    color: "#059669", // green
    icon: "📍",
    intensity: 0.1
  });

  // ✅ Add exactly one red zone (high risk), non-overlapping
  const redZoneType = {
    name: "Danger Zone",
    risk: "high",
    color: "#dc9626ff", // red
    radius: 500,
    icon: "⚠️"
  };

  let redZoneLat, redZoneLng, distanceFromUser;
  const minDistance = 0.01; // ~1km (in degrees)

  // Try to generate a red zone that's at least 1km from user
  do {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 0.01 + Math.random() * 0.01; // between 1km and ~2km
    const dx = distance * Math.cos(angle);
    const dy = distance * Math.sin(angle);
    redZoneLat = userLat + dy;
    redZoneLng = userLng + dx;

    // Calculate straight-line distance in degrees
    distanceFromUser = Math.sqrt(Math.pow(redZoneLat - userLat, 2) + Math.pow(redZoneLng - userLng, 2));
  } while (distanceFromUser < minDistance);

  zones.push({
    id: 1,
    name: redZoneType.name,
    lat: redZoneLat,
    lng: redZoneLng,
    radius: redZoneType.radius,
    risk: redZoneType.risk,
    color: redZoneType.color,
    icon: redZoneType.icon,
    intensity: 0.4
  });

  return zones;
};


  const router = useRouter();
  const { user, logout } = useAuth();

  // Initialize Leaflet icons on client side with better styling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');

      // Fix for default markers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Regular user icon (blue)
      const regularIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      // Custom user location icon (red/larger)
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="
          background-color: #dc2626;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 10px;
            font-weight: bold;
          ">📍</div>
        </div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      setLeafletIcon(regularIcon);
      setUserLocationIcon(userIcon);
    }
  }, []);

  // Calculate safety score and check for zone warnings
  const calculateSafetyScore = (lat, lng) => {
    let score = 100;
    let inRiskZone = false;
    let currentZones = [];

    heatmapZones.forEach(zone => {
      const distance = getDistance(lat, lng, zone.lat, zone.lng);
      if (distance < zone.radius) {
        inRiskZone = true;
        currentZones.push(zone);

        if (zone.risk === 'high') {
          score -= 25;
          // Show warning for high risk zones
          if (typeof window !== 'undefined' && document && !document.querySelector('.risk-warning-active')) {
            showLocationWarning(zone);
          }
        } else if (zone.risk === 'medium') {
          score -= 10;
        } else if (zone.risk === 'low') {
          score += 5; // Bonus for safe areas
        }
      }
    });

    setIsInRiskZone(inRiskZone);
    return Math.min(Math.max(score, 0), 100);
  };

  // Show location-based warning with better styling
  const showLocationWarning = (zone) => {
    if (typeof window !== 'undefined' && document) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'risk-warning-active fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-pulse';
      warningDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl animate-bounce">${zone.icon}</span>
          <div>
            <div class="font-bold text-lg"> RISK ZONE ALERT</div>
            <div class="text-sm opacity-90">Entered: ${zone.name}</div>
            <div class="text-xs opacity-75 mt-1">Stay alert and follow safety protocols</div>
          </div>
        </div>
      `;

      document.body.appendChild(warningDiv);

      // Auto remove after 6 seconds
      setTimeout(() => {
        if (warningDiv && warningDiv.parentNode) {
          warningDiv.style.opacity = '0';
          warningDiv.style.transform = 'translate(-50%, -100%)';
          setTimeout(() => warningDiv.remove(), 300);
        }
      }, 6000);
    }
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
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

  // Enhanced location tracking with better error handling
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log('Location obtained:', { latitude, longitude, accuracy });

      setPosition([latitude, longitude]);
      setLocationAccuracy(accuracy);
      setLastUpdated(new Date());
      setLocationError(null);

      // Generate heatmap zones around user location (only once)
      if (heatmapZones.length === 0) {
        const zones = generateHeatmapZones(latitude, longitude);
        console.log('Generated zones:', zones);
        setHeatmapZones(zones);
      }

      // Calculate safety score
      const score = calculateSafetyScore(latitude, longitude);
      setSafetyScore(score);

      // Emit location to socket
      if (socket) {
        socket.emit("send-location", {
          latitude,
          longitude,
          safetyScore: score,
          accuracy,
          timestamp: new Date().toISOString()
        });
      }
    };

    const error = (err) => {
      console.error('Geolocation error:', err);
      let errorMessage = "Unable to retrieve your location.";

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable location permissions.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "Location request timed out. Trying again...";
          break;
      }

      setLocationError(errorMessage);

      // Retry after timeout error
      if (err.code === err.TIMEOUT) {
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(success, error, options);
        }, 3000);
      }
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(success, error, options);

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Panic button handler with enhanced feedback
  const handlePanicButton = () => {
    if (!position) {
      alert("Location not available. Cannot send panic alert.");
      return;
    }

    if (confirm(" EMERGENCY ALERT\n\nAre you sure you want to send a panic alert? This will immediately notify emergency services and nearby authorities of your location.\n\nClick OK to confirm or Cancel to abort.")) {
      const alertData = {
        type: 'panic',
        touristId: socket.id,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Tourist',
        location: { lat: position[0], lng: position[1] },
        timestamp: new Date().toISOString(),
        status: 'active',
        safetyScore: safetyScore
      };

      // Send to backend
      socket.emit("panic-alert", alertData);

      // Show enhanced confirmation
      const confirmDiv = document.createElement('div');
      confirmDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-8 rounded-2xl shadow-2xl z-50 text-center max-w-md';
      confirmDiv.innerHTML = `
        <div class="text-6xl mb-4"></div>
        <div class="text-xl font-bold mb-2">EMERGENCY ALERT SENT!</div>
        <div class="text-sm opacity-90 mb-4">Help is on the way. Emergency services have been notified of your location.</div>
        <div class="text-xs opacity-75">Stay calm and remain in a safe location if possible.</div>
        <button onclick="this.parentElement.remove()" class="mt-4 bg-white text-red-600 px-4 py-2 rounded-lg font-bold">OK</button>
      `;

      document.body.appendChild(confirmDiv);
      setTimeout(() => confirmDiv.remove(), 10000);
    }
  };

  // Enhanced chatbot functionality
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = { type: 'user', text: newMessage };
    setChatMessages(prev => [...prev, userMessage, { type: 'bot', text: 'Typing…' }]);

    (async () => {
      const instruction = {
        text: `You are a helpful travel safety assistant. Use the provided DATA to answer user questions concisely and clearly. If the answer is not in the data, say you don't have that specific information and suggest safe general guidance. Prefer district-specific insights when mentioned by the user.`
      };

      const body = {
        contents: [
          {
            parts: [
              instruction,
              ...Prompt.contents[0].parts,
              { text: `User question: ${newMessage.trim()}` }
            ]
          }
        ]
      };

      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCr7RlUz910nhaLin7YMj98DqEh83TgLCA", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'bot', text: reply };
          return updated;
        });
        setAiData(reply);
      } catch (err) {
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'bot', text: 'I ran into an issue fetching AI assistance. Please try again.' };
          return updated;
        });
      }
    })();

    setNewMessage('');
  };

  // Socket listeners with enhanced connection handling
  useEffect(() => {
    // Handle socket connection
    socket.on("connect", () => {
      console.log("Socket connected, requesting all user locations");
      socket.emit("request-all-locations");
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log("Socket reconnected, requesting all user locations");
      socket.emit("request-all-locations");
    });

    // Handle receiving all user locations
    socket.on("all-locations", (locations) => {
      console.log("Received all locations:", locations);
      setUserLocations(locations);
    });

    // Handle individual location updates
    socket.on("receive-location", (data) => {
      const { id, latitude, longitude, accuracy, timestamp, safetyScore } = data;
      setUserLocations(prev => ({
        ...prev,
        [id]: {
          latitude,
          longitude,
          id,
          accuracy,
          timestamp,
          safetyScore,
          lastUpdate: new Date().toISOString()
        },
      }));
    });

    // Handle user disconnection
    socket.on("user-disconnected", (id) => {
      console.log("User disconnected:", id);
      setUserLocations(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("reconnect");
      socket.off("all-locations");
      socket.off("receive-location");
      socket.off("user-disconnected");
    };
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  // Loading state with better UX
  if (!position && !locationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Getting Your Location</h2>
          <p className="text-gray-600 mb-4">Please allow location access for the best experience</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (locationError && !position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Location Error</h2>
          <p className="text-gray-600 mb-4">{locationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navbar */}
      <nav className="w-full bg-white/95 backdrop-blur-sm shadow-xl px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Travling!
              </h1>
            </div>
            {user && (
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <IdCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Users className="w-5 h-5" />
              <span className="hidden md:inline">Tourist List</span>
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Bot className="w-5 h-5" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Enhanced Safety Status Bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-6 py-4 border border-gray-200">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${safetyScore >= 70 ? 'bg-green-100' : safetyScore >= 40 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <Shield className={`w-6 h-6 ${safetyScore >= 70 ? 'text-green-600' : safetyScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Safety Score</div>
                <div className={`text-2xl font-bold ${safetyScore >= 70 ? 'text-green-600' : safetyScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {safetyScore}%
                </div>
              </div>
            </div>

            {lastUpdated && (
              <div className="hidden md:flex items-center space-x-2 text-gray-600">
                <Activity className="w-4 h-4" />
                <div className="text-xs">
                  <div>Last Updated</div>
                  <div className="font-mono">{lastUpdated.toLocaleTimeString()}</div>
                </div>
              </div>
            )}

            {isInRiskZone && (
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-orange-600 animate-pulse" />
                <span className="text-sm font-semibold text-orange-700">Risk Zone Alert</span>
              </div>
            )}
          </div>

          <button
            onClick={handlePanicButton}
            className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-2xl animate-pulse"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-lg">🚨 PANIC BUTTON</span>
          </button>
        </div>
      </nav>

      {/* Enhanced Dashboard Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Safety Score</p>
                <p className="text-3xl font-bold text-gray-900">{safetyScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Risk Zones</p>
                <p className="text-3xl font-bold text-gray-900">{heatmapZones.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-yellow-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-gray-900">{heatmapZones.filter(z => z.risk === 'high').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Nearby Users</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(userLocations).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-fit">
          {/* Main Map */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="h-96 md:h-[500px] w-full relative">
              {position && (
                <MapContainer
                  center={position}
                  zoom={15}
                  className="h-full w-full rounded-2xl"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User's current location */}
                  <Marker position={position} icon={userLocationIcon}>
                    <Popup>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">Your Location</div>
                        <div className="text-sm text-gray-600">
                          Accuracy: {locationAccuracy ? `${Math.round(locationAccuracy)}m` : 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Other users' locations */}
                  {Object.values(userLocations).map((userLoc) => (
                    <Marker
                      key={userLoc.id}
                      position={[userLoc.latitude, userLoc.longitude]}
                      icon={leafletIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-semibold">Tourist #{userLoc.id.slice(-4)}</div>
                          <div className="text-sm text-gray-600">
                            Safety: {userLoc.safetyScore}%
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Heatmap zones */}
                  {heatmapZones.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={[zone.lat, zone.lng]}
                      radius={zone.radius}
                      pathOptions={{
                        color: zone.color,
                        fillColor: zone.color,
                        fillOpacity: zone.intensity,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="text-2xl mb-1">{zone.icon}</div>
                          <div className={`font-bold ${zone.risk === 'high' ? 'text-red-600' :
                            zone.risk === 'medium' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                            {zone.name}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {zone.risk} risk area
                          </div>
                          <div className="text-xs text-gray-500">
                            Radius: {Math.round(zone.radius)}m
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          
        </div>
      </main>

      {/* Enhanced Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold">Travel Assistant</h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-emerald-200 transition"
            >
              ×
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl ${msg.type === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for help or information..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition transform hover:scale-110 z-40"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default TouristApp;