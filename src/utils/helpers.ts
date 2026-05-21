import { CURRENCY_SYMBOL, CURRENCY } from '@/config/env'

export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL} ${new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getLoanStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    approved: '#3B82F6',
    disbursed: '#8B5CF6',
    active: '#10B981',
    completed: '#6B7280',
    defaulted: '#EF4444',
    rejected: '#EF4444',
  }
  return colors[status] || '#6B7280'
}

export function getTransactionTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    deposit: 'arrow-down-circle',
    withdrawal: 'arrow-up-circle',
    loan_disbursement: 'cash',
    loan_repayment: 'check-circle',
    penalty: 'alert-circle',
    interest: 'trending-up',
  }
  return icons[type] || 'file-text'
}

export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    deposit: '#10B981',
    withdrawal: '#EF4444',
    loan_disbursement: '#3B82F6',
    loan_repayment: '#10B981',
    penalty: '#EF4444',
    interest: '#8B5CF6',
  }
  return colors[type] || '#6B7280'
}
