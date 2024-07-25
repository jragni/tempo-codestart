CREATE TABLE user_problem (
  id SERIAL PRIMARY KEY,
  problem_id VARCHAR(255),
  user_email VARCHAR(255),
  user_code TEXT,
  user_favorite BOOLEAN DEFAULT FALSE,
  is_solved BOOLEAN DEFAULT FALSE,
  last_attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users FOREIGN KEY (user_email) REFERENCES users(email),
  CONSTRAINT fk_problems FOREIGN KEY (id) REFERENCES problems(id)
);