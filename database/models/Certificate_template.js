module.exports = (sequelize, DataTypes) => {

   const alias = "Certificates_templates"
   const cols = {
   id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
   },
   id_courses:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   logo1:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   logo2:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   logo3:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature1_image:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature2_image:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature1_line1:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature1_line2:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature2_line1:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   signature2_line2:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   text1:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   text2:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   text3:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   enabled:{
      type: DataTypes.INTEGER,
      allowNull: true,
   }
   }
   const config = {
   tableName : 'certificates_templates',
   timestamps : false
   }
   const Certificate_template = sequelize.define(alias, cols, config)

   
   return Certificate_template
}