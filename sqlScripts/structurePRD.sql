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
    course_name VARCHAR(200) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    dni_entry_id BIGINT NOT NULL,
    validity INT NOT NULL,
    includes_certificate INT NOT NULL,
    associated_forms INT NOT NULL,
    enabled INT NOT NULL,
    PRIMARY KEY (id)
);

/*Create table associated_forms*/
CREATE TABLE psismart_psi_db.associated_forms (
    id INT NOT NULL AUTO_INCREMENT,
    id_forms INT NOT NULL,
    id_associated_form INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_forms) REFERENCES courses(id),
    FOREIGN KEY (id_associated_form) REFERENCES courses(id)
);

/*Create table documents_templates*/
CREATE TABLE psismart_psi_db.documents_templates (
    id INT NOT NULL AUTO_INCREMENT,
    id_courses INT NOT NULL,
    certificate_logo varchar(100),
    credential_logo varchar(100),
    signature1_image varchar(100) NOT NULL,
    signature2_image varchar(100),
    course_name varchar(100) NOT NULL,
    credential_forehead varchar(100) NOT NULL,
    credential_back varchar(100) NOT NULL,
    certificate_normatives varchar(1000),
    credential_normatives varchar(1000),    
    enabled INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_courses) REFERENCES courses(id)
);

/*Create table forms_data*/
CREATE TABLE psismart_psi_db.forms_data (
    id INT NOT NULL AUTO_INCREMENT,
    date TIMESTAMP NOT NULL,
    email VARCHAR(100) NOT NULL,
    grade DECIMAL(5,2) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    dni BIGINT NOT NULL,
    form_name VARCHAR(300) NOT NULL,
    course_code BIGINT NOT NULL,
    student_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table profile_images*/
CREATE TABLE psismart_psi_db.profile_images (
    id INT NOT NULL AUTO_INCREMENT,
    dni BIGINT NOT NULL,
    image VARCHAR(200) NOT NULL,
    id_courses INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_courses) REFERENCES courses(id)
);