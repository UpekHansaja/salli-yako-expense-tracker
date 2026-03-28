import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Hook for monthly income
export function useMonthlyIncome(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/monthly-income/${userId}` : null,
    fetcher
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
    fetcher
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
    fetcher
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
    fetcher
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
    fetcher
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
    fetcher
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
  const response = await fetch('/api/monthly-income', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount, renewal_date, description })
  });
  return response.json();
}

// Function to update monthly income
export async function updateMonthlyIncome(id: string, amount: number, renewal_date: number, description: string, active: number) {
  const response = await fetch(`/api/monthly-income/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, renewal_date, description, active })
  });
  return response.json();
}

// Function to delete monthly income
export async function deleteMonthlyIncome(id: string) {
  const response = await fetch(`/api/monthly-income/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// Function to add other income
export async function addOtherIncome(userId: string, amount: number, source: string, description: string, income_date: string, category: string = 'other') {
  const response = await fetch('/api/other-income', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount, source, description, income_date, category })
  });
  return response.json();
}

// Function to update other income
export async function updateOtherIncome(id: string, amount: number, source: string, description: string, income_date: string, category: string = 'other') {
  const response = await fetch(`/api/other-income/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, source, description, income_date, category })
  });
  return response.json();
}

// Function to delete other income
export async function deleteOtherIncome(id: string) {
  const response = await fetch(`/api/other-income/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}
