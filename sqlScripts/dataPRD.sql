/*user_categories*/
INSERT INTO psismart_psi_db.user_categories (category_name) VALUES('Administrador general');
INSERT INTO psismart_psi_db.user_categories (category_name) VALUES('Administrador institución');

/*users*/
INSERT INTO psismart_psi_db.users (first_name,last_name,user_email,password,id_user_categories,company,enabled) VALUES('Juan','PSI','psi@gmail.com','$2a$10$.b3ued627Ub3QhoIlINYg.xVVMkAu17L5QQPwO7jKJqgjk9LqpEt.',1,'PSI Smart Services',1);

/*credentials_templates*/
INSERT INTO psismart_psi_db.credentials_templates (id_courses,title1,title2,logo1,logo2,logo3,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,enabled) VALUES(1,'HABILITACION DE MANEJO - FLOTA LIVIANA','CONDUCCIÓN DEFENSIVA','psiLogo.jpg','elVientoBlancoLogo.jpg','boletinOficial.jpg','1_signature1_image_alfredoBaduan.jpg','1_signature2_image_mauricioSardot copy.jpg','Alfredo Baduan','Instructor MD','Lic.Mauricio Sardot','MN-L002658/M.P-PA0574',1)

/*certificates_templates*/
INSERT INTO psismart_psi_db.certificates_templates (id_courses,logo1,logo2,logo3,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,theory_hours,practice_hours,course_name,text1,text2,enabled) VALUES(1,'psiLogo.jpg','elVientoBlancoLogo.jpg','boletinOficial.jpg','1_signature1_image_mauricioSardot.jpg','1_signature2_image_alfredoBaduan.jpg','LIC. SARDOT MAURICIO','DIRECTOR PSI SMART SERVICES S.A.','ALFREDO BADUAN','Instructor habilitado conducción defensiva',6,2,'CONDUCCION DEFENSIVA 4X4','Ley Nacional 19.587 (Dto. 351/73), Ley Nacional N° 24.449 (Dto. N° 779/95), Ley Nacional N° 26.365 (Dto. N°32/18).','en FUNDACION EL VIENTO BLANCO y PSI SMART SERVICES SA; Registro Nacional de Antecedentes en Educación y Capacitación Vial; Inscripción N° 650 - Disposición N° 380/12 - Disposición Nº 865/2021',1)
