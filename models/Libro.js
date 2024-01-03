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
    titulo:{
        type:DataTypes.STRING
    },
    foto:{
        type:DataTypes.STRING
    },
    foto2:{
        type:DataTypes.STRING
    },
    stock:{
        type:DataTypes.INTEGER
    },
    des:{
        type:DataTypes.TEXT
    }
})