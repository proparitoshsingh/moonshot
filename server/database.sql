CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(100) UNIQUE NOT NULL,
   email VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
   user_id INTEGER PRIMARY KEY,
   age_group VARCHAR(50),
   gender VARCHAR(10),
   start_date DATE,
   end_date DATE,
   category VARCHAR(100),
   FOREIGN KEY (user_id) REFERENCES users(id),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
