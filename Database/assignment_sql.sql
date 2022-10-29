-- User Table

-- CREATE TABLE IF NOT EXISTS user(
-- username varchar(255) PRIMARY KEY,
-- password varchar(255) NOT NULL,
-- email varchar(255) NOT NULL,
-- is_active BOOLEAN NOT NULL,
-- group_list varchar(255)
-- );

-- INSERT INTO user(username, password, email, is_active, group_list) 
-- 			VALUE('ruhui', 'qqwweerr', 'rh@gmail.com', true, 'developer')

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
-- SELECT * FROM user;

-- UPDATE user SET group_list = "developer" WHERE username = "helentan";
-- SELECT * FROM user;

-- UPDATE user SET group_list = "admin" WHERE username = "admin";
-- SELECT * FROM user;

-- CREATE TABLE IF NOT EXISTS usergroup(
-- group_name varchar(255) PRIMARY KEY
-- );

-- INSERT INTO usergroup(group_name)
-- 			VALUE('developer')

-- application

-- CREATE TABLE IF NOT EXISTS application(
-- app_acronym varchar(255) PRIMARY KEY,
-- app_description varchar(255),
-- App_Rnumber int(255) NOT NULL,
-- app_startdate date NOT NULL,
-- app_enddate date NOT NULL,
-- app_permit_create varchar(255) NOT NULL,
-- app_permit_open varchar(255) NOT NULL,
-- app_permit_todolist varchar(255) NOT NULL,
-- app_permit_doing varchar(255) NOT NULL,
-- app_permit_done varchar(255) NOT NULL
-- );

-- plan

-- CREATE TABLE IF NOT EXISTS plan(
-- plan_mvp_name varchar(255) NOT NULL,
-- plan_startdate date NOT NULL,
-- plan_enddate date NOT NULL,
-- plan_app_acronym varchar(255) NOT NULL
-- );

-- CREATE UNIQUE INDEX plan_id ON plan(plan_mvp_name, plan_app_acronym);

-- task

-- CREATE TABLE IF NOT EXISTS task(
-- task_id varchar(255) PRIMARY KEY,
-- task_name varchar(255) NOT NULL,
-- task_description varchar(255),
-- task_notes varchar(255),
-- task_plan varchar(255),
-- task_app_acronym varchar(255) NOT NULL,
-- task_state varchar(255) NOT NULL,
-- task_creator varchar(255) NOT NULL,
-- task_owner varchar(255) NOT NULL,
-- task_createdate date NOT NULL
-- );