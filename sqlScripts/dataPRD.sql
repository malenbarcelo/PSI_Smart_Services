/*user_categories*/
INSERT INTO psismart_psi_db.user_categories (category_name) VALUES('Administrador general');
INSERT INTO psismart_psi_db.user_categories (category_name) VALUES('Administrador institución');

/*users*/
INSERT INTO psismart_psi_db.users (first_name,last_name,user_email,password,id_user_categories,company,enabled) VALUES('Juan','PSI','psi@gmail.com','$2a$10$.b3ued627Ub3QhoIlINYg.xVVMkAu17L5QQPwO7jKJqgjk9LqpEt.',1,'PSI Smart Services',1);

/*courses*/
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Uso Equipo Autonomo','https://docs.google.com/forms/d/e/1FAIpQLSeQzjZOuGH7xo3egYlT_A0e0BbEF8oH1BW2IB1H-keNh1ZQ6g/viewform',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Uso Detector 4-5 Gases','https://docs.google.com/forms/d/e/1FAIpQLSee_1n1U8aWbK6_Us_JCUShSIeelBo0Xmy-SfTeSoDw49nfog/viewform?usp=sf_link',12,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Trabajo en Altura','https://docs.google.com/forms/d/e/1FAIpQLSdlLvoSeikgKd3ZHOOR9dEG-LoC-MjwzplESZCPBvz2ZFx5Kg/viewform?usp=sf_link',12,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Seguridad en el Manejo (4x4)','https://docs.google.com/forms/d/e/1FAIpQLSf8WHgizVdXZ9AU8RyOj2eaOZQ_8USyTKDzb_d3KVj_mkrSwA/viewform?usp=sf_link',12,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Seguridad en el Manejo','https://docs.google.com/forms/d/e/1FAIpQLSe4fBm6vUbdV6V9v-zO5sT8G1HWTw3AG4ZyrA8D3_APCwXpzg/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Planificación y Percepción del Riesgo - Módulo 4','https://docs.google.com/forms/d/e/1FAIpQLScVghNwxk3ZS6FkDP5NUWj0V7-3Jx4r3fN-nCdZMkcG1805Dw/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Planificación y Percepción del Riesgo - Módulo 3','https://docs.google.com/forms/d/e/1FAIpQLSduKHn4Bq-nifjg4SZFhIiJsABswn6hVLbmNXhPc01deTGOsQ/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Planificación y Percepción del Riesgo - Módulo 2','https://docs.google.com/forms/d/e/1FAIpQLSdl35FkgjREIkD2Sz-IGdSDo3T9927nyUo0dnIlqr7KbORSDA/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Planificación y Percepción del Riesgo - Módulo 1','https://docs.google.com/forms/d/e/1FAIpQLSdl1NikAjwIULG9XQ6MTq6_JRar2aCKEXwmdNlYhoIImiM24w/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Evaluación Teórica Sulfhídrico','https://docs.google.com/forms/d/e/1FAIpQLSfegs_PVK8s6ppKZx58Dfg252fwmkbx_em-djzTqnJRSWPMAw/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Espacios Confinados','https://docs.google.com/forms/d/e/1FAIpQLScN_wIBFnpe4-q18h5H7Mk0kE1__4C1REH8APbsrl8F-VVUng/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Conciencia Situacional y Percepción del Riesgo - Módulo 3','https://docs.google.com/forms/d/e/1FAIpQLSeDlyNyaoEEoxZHqiUYH0ZX6HQuxqMCqyLItMa_H2BfP4xvKw/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Conciencia Situacional y Percepción del Riesgo - Módulo 2','https://docs.google.com/forms/d/e/1FAIpQLSft05Vv_KRXAhkkfg4bAJbC-3LkAhW1Qn2BzPotKozY8bOpQw/viewform?usp=sf_link',24,1);
INSERT INTO psi_db.courses (course_name,url,validity,enabled) VALUES('Conciencia Situacional y Percepción del Riesgo - Módulo 1','https://docs.google.com/forms/d/e/1FAIpQLSe6uCN8_ayBvDd-qYChbjPKyWnIbkObFjkWUN9aywXx3UnDSg/viewform?usp=sf_link',24,1);



/*credentials_templates*/
INSERT INTO psismart_psi_db.credentials_templates (id_courses,title1,title2,logo1,logo2,logo3,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,enabled) VALUES(5,'HABILITACION DE MANEJO - FLOTA LIVIANA','CONDUCCIÓN DEFENSIVA','5_logo1.jpg','5_logo2.jpg','5_logo3.jpg','5_signature1.jpg','5_signature2.jpg','Alfredo Baduan','Instructor MD','Lic.Mauricio Sardot','MN-L002658/M.P-PA0574',1)


/*certificates_templates*/
INSERT INTO psismart_psi_db.certificates_templates (id_courses,logo1,logo2,logo3,type_of_course,signature1_image,signature2_image,signature1_line1,signature1_line2,signature2_line1,signature2_line2,theory_hours,practice_hours,course_name,text1,text2,enabled) VALUES(5,'1_logo1.jpg','1_logo2.jpg','1_logo3.jpg','teórico-práctico','1_signature1.jpg','1_signature2.jpg','LIC. SARDOT MAURICIO','DIRECTOR PSI SMART SERVICES S.A.','ALFREDO BADUAN','Instructor habilitado conducción defensiva',6,2,'CONDUCCION DEFENSIVA','Ley Nacional 19.587 (Dto. 351/73), Ley Nacional N° 24.449 (Dto. N° 779/95), Ley Nacional N°
26.365 (Dto. N°32/18).','en FUNDACION EL VIENTO BLANCO y PSI SMART SERVICES SA; Registro
Nacional de Antecedentes en Educación y Capacitación Vial; Inscripción N° 650 - Disposición N°
380/12 - Disposición Nº 865/2021',1)

