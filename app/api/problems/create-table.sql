CREATE TABLE problems (
 description TEXT,
  starter_code TEXT,
  test_code TEXT,
  title VARCHAR(255) PRIMARY KEY,
  topic VARCHAR(100),
)

CREATE TABLE user_problem (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  problem_title VARCHAR(255),
  user_favorite BOOLEAN DEFAULT FALSE,
  is_solved BOOLEAN DEFAULT FALSE,
  last_attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_title) REFERENCES problems(title)
)