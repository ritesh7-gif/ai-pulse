import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import SavedPage from "./pages/SavedPage";
import SubmitPage from "./pages/SubmitPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import PrivacyPage from "./pages/PrivacyPage";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Standalone login page (no Layout shell) */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Layout />}>
          {/* Main tab pages */}
          <Route index element={<div />} />
          <Route path="startups" element={<div />} />
          <Route path="opensource" element={<div />} />

          {/* Protected pages */}
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />

          {/* Public pages */}
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="submit" element={<SubmitPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
