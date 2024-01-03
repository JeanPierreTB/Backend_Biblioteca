import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Libro_Usuario=sequelize.define("Libro_Usuario",{
    fecha:{
        type:DataTypes.DATE
    }
})