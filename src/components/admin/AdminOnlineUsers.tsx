import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type OnlineUser = Database["public"]["Tables"]["online_users"]["Row"];

const AdminOnlineUsers = () => {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnlineUsers();

    const channel = supabase
      .channel("online-users-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "online_users" },
        () => fetchOnlineUsers()
      )
      .subscribe();

    const interval = setInterval(fetchOnlineUsers, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchOnlineUsers = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("online_users")
      .select("*")
      .gte("last_seen_at", fiveMinutesAgo)
      .order("last_seen_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const getPageName = (path: string | null) => {
    if (!path) return "Невідома";
    const pages: Record<string, string> = {
      "/": "Головна",
      "/checkout": "Оформлення",
      "/configurator": "Конфігуратор",
      "/search": "Пошук",
    };
    if (path.startsWith("/product/")) return "Товар";
    return pages[path] || path;
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
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Користувачі онлайн</h2>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            {users.length} активних
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchOnlineUsers}
          className="text-cyan-400 hover:text-cyan-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Оновити
        </Button>
      </div>

      {users.length === 0 ? (
        <Card className="bg-[#0a1628]/60 border-cyan-500/20">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Немає активних користувачів</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((user) => (
            <Card key={user.id} className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white text-sm font-mono">
                        {user.session_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Globe className="w-3 h-3" />
                      {getPageName(user.page_path)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(user.last_seen_at), { 
                        addSuffix: true, 
                        locale: uk 
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOnlineUsers;
