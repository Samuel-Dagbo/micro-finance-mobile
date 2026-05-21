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
import { getTransactions } from '@/services/api'
import { formatCurrency, formatDateTime, getTransactionTypeColor } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'

export default function TransactionsScreen() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadTransactions = async () => {
    if (!user?.id) return
    const { data } = await getTransactions(user.id)
    setTransactions(data)
  }

  useEffect(() => {
    loadTransactions()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadTransactions()
    setRefreshing(false)
  }

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      deposit: 'arrow-down-circle',
      withdrawal: 'arrow-up-circle',
      loan_disbursement: 'cash',
      loan_repayment: 'checkmark-circle',
      penalty: 'alert-circle',
      interest: 'trending-up',
    }
    return icons[type] || 'document'
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
            <Ionicons name="swap-horizontal" size={28} color="#F59E0B" />
          </View>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>
            {transactions.length} transaction(s)
          </Text>
        </View>

        {/* Transactions List */}
        <View style={styles.content}>
          {transactions.map((txn) => (
            <View key={txn.id} style={styles.transactionCard}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      txn.type === 'deposit' || txn.type === 'loan_repayment'
                        ? '#D1FAE5'
                        : txn.type === 'withdrawal' || txn.type === 'penalty'
                        ? '#FEE2E2'
                        : '#DBEAFE',
                  },
                ]}
              >
                <Ionicons
                  name={getTransactionIcon(txn.type)}
                  size={20}
                  color={getTransactionTypeColor(txn.type)}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {txn.type
                    .replace('_', ' ')
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatDateTime(txn.created_at)}
                </Text>
                {txn.description && (
                  <Text style={styles.transactionDesc} numberOfLines={1}>
                    {txn.description}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      txn.type === 'deposit' || txn.type === 'loan_repayment'
                        ? '#10B981'
                        : '#EF4444',
                  },
                ]}
              >
                {txn.type === 'deposit' || txn.type === 'loan_repayment'
                  ? '+'
                  : '-'}
                {formatCurrency(txn.amount)}
              </Text>
            </View>
          ))}

          {transactions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="swap-horizontal-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyText}>
                Your transaction history will appear here
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
    backgroundColor: '#FEF3C7',
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
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
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
