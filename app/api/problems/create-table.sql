CREATE TABLE problems (
  description TEXT,
  id SERIAL PRIMARY KEY,
  solution TEXT,
  starter_code TEXT,
  test_code TEXT,
  title VARCHAR(255),
  slug TEXT,
  topic VARCHAR(100)
)
