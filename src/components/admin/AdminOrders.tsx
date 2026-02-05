import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Phone, Mail, MapPin, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  delivered: "bg-green-500/20 text-green-400 border-green-500/50",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Очікує",
  processing: "Обробляється",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Замовлення ({orders.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchOrders}
          className="text-cyan-400 hover:text-cyan-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Оновити
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-[#0a1628]/60 border-cyan-500/20">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Замовлень поки немає</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const items = order.items as Array<{ name: string; quantity: number; price: number }>;
            
            return (
              <Card key={order.id} className="bg-[#0a1628]/60 border-cyan-500/20">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-white text-base">
                        #{order.order_number}
                      </CardTitle>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(order.created_at), "d MMM yyyy, HH:mm", { locale: uk })}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value: OrderStatus) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className={`w-36 h-8 text-xs border ${statusColors[order.status]} bg-transparent`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1628] border-cyan-500/30">
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="text-slate-300">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-white font-medium">
                        {order.customer_first_name} {order.customer_last_name}
                      </p>
                      <p className="text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {order.customer_phone}
                      </p>
                      <p className="text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {order.customer_email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.city}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {order.delivery_method === "nova-poshta" || order.delivery_method === "warehouse"
                          ? order.warehouse ? `Відділення: ${order.warehouse}` : "Відділення не вказано"
                          : order.address ? `Адреса: ${order.address}` : "Адреса не вказана"}
                      </p>
                      <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                        {order.payment_method === "card" ? "Картка" : "Накладений платіж"}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t border-cyan-500/10 pt-3">
                    <p className="text-slate-400 text-xs mb-2">Товари:</p>
                    <div className="space-y-1">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-300">{item.name} × {item.quantity}</span>
                          <span className="text-cyan-400">
                            {item.price > 0 ? `${(item.price * item.quantity).toLocaleString()} ₴` : "За запитом"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-cyan-500/10">
                      <span className="text-white font-medium">Разом:</span>
                      <span className="text-cyan-400 font-bold">{order.total_price.toLocaleString()} ₴</span>
                    </div>
                  </div>

                  {order.comment && (
                    <p className="text-slate-400 text-xs italic bg-[#050d18]/50 p-2 rounded">
                      💬 {order.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
