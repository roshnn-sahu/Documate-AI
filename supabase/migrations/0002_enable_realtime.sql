-- ============================================================================
-- Enable Realtime for chat_sessions so the sidebar updates instantly
-- when sessions are created, renamed, or deleted.
-- ============================================================================

-- Add chat_sessions to the default Realtime publication.
-- After running this, all INSERT, UPDATE, and DELETE operations on
-- chat_sessions will be broadcast to subscribed clients.
alter publication supabase_realtime add table public.chat_sessions;
