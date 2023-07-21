module.exports = (sequelize, DataTypes) => {

   const alias = "Credentials_templates"
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
   title1:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   title2:{
      type: DataTypes.STRING,
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
   enabled:{
      type: DataTypes.INTEGER,
      allowNull: true,
   }
   }
   const config = {
   tableName : 'credentials_templates',
   timestamps : false
   }
   const Credential_template = sequelize.define(alias, cols, config)

   
   return Credential_template
}