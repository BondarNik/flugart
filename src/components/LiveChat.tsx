import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  sender_type: 'visitor' | 'admin';
  message: string;
  created_at: string;
}

const LiveChat = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear chat on page load and create new session
  useEffect(() => {
    localStorage.removeItem('chat_conversation_id');
    const newSessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setConversationId(null);
    setMessages([]);
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          
          if (!isOpen && newMsg.sender_type === 'admin') {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        visitor_session_id: sessionId,
      })
      .select()
      .single();

    if (data && !error) {
      setConversationId(data.id);
      localStorage.setItem('chat_conversation_id', data.id);
      return data.id;
    }
    return null;
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || newMessage.trim();
    if (!text) return;

    let convId = conversationId;
    if (!convId) {
      convId = await startConversation();
      if (!convId) return;
    }

    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: convId,
      sender_type: 'visitor',
      message: text,
    });

    if (!error) {
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', convId);

      if (!messageText) setNewMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sessionId}/${Date.now()}.${fileExt}`;
      
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

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const renderMessage = (msg: Message) => {
    const imageMatch = msg.message.match(/\[IMAGE\](.*?)\[\/IMAGE\]/);
    const fileMatch = msg.message.match(/\[FILE:(.*?)\](.*?)\[\/FILE\]/);

    if (imageMatch) {
      return (
        <img 
          src={imageMatch[1]} 
          alt="Uploaded" 
          className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
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

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-4 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-background border border-border rounded-lg shadow-2xl shadow-cyan-500/10 transition-all duration-300 ${
            isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-sm">{t('liveChat')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              <ScrollArea className="h-[380px] p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>{t('chatWelcome')}</p>
                    <p className="text-xs mt-2">{t('chatStartMessage')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender_type === 'visitor'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {renderMessage(msg)}
                          <div
                            className={`text-[10px] mt-1 ${
                              msg.sender_type === 'visitor'
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
                )}
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
                    placeholder={t('typeMessage')}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage()}
                    disabled={!newMessage.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;
