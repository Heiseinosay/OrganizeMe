CREATE DATABASE organizemeproduction;
USE organizemeproduction;

# CREATE TABLE USERS
CREATE TABLE users(
	UserID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Password VARCHAR(50)
);

ALTER TABLE users AUTO_INCREMENT = 1;

# CREATE TABLE courses
CREATE TABLE courses(
	SubjectID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    SubjectName VARCHAR(255),
    LastUpdated DATE,
    TaskCountOverAll INT,
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);

ALTER TABLE courses AUTO_INCREMENT = 1;

# CREATE TABLE task
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

# CREATE TABLE completed
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

# CREATE TABLE completed
CREATE TABlE notifications(
	NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    TaskID VARCHAR(50),
    TaskTitle VARCHAR(50),
    AlertType VARCHAR(50),
    DueDate Datetime
);
ALTER TABLE notifications AUTO_INCREMENT = 1;
