import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { useAuth } from '@/context/AuthContext'
import { getNotifications } from '@/services/api'
import { formatDateTime } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'

export default function NotificationsScreen() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadNotifications = async () => {
    if (!user?.id) return
    const { data } = await getNotifications(user.id)
    setNotifications(data)
  }

  useEffect(() => {
    loadNotifications()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadNotifications()
    setRefreshing(false)
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      transaction: 'swap-horizontal',
      loan: 'receipt',
      savings: 'wallet',
      system: 'settings',
      announcement: 'megaphone',
      reminder: 'alarm',
    }
    return icons[type] || 'notifications'
  }

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      transaction: '#DBEAFE',
      loan: '#D1FAE5',
      savings: '#FEF3C7',
      system: '#EDE9FE',
      announcement: '#FCE7F3',
      reminder: '#FEE2E2',
    }
    return colors[type] || '#F3F4F6'
  }

  const getNotificationIconColor = (type: string) => {
    const colors: Record<string, string> = {
      transaction: '#3B82F6',
      loan: '#10B981',
      savings: '#F59E0B',
      system: '#8B5CF6',
      announcement: '#EC4899',
      reminder: '#EF4444',
    }
    return colors[type] || '#6B7280'
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="notifications" size={28} color="#8B5CF6" />
          </View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {notifications.filter((n) => n.status === 'unread').length} unread
          </Text>
        </View>

        {/* Notifications List */}
        <View style={styles.content}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                notification.status === 'unread' && styles.unreadCard,
              ]}
            >
              <View
                style={[
                  styles.notificationIcon,
                  {
                    backgroundColor: getNotificationColor(notification.type),
                  },
                ]}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color={getNotificationIconColor(notification.type)}
                />
              </View>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationDate}>
                  {formatDateTime(notification.created_at)}
                </Text>
              </View>
              {notification.status === 'unread' && (
                <View style={styles.unreadDot} />
              )}
            </TouchableOpacity>
          ))}

          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>You're all caught up!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 56,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    backgroundColor: '#F0F7FF',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
})
