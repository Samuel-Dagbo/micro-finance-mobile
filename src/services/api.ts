import { supabase } from './supabase'

export async function getCustomerDashboard(customerId: string) {
  const [savingsResult, loansResult, transactionsResult] = await Promise.all([
    supabase
      .from('savings_accounts')
      .select('*')
      .eq('customer_id', customerId)
      .eq('status', 'active'),
    supabase
      .from('loans')
      .select('*')
      .eq('customer_id', customerId)
      .in('status', ['active', 'disbursed']),
    supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return {
    savings: savingsResult.data || [],
    loans: loansResult.data || [],
    transactions: transactionsResult.data || [],
    savingsError: savingsResult.error,
    loansError: loansResult.error,
    transactionsError: transactionsResult.error,
  }
}

export async function getSavingsAccounts(customerId: string) {
  const { data, error } = await supabase
    .from('savings_accounts')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

export async function getTransactions(customerId: string, limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data: data || [], error }
}

export async function getActiveLoans(customerId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('customer_id', customerId)
    .in('status', ['active', 'disbursed'])
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

export async function getLoanHistory(customerId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

export async function getNotifications(customerId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(20)

  return { data: data || [], error }
}
