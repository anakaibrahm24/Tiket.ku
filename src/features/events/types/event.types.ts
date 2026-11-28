export type EventType = "football" | "concert";

export interface EventCategoryRecord {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  remaining: number;
}

export interface EventRecord {
  id: string;
  type: EventType;
  title: string;
  subtitle: string;
  eventDate: string;
  eventTime: string;
  timeZone: string;
  venue: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  categories: EventCategoryRecord[];
}

export interface OrderItemInput {
  categoryId: string;
  qty: number;
}

export interface BuyerInput {
  fullName: string;
  email: string;
  identityNumber: string;
  gender: "Laki-laki" | "Perempuan";
}

export interface OrderTicket {
  id: string;
  orderId: string;
  qrCode: string;
  issuedAt: string;
}
