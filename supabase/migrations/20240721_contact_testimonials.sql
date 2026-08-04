-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name text       NOT NULL,
  sender_email text,
  message    text        NOT NULL,
  is_read    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send contact message"
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can read own messages"
  ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own messages"
  ON public.contact_messages FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner can update own messages"
  ON public.contact_messages FOR UPDATE USING (auth.uid() = user_id);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name text        NOT NULL,
  author_role text,
  content     text        NOT NULL,
  rating      smallint    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active testimonials"
  ON public.testimonials FOR SELECT USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Owner can manage testimonials"
  ON public.testimonials FOR ALL USING (auth.uid() = user_id);
