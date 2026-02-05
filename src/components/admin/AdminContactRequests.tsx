import { useState, useEffect } from 'react';
import { Mail, Phone, User, Clock, RefreshCw, Check, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();

    const channel = supabase
      .channel('contact-requests-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_requests' },
        () => loadRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    await supabase
      .from('contact_requests')
      .update({ status: 'read' })
      .eq('id', id);
    loadRequests();
  };

  const markAsAnswered = async (id: string) => {
    await supabase
      .from('contact_requests')
      .update({ status: 'answered' })
      .eq('id', id);
    loadRequests();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive" className="text-xs">Нова</Badge>;
      case 'read':
        return <Badge variant="secondary" className="text-xs">Прочитано</Badge>;
      case 'answered':
        return <Badge className="text-xs bg-green-500">Відповіли</Badge>;
      default:
        return null;
    }
  };

  const newCount = requests.filter(r => r.status === 'new').length;

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
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Заявки з форми контактів
          {newCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {newCount} нових
            </Badge>
          )}
        </h2>
        <Button variant="outline" size="sm" onClick={loadRequests}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Оновити
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-[#0a1628]/60 border-cyan-500/20">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Заявок поки немає</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="bg-[#0a1628]/60 border-cyan-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      <CardTitle className="text-white text-base">{request.name}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {formatTime(request.created_at)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={`mailto:${request.email}`} 
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                    >
                      <Mail className="h-3 w-3" />
                      {request.email}
                    </a>
                    <a 
                      href={`tel:${request.phone}`} 
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                    >
                      <Phone className="h-3 w-3" />
                      {request.phone}
                    </a>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-300 whitespace-pre-wrap">{request.message}</p>
                  </div>

                  <div className="flex gap-2">
                    {request.status === 'new' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => markAsRead(request.id)}
                        className="text-xs"
                      >
                        Позначити як прочитане
                      </Button>
                    )}
                    {request.status !== 'answered' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => markAsAnswered(request.id)}
                        className="text-xs text-green-400 border-green-500/30 hover:bg-green-500/10"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Відповіли
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default AdminContactRequests;
