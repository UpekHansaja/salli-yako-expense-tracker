import useSWR from 'swr';
import { useAuth } from '@/context/AuthContext';

const API_URL = 'http://localhost:3001/api';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) {
    throw new Error(`API Error: ${r.status}`);
  }
  return r.json();
});

// SWR configuration to prevent unwanted re-renders and modal closing
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 60000,
  focusThrottleInterval: 300000,
};

export function useExpenses(month?: number) {
  const { user } = useAuth();
  const endpoint = month 
    ? `${API_URL}/expenses/${user?.id}/month/${month}`
    : `${API_URL}/expenses/${user?.id}`;

  const { data, error, isLoading, mutate } = useSWR(user ? endpoint : null, fetcher, swrConfig);

  return {
    expenses: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}

export function useSavingsGoals() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    user ? `${API_URL}/savings-goals/${user.id}` : null,
    fetcher,
    swrConfig
  );

  return {
    goals: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}

export function useCategories() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    user ? `${API_URL}/categories/${user.id}` : null,
    fetcher,
    swrConfig
  );

  return {
    categories: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}

export function useMonthlyAnalytics(month: number) {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    user ? `${API_URL}/analytics/${user.id}/monthly/${month}` : null,
    fetcher,
    swrConfig
  );

  return {
    analytics: data || { categories: [], total: 0, month: '', year: 0 },
    loading: isLoading,
    error,
  };
}

export function useYearlyAnalytics() {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    user ? `${API_URL}/analytics/${user.id}/yearly` : null,
    fetcher,
    swrConfig
  );

  return {
    yearlyData: data || [],
    loading: isLoading,
    error,
  };
}

export function useMonthlyReport(month: number) {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    user ? `${API_URL}/reports/${user.id}/monthly/${month}` : null,
    fetcher,
    swrConfig
  );

  return {
    report: data || { month: '', year: 0, expenses: [], summary: [], total_spent: 0 },
    loading: isLoading,
    error,
  };
}
