-- CREATE TABLE IF NOT EXISTS user(
-- username varchar(255) PRIMARY KEY,
-- password varchar(255) NOT NULL,
-- email varchar(255) NOT NULL,
-- is_active BOOLEAN NOT NULL,
-- group_list varchar(255)
-- );

-- CREATE TABLE IF NOT EXISTS usergroup(
-- group_name varchar(255) PRIMARY KEY
-- );

-- INSERT INTO user(username, password, email, is_active, group_list) 
-- 			VALUE('ruhui', 'qqwweerr', 'rh@gmail.com', true, 'developer')

-- INSERT INTO usergroup(group_name)
-- 			VALUE('developer')

-- Login user
-- SELECT * FROM user WHERE username = "admin" AND password = "qqwweerr";

-- delete statement
-- DELETE FROM user WHERE username = "test";
-- SELECT * FROM user;

-- Update statement
-- UPDATE user
-- SET username = "RuHui"
-- WHERE username = "Ru Hui"

-- INSERT INTO user(username, password, email, is_active, group_list) 
-- 			VALUE('ruhui', 'qqwweerr', 'rh@gmail.com', true, 'developer')

-- SELECT * FROM user;

-- DELETE FROM user WHERE username = "test1";
SELECT * FROM user;

-- UPDATE user SET is_active = false, email = "jc123@hotmail.com" WHERE username = "JiaCheng"