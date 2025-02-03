CREATE DATABASE organizeme;
-- ALWAYS START BY USING THIS organizeme DATABASE
USE organizeme;

CREATE TABLE users(
	UserID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Password VARCHAR(50)
);

ALTER TABLE users AUTO_INCREMENT = 101;

CREATE TABLE courses(
	SubjectID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    SubjectName VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);

ALTER TABLE courses AUTO_INCREMENT = 101;
ALTER TABLE courses 
ADD COLUMN 	LastUpdated DATE;

ALTER table courses
DROP COLUMN TaskCount;

CREATE TABLE task(
	TASKID VARCHAR(50) PRIMARY KEY,
    UserID INT,
    SubjectID INT,
    TaskTitle VARCHAR(50),
    DateCreated DATE,
    DueDate DATETIME,
    Description VARCHAR(255),
    Priority INT,
    Reminder INT,
    ReminderDate DATETIME,
    Status 	VARCHAR(50),
    isAlertedDue boolean,
    isAlertedReminder boolean,
    isAlertedStart boolean,
    FOREIGN KEY (UserID) REFERENCES users(UserID),
    FOREIGN KEY (SubjectID) REFERENCES courses(SubjectID)
);

-- DROP TABLE task;

CREATE TABLE completed(
	AccomplishID INT PRIMARY KEY auto_increment,
    UserID INT,
    SubjectID INT,
    TaskID VARCHAR(50),
    SubjectName Varchar(50),
    TaskTitle Varchar(50),
    Description Varchar(150),
    Created DATE,
    DueDate datetime,
    CompletionDate date,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (SubjectID) References courses(SubjectID)
);
ALTER TABLE completed AUTO_INCREMENT = 1;

DROP table completed;

INSERT INTO courses (UserID, SubjectName, LastUpdated) VALUES (1, 'Math', curdate());
INSERT INTO courses (UserID, SubjectName, LastUpdated) VALUES (1, 'Science', curdate());
INSERT INTO task (TaskID, UserID, SubjectID, TaskTitle, DateCreated, DueDate, Description, Priority, Reminder, Status) VALUES (101, 1, 2,  'My title', curdate(), '2025-01-25 13:30:00', 'My cool description', 1, 3, 'Not started');

DELETE FROM courses
WHERE SubjectID = 103;

-- TESTING
SELECT * FROM users;
SELECT * FROM courses;
SELECT * FROM task;
SELECT * FROM completed;
SELECT * 
FROM task 
WHERE UserID = 1 AND SubjectID = 1
ORDER BY Priority DESC, DueDate ASC;


SELECT * 
FROM courses
WHERE UserID = 1;

-- DELETE/CLEAR
DELETE FROM users WHERE UserID = "101";
TRUNCATE TABLE completed;

UPDATE courses SET TaskCountOverAll = 0 WHERE subjectID = 1 ;

-- INSERT test 
INSERT INTO completed (UserID, SubjectID, TaskID, SubjectName, TaskTitle, Description, Created, DueDate, CompletionDate)
SELECT t.UserID, t.SubjectID, t.TaskID, c.SubjectName, t.taskTitle, t.Description, t.DateCreated, t.DueDate, curdate()
FROM Task as t
INNER JOIN courses AS c
ON t.subjectID = c.subjectID
WHERE t.subjectID = 3 AND t.taskID = 16;

-- REMINDER
SELECT *
FROM task
WHERE reminderDate <= Now();

SELECT NOW();


CREATE TABlE notifications(
	NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    TaskID VARCHAR(50),
    TaskTitle VARCHAR(50),
    AlertType VARCHAR(50),
    DueDate Datetime
);

ALTER TABLE notifications AUTO_INCREMENT = 1;
-- DROP TABLE notifications;

-- DUE


-- DUE: INSERT TO NOTIFICATION    
INSERT INTO notifications (UserID, TaskID, TaskTitle, AlertType, DueDate)
SELECT UserID, TaskID, TaskTitle, "overdue", DueDate
FROM task
WHERE
	dueDate <= now() AND
	isAlertedDue= 0 AND
    UserID = 1;

SELECT * FROM task;
SELECT date_format(DueDate, '%b %d, %Y') AS Duedate
FROM notifications;
    
UPDATE task SET dateCreated = '2025-01-26' 
WHERE taskID = '1HiXVfACxen7A';

TRUNCATE TABLE notifications;

-- REMINDER
SELECT UserID, TaskID, TaskTitle, DueDate
FROM task
WHERE reminderDate <= now();

-- START
SELECT UserID, TaskID, TaskTitle, DueDate
FROM task
WHERE 
    DATE_ADD(DateCreated, INTERVAL 2 DAY) <= NOW() 
    AND status = 'Not Started'
    AND isAlertedStart = 0;
    

-- SUMMARY
SELECT * 
FROM task
WHERE DueDate <= now();


SELECT * FROM NOTIFICATIONs ORDER BY notificationID DESC











