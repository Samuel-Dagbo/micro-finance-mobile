import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import LoginScreen from '@/screens/LoginScreen'
import ActivateScreen from '@/screens/ActivateScreen'
import OtpScreen from '@/screens/OtpScreen'
import DashboardScreen from '@/screens/DashboardScreen'
import SavingsScreen from '@/screens/SavingsScreen'
import LoansScreen from '@/screens/LoansScreen'
import TransactionsScreen from '@/screens/TransactionsScreen'
import NotificationsScreen from '@/screens/NotificationsScreen'
import ProfileScreen from '@/screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabIcon({ focused, icon, label }: any) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
      <Ionicons
        name={icon as any}
        size={22}
        color={focused ? '#3B82F6' : '#9CA3AF'}
        style={{ marginBottom: 2 }}
      />
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? '600' : '400',
          color: focused ? '#3B82F6' : '#9CA3AF',
        }}
      >
        {label}
      </Text>
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          paddingTop: Platform.OS === 'ios' ? 8 : 4,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 80 : 64,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={focused ? 'home' : 'home-outline'} label="Home" /> }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={focused ? 'wallet' : 'wallet-outline'} label="Savings" /> }}
      />
      <Tab.Screen
        name="Loans"
        component={LoansScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={focused ? 'receipt' : 'receipt-outline'} label="Loans" /> }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={focused ? 'notifications' : 'notifications-outline'} label="Alerts" /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={focused ? 'person' : 'person-outline'} label="Profile" /> }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Activate" component={ActivateScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
