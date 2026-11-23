import type { OrderTicket } from "@/features/events/types/event.types";
import { supabase } from "@/lib/supabase";

interface TicketRow {
  id: string;
  order_id: string;
  qr_code: string;
  issued_at: string;
}

export const getTicketByOrderId = async (orderId: string): Promise<OrderTicket | null> => {
  const { data, error } = await supabase
    .from("tickets")
    .select("id, order_id, qr_code, issued_at")
    .eq("order_id", orderId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw error;

  const row = data as TicketRow;
  return {
    id: row.id,
    orderId: row.order_id,
    qrCode: row.qr_code,
    issuedAt: row.issued_at,
  };
};
