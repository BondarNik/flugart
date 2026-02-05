import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, User, Clock, RefreshCw, Volume2, VolumeX, Paperclip, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface Conversation {
  id: string;
  visitor_session_id: string;
  visitor_name: string | null;
  status: string;
  created_at: string;
  last_message_at: string;
  unread_count?: number;
}

interface Message {
  id: string;
  sender_type: 'visitor' | 'admin';
  message: string;
  created_at: string;
  is_read: boolean;
}

// Notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio notification not supported');
  }
};

const AdminChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [chatTab, setChatTab] = useState<'active' | 'closed'>('active');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('admin_chat_sound');
    return saved !== 'false';
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversations = conversations.filter(c => c.status === 'open');
  const closedConversations = conversations.filter(c => c.status === 'closed');

  // Load conversations
  const loadConversations = async () => {
    setLoading(true);
    const { data: convs } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (convs) {
      const convsWithUnread = await Promise.all(
        convs.map(async (conv) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('sender_type', 'visitor')
            .eq('is_read', false);

          return { ...conv, unread_count: count || 0 };
        })
      );

      setConversations(convsWithUnread as Conversation[]);
    }
    setLoading(false);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('admin_chat_sound', String(newValue));
  };

  useEffect(() => {
    loadConversations();

    const convChannel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    const globalMsgChannel = supabase
      .channel('admin-all-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_type === 'visitor' && soundEnabled) {
            playNotificationSound();
          }
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
      supabase.removeChannel(globalMsgChannel);
    };
  }, [soundEnabled]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data as Message[]);

        await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .eq('conversation_id', selectedConversation)
          .eq('sender_type', 'visitor')
          .eq('is_read', false);
      }
    };

    loadMessages();

    const msgChannel = supabase
      .channel(`admin-chat-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);

          if (newMsg.sender_type === 'visitor') {
            supabase
              .from('chat_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, [selectedConversation]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || newMessage.trim();
    if (!text || !selectedConversation) return;

    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: selectedConversation,
      sender_type: 'admin',
      message: text,
      is_read: true,
    });

    if (!error) {
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation);

      if (!messageText) setNewMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin/${selectedConversation}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      const isImage = file.type.startsWith('image/');
      const messageText = isImage 
        ? `[IMAGE]${urlData.publicUrl}[/IMAGE]`
        : `[FILE:${file.name}]${urlData.publicUrl}[/FILE]`;

      await sendMessage(messageText);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeConversation = async (convId: string) => {
    await supabase
      .from('chat_conversations')
      .update({ status: 'closed' })
      .eq('id', convId);

    if (selectedConversation === convId) {
      setSelectedConversation(null);
      setMessages([]);
    }
    loadConversations();
  };

  const reopenConversation = async (convId: string) => {
    await supabase
      .from('chat_conversations')
      .update({ status: 'open' })
      .eq('id', convId);
    loadConversations();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    return `${diffDays} дн тому`;
  };

  const renderMessage = (msg: Message) => {
    const imageMatch = msg.message.match(/\[IMAGE\](.*?)\[\/IMAGE\]/);
    const fileMatch = msg.message.match(/\[FILE:(.*?)\](.*?)\[\/FILE\]/);

    if (imageMatch) {
      return (
        <img 
          src={imageMatch[1]} 
          alt="Uploaded" 
          className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90"
          onClick={() => window.open(imageMatch[1], '_blank')}
        />
      );
    }

    if (fileMatch) {
      return (
        <a 
          href={fileMatch[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-cyan-300 hover:underline"
        >
          <Paperclip className="h-4 w-4" />
          {fileMatch[1]}
        </a>
      );
    }

    return msg.message;
  };

  const totalUnread = activeConversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);

  const renderConversationItem = (conv: Conversation, showReopenButton: boolean = false) => (
    <button
      key={conv.id}
      onClick={() => setSelectedConversation(conv.id)}
      className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
        selectedConversation === conv.id ? 'bg-muted' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">
            {conv.visitor_name || `Відвідувач ${conv.visitor_session_id.slice(0, 8)}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(conv.unread_count || 0) > 0 && (
            <Badge variant="destructive" className="text-xs">
              {conv.unread_count}
            </Badge>
          )}
          {showReopenButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                reopenConversation(conv.id);
              }}
              title="Відкрити знову"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {formatTime(conv.last_message_at)}
      </div>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Чат з клієнтами
          {totalUnread > 0 && (
            <Badge variant="destructive" className="ml-2">
              {totalUnread} нових
            </Badge>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSound}
            title={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={loadConversations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <div className="border border-border rounded-lg overflow-hidden flex flex-col">
          <Tabs value={chatTab} onValueChange={(v) => setChatTab(v as 'active' | 'closed')} className="flex flex-col h-full">
            <div className="p-2 bg-muted/50 border-b border-border">
              <TabsList className="w-full">
                <TabsTrigger value="active" className="flex-1 text-xs">
                  Активні
                  {activeConversations.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                      {activeConversations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="closed" className="flex-1 text-xs">
                  Закриті
                  {closedConversations.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                      {closedConversations.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="active" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-[520px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Завантаження...
                  </div>
                ) : activeConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Немає активних чатів
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {activeConversations.map((conv) => renderConversationItem(conv, false))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="closed" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-[520px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Завантаження...
                  </div>
                ) : closedConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Немає закритих чатів
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {closedConversations.map((conv) => renderConversationItem(conv, true))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-muted/50 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    {conversations.find(c => c.id === selectedConversation)?.visitor_name || 
                      `Відвідувач ${conversations.find(c => c.id === selectedConversation)?.visitor_session_id.slice(0, 8)}`}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => closeConversation(selectedConversation)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Закрити чат
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                          msg.sender_type === 'admin'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {renderMessage(msg)}
                        <div
                          className={`text-[10px] mt-1 ${
                            msg.sender_type === 'admin'
                              ? 'text-white/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString('uk-UA', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="shrink-0"
                    title="Прикріпити файл"
                  >
                    {uploading ? (
                      <div className="h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введіть повідомлення..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!newMessage.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Виберіть розмову зі списку</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
