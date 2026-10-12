-- GoLive Academy schema. Idempotent: safe to run on every boot.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  email          text NOT NULL UNIQUE,
  password_hash  text NOT NULL,
  referral_code  text NOT NULL UNIQUE,
  referred_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  gate             int  NOT NULL,
  title            text NOT NULL,
  module           text NOT NULL,
  track            text NOT NULL CHECK (track IN ('Functional','Technical','Cloud')),
  description      text NOT NULL,
  overview         text NOT NULL,
  price            int  NOT NULL,
  duration_weeks   int  NOT NULL,
  level            text NOT NULL CHECK (level IN ('Beginner','Intermediate','Advanced')),
  lessons_count    int  NOT NULL,
  questions_count  int  NOT NULL,
  demand           int  NOT NULL CHECK (demand BETWEEN 1 AND 3),
  destination      text NOT NULL,
  instructor_name  text NOT NULL,
  instructor_bio   text NOT NULL,
  learn_points     text[] NOT NULL,
  published        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position     int  NOT NULL,
  title        text NOT NULL,
  description  text NOT NULL,
  minutes      int  NOT NULL,
  UNIQUE (course_id, position)
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position    int  NOT NULL,
  question    text NOT NULL,
  answer      text NOT NULL,
  difficulty  text NOT NULL CHECK (difficulty IN ('Easy','Medium','Hard'))
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  excerpt       text NOT NULL,
  category      text NOT NULL,
  author        text NOT NULL,
  read_minutes  int  NOT NULL,
  body          text[] NOT NULL,
  published_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id     uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  text NOT NULL,
  last_name   text,
  email       text NOT NULL,
  phone       text,
  subject     text,
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_course_idx ON lessons(course_id);
CREATE INDEX IF NOT EXISTS questions_course_idx ON interview_questions(course_id);
CREATE INDEX IF NOT EXISTS users_referred_by_idx ON users(referred_by);
