import { useQuery } from '@tanstack/react-query'
import { DailyReport, ProductReport } from '@api/__generated__'
import { getDailyReport, getProductReport } from '@api/client/services/reports'

const zone = Intl.DateTimeFormat().resolvedOptions().timeZone

export const useDailyReport = (date: string) =>
  useQuery<DailyReport, Error>({
    queryKey: ['reports', 'daily', date, zone],
    queryFn: () => getDailyReport(date, zone),
    keepPreviousData: true,
    refetchInterval: 60000,
  })

export const useProductReport = (productId?: string) =>
  useQuery<ProductReport, Error>({
    queryKey: ['reports', 'products', productId],
    queryFn: () => getProductReport(productId!),
    enabled: !!productId,
  })
