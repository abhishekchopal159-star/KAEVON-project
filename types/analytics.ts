export type AnalyticsPoint = { label: string; revenue: number; orders: number };
export type AnalyticsRank = { id: string; label: string; value: number; secondary: number };
export type CommerceAnalytics = {
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
  paymentReceived: number;
  cancelledOrders: number;
  returnedOrders: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  wishlistConversionRate: number;
  returnRate: number;
  cancellationRate: number;
  activeDiscounts: number;
  lowStockProducts: number;
  trend: AnalyticsPoint[];
  bestProducts: AnalyticsRank[];
  bestCategories: AnalyticsRank[];
  updatedAt: string;
};

export const EMPTY_COMMERCE_ANALYTICS: CommerceAnalytics = {
  revenue: 0, orders: 0, customers: 0, averageOrderValue: 0, paymentReceived: 0,
  cancelledOrders: 0, returnedOrders: 0, conversionRate: 0, cartAbandonmentRate: 0,
  wishlistConversionRate: 0, returnRate: 0, cancellationRate: 0, activeDiscounts: 0,
  lowStockProducts: 0, trend: [], bestProducts: [], bestCategories: [], updatedAt: "",
};
