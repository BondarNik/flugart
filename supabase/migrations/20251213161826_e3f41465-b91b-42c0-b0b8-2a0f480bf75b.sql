-- Create contact requests table
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit contact requests
CREATE POLICY "Anyone can create contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view contact requests
CREATE POLICY "Admins can view contact requests"
ON public.contact_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update contact requests
CREATE POLICY "Admins can update contact requests"
ON public.contact_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_requests;

-- Add trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();