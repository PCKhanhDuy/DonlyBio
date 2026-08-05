-- ─── 1. Notifications ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        text NOT NULL, -- 'contact_message' | 'email_subscribe' | 'milestone'
  title       text NOT NULL,
  body        text,
  is_read     boolean DEFAULT false NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
-- Allow public inserts so DB triggers can write (triggers run as definer)
CREATE POLICY "system insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Trigger: new contact message → notification
CREATE OR REPLACE FUNCTION fn_notify_contact_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (NEW.user_id, 'contact_message',
          'Tin nhắn mới từ ' || NEW.sender_name,
          substring(NEW.message, 1, 120));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_contact_message ON contact_messages;
CREATE TRIGGER trg_notify_contact_message
  AFTER INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION fn_notify_contact_message();

-- Trigger: new email subscriber → notification
CREATE OR REPLACE FUNCTION fn_notify_email_subscribe()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body)
  VALUES (NEW.user_id, 'email_subscribe',
          'Người đăng ký mới',
          NEW.email || ' vừa đăng ký nhận tin từ trang bio của bạn.');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_email_subscribe ON email_subscribers;
CREATE TRIGGER trg_notify_email_subscribe
  AFTER INSERT ON email_subscribers
  FOR EACH ROW EXECUTE FUNCTION fn_notify_email_subscribe();

-- Trigger: every 100 page views → milestone notification
CREATE OR REPLACE FUNCTION fn_notify_milestone()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_count bigint;
BEGIN
  SELECT COUNT(*) INTO v_count FROM page_views WHERE user_id = NEW.user_id;
  IF v_count % 100 = 0 AND v_count > 0 THEN
    INSERT INTO notifications (user_id, type, title, body)
    VALUES (NEW.user_id, 'milestone',
            v_count::text || ' lượt xem!',
            'Trang bio của bạn vừa đạt mốc ' || v_count::text || ' lượt xem. Tuyệt vời!');
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_milestone ON page_views;
CREATE TRIGGER trg_notify_milestone
  AFTER INSERT ON page_views
  FOR EACH ROW EXECUTE FUNCTION fn_notify_milestone();

-- ─── 2. Poll votes ────────────────────────────────────────────────────────────
-- Poll options stored as CSV in bio_links.url, link_id used as poll identifier
CREATE TABLE IF NOT EXISTS poll_votes (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id           uuid REFERENCES bio_links(id) ON DELETE CASCADE NOT NULL,
  option_index      int NOT NULL,
  voter_fingerprint text NOT NULL,
  created_at        timestamptz DEFAULT now() NOT NULL,
  UNIQUE(link_id, voter_fingerprint)
);
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read poll votes"   ON poll_votes FOR SELECT USING (true);
CREATE POLICY "public insert poll votes" ON poll_votes FOR INSERT WITH CHECK (true);

-- ─── 3. Bio pages (multi-page) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bio_pages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      text NOT NULL DEFAULT 'Trang chính',
  slug       text NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, slug)
);
ALTER TABLE bio_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages public read"  ON bio_pages FOR SELECT USING (true);
CREATE POLICY "pages owner manage" ON bio_pages FOR ALL USING (auth.uid() = user_id);

-- Add page_id to bio_links (NULL = belongs to default / main profile)
ALTER TABLE bio_links ADD COLUMN IF NOT EXISTS page_id uuid REFERENCES bio_pages(id) ON DELETE CASCADE;
