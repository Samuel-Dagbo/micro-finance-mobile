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
import { getActiveLoans, getLoanHistory } from '@/services/api'
import { formatCurrency, formatDate, getLoanStatusColor } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'

export default function LoansScreen() {
  const { user } = useAuth()
  const [activeLoans, setActiveLoans] = useState<any[]>([])
  const [allLoans, setAllLoans] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadLoans = async () => {
    if (!user?.id) return
    const { data: active } = await getActiveLoans(user.id)
    const { data: all } = await getLoanHistory(user.id)
    setActiveLoans(active)
    setAllLoans(all)
  }

  useEffect(() => {
    loadLoans()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadLoans()
    setRefreshing(false)
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
            <Ionicons name="receipt" size={28} color="#3B82F6" />
          </View>
          <Text style={styles.headerTitle}>My Loans</Text>
          <Text style={styles.headerSubtitle}>
            {activeLoans.length} active loan(s)
          </Text>
        </View>

        <View style={styles.content}>
          {/* Active Loans */}
          {activeLoans.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Active Loans</Text>
              {activeLoans.map((loan) => (
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
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getLoanStatusColor(loan.status) + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getLoanStatusColor(loan.status) },
                        ]}
                      >
                        {loan.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.loanAmounts}>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Principal</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(loan.principal_amount)}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Total</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(loan.total_repayable)}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Paid</Text>
                      <Text
                        style={[
                          styles.amountValue,
                          { color: '#10B981' },
                        ]}
                      >
                        {formatCurrency(loan.amount_paid)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.remainingContainer}>
                    <Text style={styles.remainingLabel}>Remaining</Text>
                    <Text style={styles.remainingAmount}>
                      {formatCurrency(
                        loan.total_repayable - loan.amount_paid
                      )}
                    </Text>
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

                  <View style={styles.loanDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Interest</Text>
                      <Text style={styles.detailValue}>
                        {loan.interest_rate}%
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Term</Text>
                      <Text style={styles.detailValue}>
                        {loan.term_months}mo
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Frequency</Text>
                      <Text style={styles.detailValue}>
                        {loan.repayment_frequency}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Loan History */}
          {allLoans.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Loan History</Text>
              {allLoans.map((loan) => (
                <View key={loan.id} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Ionicons
                      name={
                        loan.status === 'completed'
                          ? 'checkmark-circle'
                          : loan.status === 'rejected'
                          ? 'close-circle'
                          : 'document'
                      }
                      size={20}
                      color={getLoanStatusColor(loan.status)}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyNumber}>
                        {loan.loan_number}
                      </Text>
                      <Text
                        style={[
                          styles.historyStatus,
                          { color: getLoanStatusColor(loan.status) },
                        ]}
                      >
                        {loan.status}
                      </Text>
                    </View>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyAmount}>
                        {formatCurrency(loan.principal_amount)}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDate(loan.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Empty State */}
          {allLoans.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Loans Yet</Text>
              <Text style={styles.emptyText}>
                Visit our office to apply for a loan
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
    backgroundColor: '#DBEAFE',
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
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
    marginBottom: 16,
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
  loanAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountItem: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  remainingLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
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
    marginBottom: 12,
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  historyItem: {
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
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
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
