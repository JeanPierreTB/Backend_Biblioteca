import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Libro } from "./Libro.js";
import { Libro_Usuario } from "./Libro_Usuario.js";

export const Usuario=sequelize.define("Usuario",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    correo:{
        type:DataTypes.STRING
    },
    contra:{
        type:DataTypes.STRING
    },
    nombre:{
        type:DataTypes.STRING
    },
    apellido:{
        type:DataTypes.STRING
    },
    tipodocumento:{
        type:DataTypes.STRING
    },
    ndocumento:{
        type:DataTypes.STRING
    },
    rol:{
        type:DataTypes.INTEGER
    }

})

Usuario.belongsToMany(Libro,{
    through:Libro_Usuario
})

Libro.belongsToMany(Usuario,{
    through:Libro_Usuario
})