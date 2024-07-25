CREATE TABLE problems (
 description TEXT,
  id int,
  starter_code TEXT,
  test_code TEXT,
  title VARCHAR(255) PRIMARY KEY,
  slug TEXT
  topic VARCHAR(100),
)

CREATE TABLE user_problem (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  problem_title VARCHAR(255),
  user_code TEXT,
  user_favorite BOOLEAN DEFAULT FALSE,
  is_solved BOOLEAN DEFAULT FALSE,
  last_attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users FOREIGN KEY (user_email) REFERENCES users(email),
  CONSTRAINT fk_problems FOREIGN KEY (problem_title) REFERENCES problems(title)
);