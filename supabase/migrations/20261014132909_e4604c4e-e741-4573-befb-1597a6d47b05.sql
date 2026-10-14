DROP POLICY IF EXISTS "Allow users to delete their own media files" ON storage.objects;
CREATE POLICY "Allow users to delete their own media files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'media-files' AND owner_id = (select auth.uid()::text));