-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  city TEXT NOT NULL,
  warehouse TEXT,
  address TEXT,
  payment_method TEXT NOT NULL,
  comment TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  total_savings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site analytics table for tracking visitors
CREATE TABLE public.site_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create online users table for real-time presence
CREATE TABLE public.online_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for orders - admins can view all, public can insert
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for site_analytics - admins can view all, anyone can insert
CREATE POLICY "Admins can view analytics" 
ON public.site_analytics 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert analytics" 
ON public.site_analytics 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for online_users - admins can view, anyone can manage their session
CREATE POLICY "Admins can view online users" 
ON public.online_users 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert online status" 
ON public.online_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their online status" 
ON public.online_users 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete their online status" 
ON public.online_users 
FOR DELETE 
USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own role" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'display_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'FLG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Enable realtime for online_users and orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;