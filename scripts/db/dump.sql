CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "name" VARCHAR(255),
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL
);

INSERT INTO "User" ("email", "name", "username", "password")
VALUES
  ('user1@example.com', 'User One', 'kien', '123'),
  ('user2@example.com', 'User Two', 'trung', '123');