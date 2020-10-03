CREATE TABLE organizations (
    handle text PRIMARY KEY,
    key text NOT NULL,
    name text NOT NULL,
    logo_url text
);

CREATE TABLE examiners (
    username text PRIMARY KEY,
    email text,
    first_name text NOT NULL,
    last_name text,
    password text NOT NULL,
    org_handle text NOT NULL REFERENCES organizations(handle) ON UPDATE CASCADE ON DELETE SET NULL,
    photo_url text
);

CREATE TABLE exams (
    exam_id text PRIMARY KEY,
    exam_name text NOT NULL,
    exam_owner text NOT NULL REFERENCES examiners(username) ON UPDATE CASCADE ON DELETE SET NULL,
    exam_fee money DEFAULT 0.00,
    exam_pass_pct integer DEFAULT 70
);

CREATE TABLE questions (
    question_id text PRIMARY KEY,
    question_type text NOT NULL,
    question_text text NOT NULL,
    question_seq integer NOT NULL,
    valid_answer_id text NOT NULL,
    exam_id text REFERENCES exams(exam_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE choices (
    choice_id text PRIMARY KEY,
    choice_text text NOT NULL,
    question_id text REFERENCES public.questions(question_id) ON UPDATE CASCADE ON DELETE CASCADE
);



INSERT INTO organizations (handle, key, name, logo_url)
VALUES ('ORG1', 'org1', 'SOME STATE UNIVERSITY', 'https://placeimg.com/640/480/business');