import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native'
import { useAuth } from '@/context/AuthContext'
import { getSavingsAccounts } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function SavingsScreen() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadAccounts = async () => {
    if (!user?.id) return
    const { data } = await getSavingsAccounts(user.id)
    setAccounts(data)
  }

  useEffect(() => {
    loadAccounts()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadAccounts()
    setRefreshing(false)
  }

  const totalBalance = accounts.reduce(
    (sum, a) => sum + Number(a.balance),
    0
  )

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
        {/* Summary Card */}
        <LinearGradient
          colors={['#059669', '#10B981', '#34D399']}
          style={styles.summaryCard}
        >
          <View style={styles.summaryHeader}>
            <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryCount}>
              {accounts.length} account(s)
            </Text>
          </View>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalBalance)}
          </Text>
        </LinearGradient>

        {/* Accounts List */}
        <View style={styles.content}>
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={styles.accountTypeIcon}>
                  <Ionicons
                    name={
                      account.account_type === 'fixed'
                        ? 'lock-closed'
                        : account.account_type === 'target'
                        ? 'flag'
                        : 'wallet'
                    }
                    size={20}
                    color="#10B981"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountNumber}>
                    {account.account_number}
                  </Text>
                  <Text style={styles.accountType}>
                    {account.account_type
                      .replace('_', ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        account.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          account.status === 'active' ? '#10B981' : '#EF4444',
                      },
                    ]}
                  >
                    {account.status}
                  </Text>
                </View>
              </View>

              <View style={styles.accountBalance}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(account.balance)}
                </Text>
              </View>

              <View style={styles.accountDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Interest Rate</Text>
                  <Text style={styles.detailValue}>
                    {account.interest_rate}%
                  </Text>
                </View>
                {account.target_amount && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Target</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(account.target_amount)}
                    </Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Opened</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(account.created_at)}
                  </Text>
                </View>
              </View>

              {account.target_amount && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (account.balance / account.target_amount) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(
                      (account.balance / account.target_amount) * 100
                    )}
                    %
                  </Text>
                </View>
              )}
            </View>
          ))}

          {accounts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Savings Accounts</Text>
              <Text style={styles.emptyText}>
                Visit our office to open a savings account
              </Text>
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
  summaryCard: {
    padding: 24,
    paddingTop: 56,
    margin: 16,
    borderRadius: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  accountType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  accountBalance: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
  },
  accountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 30,
    textAlign: 'right',
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
