export type SupportTicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";

export type SupportTicket = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  category: "order" | "delivery" | "return" | "refund" | "product" | "account" | "other";
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: "normal" | "high";
  adminReply: string;
  createdAt: string;
  updatedAt: string;
};
