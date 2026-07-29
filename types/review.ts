export type VerifiedProductReview = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: "pending" | "published" | "rejected";
  createdAt: string;
};

export type ProductQuestion = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer: string;
  answeredBy: string;
  status: "pending" | "published" | "rejected";
  createdAt: string;
  answeredAt: string;
};

