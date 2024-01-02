import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Libro=sequelize.define("Libro",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    ISBN:{
        type:DataTypes.STRING
    },
    autor:{
        type:DataTypes.STRING
    },
    editor:{
        type:DataTypes.STRING
    },
    empresanombre:{
        type:DataTypes.STRING
    }
})