-- CREATE DATABASE usersfitness_track_recommendation;
use fitness_track_recommendation;
-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(50) NOT NULL,
--     email VARCHAR(100) NOT NULL,
--     password VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- drop table users; 
-- select * from users;
-- INSERT INTO users (username, email, password)
-- VALUES ("Tamal", "t@example.com", "123")

CREATE TABLE user_table (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL unique,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender CHAR(10) NOT NULL,
    age INT Not null,
    height DECIMAL(5, 2) Not null,
    weight DECIMAL(5, 2) Not null,
    state VARCHAR(255) Not null,
    task_choice VARCHAR(255),
    goal_points INT,
    current_points INT,
	course INT
);
drop table user_table;
INSERT INTO user_table ( email, password, name, gender, age, height, weight, state, task_choice, goal_points, course, current_points, last_task_done, consistency, average_points, average_calories, other)
VALUES
( 't@m.com', '123', 'Tamal Mallick', 'M', 20, 5.5, 60, 'mid', '1|2|3', 40, 1, 20, '100%', NULL, 75, NULL, NULL),
( 's@m.com', '123', 'Subham', 'M', 29, 5.7, 60, 'Naïve', '1|2', 30, 2, 2, '50%', NULL, 50, NULL, NULL),
('s@d.com', '123', 'Susanta', 'Sigma M', 20, 5.4, 50, 'Advanced', '2|3', 50, 3, 36, '75%', NULL, 100, NULL, NULL);

select * from user_table;
