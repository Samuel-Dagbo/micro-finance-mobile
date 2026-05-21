import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function sendOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  })
  return { data, error }
}

export async function activateAccount(customerId: string, phone: string) {
  const { data: customer, error: fetchError } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_id', customerId)
    .eq('phone', phone)
    .single()

  if (fetchError || !customer) {
    return { error: 'Invalid Customer ID or phone number' }
  }

  if (customer.status !== 'pending_activation') {
    return { error: 'Account already activated' }
  }

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: customer.email,
    options: {
      shouldCreateUser: true,
      data: { customer_id: customer.customer_id },
    },
  })

  if (otpError) {
    return { error: otpError.message }
  }

  return { success: true, email: customer.email }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('customers')
    .select('*, branches(name)')
    .eq('user_id', user.id)
    .single()

  return data
}
