CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  login text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_login_unique_idx ON users ((lower(login)));

CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  viewed_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_updated_idx ON lesson_progress(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS card_progress (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  viewed_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS card_progress_user_updated_idx ON card_progress(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS reflection_answers (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  save_key text,
  lesson_slug text NOT NULL,
  module_slug text NOT NULL,
  unit_slug text NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('reflection', 'artifact')),
  title text,
  prompt text NOT NULL,
  context_title text NOT NULL,
  source_section text,
  module_title text NOT NULL,
  unit_title text NOT NULL,
  lesson_title text NOT NULL,
  answer_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS reflection_answers_user_updated_idx ON reflection_answers(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS reflection_answers_save_key_idx ON reflection_answers(save_key);
