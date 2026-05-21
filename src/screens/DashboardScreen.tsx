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
import { getCustomerDashboard } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function DashboardScreen({ navigation }: any) {
  const { user, signOut } = useAuth()
  const [dashboard, setDashboard] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboard = async () => {
    if (!user?.id) return
    const data = await getCustomerDashboard(user.id)
    setDashboard(data)
  }

  useEffect(() => {
    loadDashboard()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboard()
    setRefreshing(false)
  }

  const totalSavings =
    dashboard?.savings?.reduce(
      (sum: number, s: any) => sum + Number(s.balance),
      0
    ) || 0

  const totalLoanBalance =
    dashboard?.loans?.reduce(
      (sum: number, l: any) =>
        sum + (Number(l.total_repayable) - Number(l.amount_paid)),
      0
    ) || 0

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        <LinearGradient
          colors={['#1E3A8A', '#2563EB', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
              <Text style={styles.name}>
                {user?.first_name || 'Customer'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {user?.first_name?.[0] || 'C'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Total Savings</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(totalSavings)}
                </Text>
              </View>
              <View style={styles.balanceIcon}>
                <Ionicons name="wallet" size={28} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={18} color="rgba(255,255,255,0.7)" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>
                {dashboard?.loans?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Active Loans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="cash" size={18} color="rgba(255,255,255,0.7)" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>
                {formatCurrency(totalLoanBalance)}
              </Text>
              <Text style={styles.statLabel}>Loan Balance</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Savings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="wallet" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Savings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Loans')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="receipt" size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Loans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Transactions')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="swap-horizontal" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="notifications" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.actionText}>Alerts</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Transactions */}
          {dashboard?.transactions?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              {dashboard.transactions.slice(0, 5).map((txn: any) => (
                <View key={txn.id} style={styles.transactionItem}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          txn.type === 'deposit' || txn.type === 'loan_repayment'
                            ? '#D1FAE5'
                            : '#FEE2E2',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        txn.type === 'deposit'
                          ? 'arrow-down'
                          : txn.type === 'withdrawal'
                          ? 'arrow-up'
                          : 'swap-horizontal'
                      }
                      size={18}
                      color={
                        txn.type === 'deposit' || txn.type === 'loan_repayment'
                          ? '#10B981'
                          : '#EF4444'
                      }
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>
                      {txn.type
                        .replace('_', ' ')
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(txn.created_at)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          txn.type === 'deposit' ||
                          txn.type === 'loan_repayment'
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
            </View>
          )}

          {/* Active Loans */}
          {dashboard?.loans?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Loans</Text>
              {dashboard.loans.map((loan: any) => (
                <View key={loan.id} style={styles.loanCard}>
                  <View style={styles.loanHeader}>
                    <View>
                      <Text style={styles.loanNumber}>{loan.loan_number}</Text>
                      <Text style={styles.loanType}>
                        {loan.loan_type
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.loanStatus,
                        { backgroundColor: '#D1FAE5' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.loanStatusText,
                          { color: '#10B981' },
                        ]}
                      >
                        {loan.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.loanDetails}>
                    <View>
                      <Text style={styles.loanDetailLabel}>Principal</Text>
                      <Text style={styles.loanDetailValue}>
                        {formatCurrency(loan.principal_amount)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.loanDetailLabel}>Paid</Text>
                      <Text style={styles.loanDetailValue}>
                        {formatCurrency(loan.amount_paid)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.loanDetailLabel}>Remaining</Text>
                      <Text style={styles.loanDetailValue}>
                        {formatCurrency(
                          loan.total_repayable - loan.amount_paid
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (loan.amount_paid / loan.total_repayable) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(
                      (loan.amount_paid / loan.total_repayable) * 100
                    )}
                    % repaid
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Empty state */}
          {!dashboard?.transactions?.length && !dashboard?.loans?.length && (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Welcome to MicroFin</Text>
              <Text style={styles.emptyText}>
                Your financial dashboard will appear here once you have active accounts.
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceCard: {
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  transactionItem: {
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
    width: 40,
    height: 40,
    borderRadius: 12,
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
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  loanCard: {
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
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  loanType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  loanStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  loanStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loanDetailLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  loanDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#6B7280',
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
    paddingHorizontal: 32,
  },
})
