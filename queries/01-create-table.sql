-- Active: 1673868683071@@127.0.0.1@5432@kelp
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(401) NOT NULL,
    age SMALLINT NOT NULL,
    address JSONB,
    additional_info JSONB
)