import { requireUserId } from "@/features/auth/service/authService";
import type { BuyerInput, OrderItemInput } from "@/features/events/types/event.types";
import { supabase } from "@/lib/supabase";

interface CreateOrderInput {
  eventId: string;
  items: OrderItemInput[];
  buyer: BuyerInput;
}

interface CompletePaymentInput {
  orderId: string;
  method: "card" | "bank";
}

interface CreateOrderResult {
  order_id: string;
  total_amount: number;
}

export const createOrder = async ({
  eventId,
  items,
  buyer,
}: CreateOrderInput): Promise<{ orderId: string; totalAmount: number }> => {
  await requireUserId();

  const { data, error } = await supabase.rpc("create_order", {
    p_event_id: eventId,
    p_items: items.map(({ categoryId, qty }) => ({ categoryId, qty })),
    p_buyer_name: buyer.fullName,
    p_buyer_email: buyer.email,
    p_identity_number: buyer.identityNumber,
    p_gender: buyer.gender,
  });

  if (error) throw error;
  const [result] = (data ?? []) as CreateOrderResult[];
  if (!result) throw new Error("Pesanan gagal dibuat.");
  return { orderId: result.order_id, totalAmount: result.total_amount };
};

export const completePayment = async ({
  orderId,
  method,
}: CompletePaymentInput): Promise<{ ticketId: string }> => {
  const { data, error } = await supabase.rpc("complete_payment", {
    p_order_id: orderId,
    p_payment_method: method,
  });

  if (error) throw error;
  return { ticketId: data as string };
};
