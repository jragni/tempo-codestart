       CREATE TABLE Users (
         name VARCHAR(255),
         email VARCHAR(255) PRIMARY KEY,
         is_admin BOOLEAN DEFAULT FALSE,
         is_active BOOLEAN DEFAULT TRUE,
         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
       )