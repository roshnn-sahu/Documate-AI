-- ============================================================================
-- Migration 0003: Cascade delete documents and embeddings when session is deleted
-- ============================================================================

-- 1. Drop the existing foreign key constraint on documents.session_id
ALTER TABLE public.documents 
  DROP CONSTRAINT IF EXISTS documents_session_id_fkey;

-- 2. Re-add with ON DELETE CASCADE
ALTER TABLE public.documents
  ADD CONSTRAINT documents_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES public.chat_sessions(id) 
  ON DELETE CASCADE;

-- 3. Create function to delete document_chunks when a session is deleted
CREATE OR REPLACE FUNCTION public.delete_session_chunks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all document_chunks that belong to this session via metadata
  DELETE FROM public.document_chunks
  WHERE (metadata->>'session_id')::uuid = OLD.id;
  
  RETURN OLD;
END;
$$;

-- 4. Create trigger to run before chat_sessions are deleted
DROP TRIGGER IF EXISTS on_session_deleted ON public.chat_sessions;
CREATE TRIGGER on_session_deleted
  BEFORE DELETE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_session_chunks();
