CREATE DATABASE `tms_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `application` (
  `app_acronym` varchar(255) NOT NULL,
  `app_description` mediumtext,
  `app_rnumber` int NOT NULL,
  `app_startdate` date NOT NULL,
  `app_enddate` date NOT NULL,
  `app_permit_create` varchar(255) NOT NULL,
  `app_permit_open` varchar(255) NOT NULL,
  `app_permit_todolist` varchar(255) NOT NULL,
  `app_permit_doing` varchar(255) NOT NULL,
  `app_permit_done` varchar(255) NOT NULL,
  PRIMARY KEY (`app_acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `plan` (
  `plan_mvp_name` varchar(255) NOT NULL,
  `plan_startdate` date NOT NULL,
  `plan_enddate` date NOT NULL,
  `plan_app_acronym` varchar(255) NOT NULL,
  `plan_colorcode` varchar(255) NOT NULL,
  PRIMARY KEY (`plan_mvp_name`,`plan_app_acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `task` (
  `task_id` varchar(255) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `task_description` mediumtext,
  `task_notes` mediumtext,
  `task_plan` varchar(255) DEFAULT NULL,
  `task_app_acronym` varchar(255) NOT NULL,
  `task_state` varchar(255) NOT NULL,
  `task_creator` varchar(255) NOT NULL,
  `task_owner` varchar(255) NOT NULL,
  `task_createdate` date NOT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `group_list` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `usergroup` (
  `group_name` varchar(255) NOT NULL,
  PRIMARY KEY (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
