import client from "@api/client/client"
import { DailyReport, ProductReport } from "@api/__generated__"

export const getDailyReport = (date: string, zone: string): Promise<DailyReport> =>
    client
        .get<DailyReport>("reports/daily", { params: { date, zone } })
        .then((response) => response.data);

export const getProductReport = (productId: string): Promise<ProductReport> =>
    client.get<ProductReport>(`reports/products/${productId}`).then((response) => response.data);
