import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native'
import { activateAccount } from '@/services/auth'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function ActivateScreen({ navigation }: any) {
  const [customerId, setCustomerId] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    if (!customerId || !phone) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    setLoading(true)
    const result = await activateAccount(customerId, phone)
    setLoading(false)
    if (result.error) {
      Alert.alert('Activation Failed', result.error)
    } else {
      Alert.alert(
        'Verification Sent',
        'Check your email for the verification code',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Otp', { email: result.email }),
          },
        ]
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#3B82F6" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#DBEAFE', '#BFDBFE']}
            style={styles.icon}
          >
            <Ionicons name="person-add" size={40} color="#3B82F6" />
          </LinearGradient>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Activate Account</Text>
          <Text style={styles.subtitle}>
            Enter your Customer ID and phone number to begin activation
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., MF000001"
              value={customerId}
              onChangeText={setCustomerId}
              autoCapitalize="characters"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+233 XX XXX XXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleActivate}
            disabled={loading}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Don't have a Customer ID? Visit our office to register.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
  },
})
