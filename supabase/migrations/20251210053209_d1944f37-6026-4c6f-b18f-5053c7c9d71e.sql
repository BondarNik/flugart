-- Create chat conversations table
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_session_id TEXT NOT NULL,
    visitor_name TEXT,
    visitor_email TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'admin')),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_conversations
CREATE POLICY "Anyone can create conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their own conversations"
ON public.chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update their own conversations"
ON public.chat_conversations
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all conversations"
ON public.chat_conversations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all conversations"
ON public.chat_conversations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for chat_messages
CREATE POLICY "Anyone can create messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
ON public.chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Admins can update messages"
ON public.chat_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create trigger for updating conversation timestamp
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX idx_chat_messages_is_read ON public.chat_messages(is_read);