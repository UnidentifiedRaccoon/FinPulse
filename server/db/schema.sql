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
  level_slug text NOT NULL,
  section_slug text NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('reflection', 'artifact')),
  title text,
  prompt text NOT NULL,
  context_title text NOT NULL,
  source_section text,
  level_title text NOT NULL,
  section_title text NOT NULL,
  lesson_title text NOT NULL,
  answer_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, card_id)
);

ALTER TABLE reflection_answers
  ADD COLUMN IF NOT EXISTS level_slug text,
  ADD COLUMN IF NOT EXISTS section_slug text,
  ADD COLUMN IF NOT EXISTS level_title text,
  ADD COLUMN IF NOT EXISTS section_title text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'reflection_answers'
      AND column_name = 'module_slug'
  ) THEN
    EXECUTE $migration$
      UPDATE reflection_answers
      SET level_slug = COALESCE(NULLIF(level_slug, ''), CASE WHEN module_slug = 't1-start' THEN 'level-1-start' ELSE module_slug END)
      WHERE level_slug IS NULL OR level_slug = ''
    $migration$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'reflection_answers'
      AND column_name = 'unit_slug'
  ) THEN
    EXECUTE $migration$
      UPDATE reflection_answers
      SET section_slug = COALESCE(NULLIF(section_slug, ''), unit_slug)
      WHERE section_slug IS NULL OR section_slug = ''
    $migration$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'reflection_answers'
      AND column_name = 'module_title'
  ) THEN
    EXECUTE $migration$
      UPDATE reflection_answers
      SET level_title = COALESCE(
        NULLIF(level_title, ''),
        CASE WHEN module_title = 'T1 Старт' THEN 'Уровень 1 · Старт' ELSE module_title END
      )
      WHERE level_title IS NULL OR level_title = ''
    $migration$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'reflection_answers'
      AND column_name = 'unit_title'
  ) THEN
    EXECUTE $migration$
      UPDATE reflection_answers
      SET section_title = COALESCE(
        NULLIF(section_title, ''),
        CASE
          WHEN unit_title = 'Юнит 1. Деньги и операции' THEN 'Раздел 1. Деньги и операции'
          WHEN unit_title = 'Юнит 2. Планирование и управление' THEN 'Раздел 2. Планирование и управление'
          ELSE unit_title
        END
      )
      WHERE section_title IS NULL OR section_title = ''
    $migration$;
  END IF;
END $$;

UPDATE reflection_answers
SET level_slug = 'level-1-start'
WHERE level_slug IS NULL OR level_slug = '' OR level_slug = 't1-start';

UPDATE reflection_answers
SET section_slug = 'money-and-operations'
WHERE section_slug IS NULL OR section_slug = '';

UPDATE reflection_answers
SET level_title = 'Уровень 1 · Старт'
WHERE level_title IS NULL OR level_title = '' OR level_title = 'T1 Старт';

UPDATE reflection_answers
SET section_title = CASE
  WHEN section_title IS NULL OR section_title = '' THEN 'Раздел 1. Деньги и операции'
  WHEN section_title = 'Юнит 1. Деньги и операции' THEN 'Раздел 1. Деньги и операции'
  WHEN section_title = 'Юнит 2. Планирование и управление' THEN 'Раздел 2. Планирование и управление'
  ELSE section_title
END;

ALTER TABLE reflection_answers
  ALTER COLUMN level_slug SET NOT NULL,
  ALTER COLUMN section_slug SET NOT NULL,
  ALTER COLUMN level_title SET NOT NULL,
  ALTER COLUMN section_title SET NOT NULL,
  DROP COLUMN IF EXISTS module_slug,
  DROP COLUMN IF EXISTS unit_slug,
  DROP COLUMN IF EXISTS module_title,
  DROP COLUMN IF EXISTS unit_title;

CREATE INDEX IF NOT EXISTS reflection_answers_user_updated_idx ON reflection_answers(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS reflection_answers_save_key_idx ON reflection_answers(save_key);
