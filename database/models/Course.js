module.exports = (sequelize, DataTypes) => {

   const alias = "Courses"
   const cols = {
   id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
   },
   course_name:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   url:{
      type: DataTypes.STRING,
      allowNull: false,
   },
   dni_entry_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   validity:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   includes_certificate:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   associated_forms:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   pass_grade:{
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
   enabled:{
      type: DataTypes.INTEGER,
      allowNull: true,
   }
   }
   const config = {
   tableName : 'courses',
   timestamps : false
   }
   const Course = sequelize.define(alias, cols, config)

   
   return Course
}