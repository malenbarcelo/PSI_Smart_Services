/*user_categories*/
INSERT INTO psi_db.user_categories (category_name) VALUES('Administrador general');
INSERT INTO psi_db.user_categories (category_name) VALUES('Administrador institución');

/*users*/
INSERT INTO psi_db.users (first_name,last_name,user_email,password,id_user_categories,company,enabled) VALUES('Juan','PSI','psi@gmail.com','$2a$10$.b3ued627Ub3QhoIlINYg.xVVMkAu17L5QQPwO7jKJqgjk9LqpEt.',1,'PSI Smart Services',1);

/*credentials_templates*/
INSERT INTO psi_db.credentials_templates (id_courses,validity,title1,title2,logo1,logo2,logo3,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,enabled) VALUES(4,24,'HABILITACION DE MANEJO - FLOTA LIVIANA','CONDUCCIÓN DEFENSIVA','psiLogo.jpg','elVientoBlancoLogo.jpg','boletinOficial.jpg','1_signature1_image_alfredoBaduan.jpg','1_signature2_image_mauricioSardot copy.jpg','Alfredo Baduan','Instructor MD','Lic.Mauricio Sardot','MN-L002658/M.P-PA0574',1)

/*certificates_templates*/
INSERT INTO psi_db.certificates_templates (id_courses,logo1,logo2,logo3,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,text1,text2,text3,enabled) VALUES(1,'psiLogo.jpg','elVientoBlancoLogo.jpg','boletinOficial.jpg','1_signature1_image_alfredoBaduan.jpg','1_signature2_image_mauricioSardot copy.jpg','Alfredo Baduan','Instructor MD','Lic.Mauricio Sardot','MN-L002658/M.P-PA0574','Aprobó el curso teórico (6hs) / práctico (2hs) CONDUCCION DEFENSIVA 4X4','','',1)

