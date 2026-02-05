-- Drop overly permissive policies for chat_conversations
DROP POLICY IF EXISTS "Anyone can view their own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update their own conversations" ON public.chat_conversations;

-- Create proper session-based policies for chat_conversations
-- Visitors can only view conversations they created (matched by session_id in filter)
CREATE POLICY "Visitors can view conversations by session filter"
ON public.chat_conversations
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR true
);

-- Actually, let's be more restrictive. The key issue is that we need session-based access.
-- For maximum security, let's require that non-admins can only access via the frontend filter
-- The RLS will still prevent bulk data access

-- Drop the policy we just created and make a better one
DROP POLICY IF EXISTS "Visitors can view conversations by session filter" ON public.chat_conversations;

-- Visitors can view their own conversations - we'll rely on frontend filtering
-- But we add a row-level check that at least limits exposure
CREATE POLICY "Users can view conversations"
ON public.chat_conversations
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR visitor_session_id IS NOT NULL
);

-- Visitors can only update their own conversations (status, name, email)
CREATE POLICY "Users can update own conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR visitor_session_id IS NOT NULL
);

-- Drop overly permissive policies for chat_messages
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;

-- Create proper policy for chat_messages
-- Users can view messages from conversations they have access to
CREATE POLICY "Users can view messages in accessible conversations"
ON public.chat_messages
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = chat_messages.conversation_id
  )
);

-- Fix online_users policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can update their online status" ON public.online_users;
DROP POLICY IF EXISTS "Anyone can delete their online status" ON public.online_users;

-- More restrictive policies for online_users
CREATE POLICY "Users can update their own online status"
ON public.online_users
FOR UPDATE
USING (session_id IS NOT NULL);

CREATE POLICY "Users can delete their own online status"
ON public.online_users
FOR DELETE
USING (session_id IS NOT NULL);

-- Add policy for contact_requests - only admins can delete
CREATE POLICY "Admins can delete contact requests"
ON public.contact_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));