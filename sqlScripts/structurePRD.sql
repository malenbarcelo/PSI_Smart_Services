/*Delete database if exists*/
DROP DATABASE IF EXISTS psismart_psi_db;

/*Create database*/
CREATE DATABASE psismart_psi_db;

/*Create table user_categories*/
CREATE TABLE psismart_psi_db.user_categories (
    id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

/*Create table users*/
CREATE TABLE psismart_psi_db.users (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    id_user_categories INT NOT NULL,
    company VARCHAR(50) NOT NULL,
    enabled INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user_categories) REFERENCES user_categories(id)
);

/*Create table courses*/
CREATE TABLE psismart_psi_db.courses (
    id INT NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(50) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    validity INT NOT NULL,
    enabled INT NOT NULL,
    PRIMARY KEY (id)
);

/*Create table certificate templates*/
CREATE TABLE psismart_psi_db.credentials_templates (
    id INT NOT NULL AUTO_INCREMENT,
    id_courses INT NOT NULL,
    title1 varchar(100) NOT NULL,
    title2 varchar(100) NOT NULL,
    logo1 varchar(100) NOT NULL,
    logo2 varchar(100) NOT NULL,
    logo3 varchar(100) NOT NULL,
    signature1_image varchar(100) NOT NULL,
    signature2_image varchar(100) NOT NULL,
    signature1_line1 varchar(100) NOT NULL,
    signature1_line2 varchar(100) NOT NULL,
    signature2_line1 varchar(100) NOT NULL,
    signature2_line2 varchar(100) NOT NULL,    
    enabled INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_courses) REFERENCES courses(id)
);

/*Create table certificate templates*/
CREATE TABLE psismart_psi_db.certificates_templates (
    id INT NOT NULL AUTO_INCREMENT,
    id_courses INT NOT NULL,
    logo1 varchar(100) NOT NULL,
    logo2 varchar(100) NOT NULL,
    logo3 varchar(100) NOT NULL,
    signature1_image varchar(100) NOT NULL,
    signature2_image varchar(100) NOT NULL,
    signature1_line1 varchar(100) NOT NULL,
    signature1_line2 varchar(100) NOT NULL,
    signature2_line1 varchar(100) NOT NULL,
    signature2_line2 varchar(100) NOT NULL,
    theory_hours INT NOT NULL,
    practice_hours INT NOT NULL,
    course_name varchar(100) NOT NULL,
    text1 varchar(1000) NOT NULL,
    text2 varchar(1000) NOT NULL,
    enabled INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_courses) REFERENCES courses(id)
);

/*Create table forms_data*/
CREATE TABLE psismart_psi_db.forms_data (
    id INT NOT NULL AUTO_INCREMENT,
    date TIMESTAMP NOT NULL,
    email VARCHAR(50) NOT NULL,
    grade DECIMAL(5,2) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    company VARCHAR(50) NOT NULL,
    dni BIGINT NOT NULL,
    form_name VARCHAR(50) NOT NULL,
    course_code BIGINT NOT NULL,
    student_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table profile_images*/
CREATE TABLE psismart_psi_db.profile_images (
    id INT NOT NULL AUTO_INCREMENT,
    dni BIGINT NOT NULL,
    image VARCHAR(200) NOT NULL,
    course VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
);