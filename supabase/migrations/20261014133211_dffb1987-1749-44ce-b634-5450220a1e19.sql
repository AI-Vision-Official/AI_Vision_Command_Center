DROP POLICY IF EXISTS "Allow authenticated users to upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to media files" ON storage.objects;
CREATE POLICY "Authenticated users upload their own media files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media-files' AND owner_id = (select auth.uid()::text));
CREATE POLICY "Users list their own media files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'media-files' AND owner_id = (select auth.uid()::text));