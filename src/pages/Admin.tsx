import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, Users, BarChart3, Activity, MessageCircle, FileText } from "lucide-react";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminOnlineUsers from "@/components/admin/AdminOnlineUsers";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminChat from "@/components/admin/AdminChat";
import AdminContactRequests from "@/components/admin/AdminContactRequests";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          navigate("/admin/login");
          return;
        }

        // Check admin role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (!roleData) {
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setIsAdmin(true);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050d18] via-[#0a1628] to-[#0d1d35] flex items-center justify-center">
        <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d18] via-[#0a1628] to-[#0d1d35]">
      <header className="border-b border-cyan-500/20 bg-[#0a1628]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Flugart Admin
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-300 hover:text-white hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-[#0a1628]/80 border border-cyan-500/20 p-1">
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
            >
              <Package className="w-4 h-4 mr-2" />
              Замовлення
            </TabsTrigger>
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Онлайн
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Аналітика
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Чат
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Заявки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="online">
            <AdminOnlineUsers />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="chat">
            <AdminChat />
          </TabsContent>

          <TabsContent value="requests">
            <AdminContactRequests />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
