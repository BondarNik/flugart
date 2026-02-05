-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true);

-- Allow anyone to upload files to chat-files bucket
CREATE POLICY "Anyone can upload chat files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'chat-files');

-- Allow anyone to view chat files
CREATE POLICY "Anyone can view chat files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'chat-files');

-- Allow deletion of own files
CREATE POLICY "Anyone can delete chat files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'chat-files');