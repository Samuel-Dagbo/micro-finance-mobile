import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import AppNavigator from '@/navigation/AppNavigator'
import LoginScreen from '@/screens/LoginScreen'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <LoginScreen />
  }

  return <AppNavigator />
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppContent />
          <StatusBar style="light" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
