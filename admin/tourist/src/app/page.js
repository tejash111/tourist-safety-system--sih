"use client";
import TouristApp from "@/components/TouristApp";
import ProtectedRoute from "@/components/ProtectedRoute";

const Home = () => {
  return (
    <ProtectedRoute>
      <TouristApp />
    </ProtectedRoute>
  );
};

export default Home;