module.exports = (sequelize, DataTypes) => {

   const alias = "Profile_images"
   const cols = {
   id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
   },
   dni:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   image:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   id_courses:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   }
   const config = {
   tableName : 'profile_images',
   timestamps : false
   }
   const Profile_image = sequelize.define(alias, cols, config)

   return Profile_image
}