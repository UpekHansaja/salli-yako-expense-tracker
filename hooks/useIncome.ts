import useSWR from 'swr';

// Construct API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Fetcher with proper URL construction and error handling
const fetcher = (url: string) => 
  fetch(`${API_BASE_URL}${url}`).then(res => {
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return res.json();
  });

// SWR configuration to prevent modal closing on refetch
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 60000,
  focusThrottleInterval: 300000,
};

// Hook for monthly income
export function useMonthlyIncome(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/monthly-income/${userId}` : null,
    fetcher,
    swrConfig
  );

  return {
    monthlyIncomes: data || [],
    isLoading,
    error,
    mutate
  };
}

// Hook for other income
export function useOtherIncome(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/other-income/${userId}` : null,
    fetcher,
    swrConfig
  );

  return {
    otherIncomes: data || [],
    isLoading,
    error,
    mutate
  };
}

// Hook for other income by month
export function useOtherIncomeByMonth(userId: string | null, month: number) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/other-income/${userId}/month/${month}` : null,
    fetcher,
    swrConfig
  );

  return {
    otherIncomes: data || [],
    isLoading,
    error,
    mutate
  };
}

// Hook for monthly income total
export function useMonthlyIncomeTotal(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/monthly-income/${userId}/total` : null,
    fetcher,
    swrConfig
  );

  return {
    total: data?.total || 0,
    isLoading,
    error,
    mutate
  };
}

// Hook for other income total
export function useOtherIncomeTotal(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/other-income/${userId}/total` : null,
    fetcher,
    swrConfig
  );

  return {
    total: data?.total || 0,
    isLoading,
    error,
    mutate
  };
}

// Hook for combined monthly income summary
export function useIncomeSummary(userId: string | null, month: number) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/income/${userId}/monthly/${month}` : null,
    fetcher,
    swrConfig
  );

  return {
    summary: data || {
      month: 0,
      year: 0,
      monthly_income: 0,
      other_income: 0,
      total_income: 0
    },
    isLoading,
    error,
    mutate
  };
}

// Function to add monthly income
export async function addMonthlyIncome(userId: string, amount: number, renewal_date: number, description: string) {
  const response = await fetch(`${API_BASE_URL}/api/monthly-income`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount, renewal_date, description })
  });
  if (!response.ok) {
    throw new Error(`Failed to add monthly income: ${response.statusText}`);
  }
  return response.json();
}

// Function to update monthly income
export async function updateMonthlyIncome(id: string, amount: number, renewal_date: number, description: string, active: number) {
  const response = await fetch(`${API_BASE_URL}/api/monthly-income/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, renewal_date, description, active })
  });
  if (!response.ok) {
    throw new Error(`Failed to update monthly income: ${response.statusText}`);
  }
  return response.json();
}

// Function to delete monthly income
export async function deleteMonthlyIncome(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/monthly-income/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Failed to delete monthly income: ${response.statusText}`);
  }
  return response.json();
}

// Function to add other income
export async function addOtherIncome(userId: string, amount: number, source: string, description: string, income_date: string, category: string = 'other') {
  const response = await fetch(`${API_BASE_URL}/api/other-income`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount, source, description, income_date, category })
  });
  if (!response.ok) {
    throw new Error(`Failed to add other income: ${response.statusText}`);
  }
  return response.json();
}

// Function to update other income
export async function updateOtherIncome(id: string, amount: number, source: string, description: string, income_date: string, category: string = 'other') {
  const response = await fetch(`${API_BASE_URL}/api/other-income/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, source, description, income_date, category })
  });
  if (!response.ok) {
    throw new Error(`Failed to update other income: ${response.statusText}`);
  }
  return response.json();
}

// Function to delete other income
export async function deleteOtherIncome(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/other-income/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Failed to delete other income: ${response.statusText}`);
  }
  return response.json();
}
