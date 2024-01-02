import express from "express"
import { sequelize } from "./database/database.js";
const app = express();
const puerto = 3001;
import cors from "cors";
import { Libro } from "./models/Libro.js";
import { Usuario } from "./models/Usuario.js";
import { Libro_Usuario } from "./models/Libro_Usuario.js";




app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});


app.post('/insertar-usuario',async(req,res)=>{
    try{
        const usuario=await Usuario.create({
            correo:req.body.correo,
            contra:req.body.contra,
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            tipodocumento:req.body.tipo,
            ndocumento:req.body.nro,     
            rol:req.body.rol
        })

        res.status(200).json({ success: true, message: 'Usuario creado correctamente', user:usuario });


    }catch(e){
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
})

app.post('/verificar-usuario',async(req,res)=>{
    try{
        const usuario=await Usuario.findOne({
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        })

        if(!usuario)
            return res.status(404).json({success:false,message:"Usuario no encontrado"})

        return res.status(200).json({success:true,message:"Usuario verificado",user:usuario})
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})

const verificarconexion= async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Conexion a base de datos exitosa");
    }catch(e){
        console.error("No se logro conectar",e);
    }
}

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
  verificarconexion();
});
