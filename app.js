import express from "express"
import { sequelize } from "./database/database.js";
const app = express();
const puerto = 3001;
import cors from "cors";
import { Libro } from "./models/Libro.js";
import { Usuario } from "./models/Usuario.js";
import { Libro_Usuario } from "./models/Libro_Usuario.js";
import { where } from "sequelize";




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

app.post('/datos-usuario',async(req,res)=>{
    try{
        const usuario=await Usuario.findOne({
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        })

        if(!usuario)
            return res.status(404).json({success:false,message:"Usuario no encontrado"})

        return res.status(200).json({success:true,message:"Usuario encontrado",user:usuario})
        
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})


app.put('/actualizar-datos-1',async(req,res)=>{
    try{
        const usuario=await Usuario.update({
            nombre:req.body.nombre,
            tipodocumento:req.body.tipodocumento,
            apellido:req.body.apellido,
            ndocumento:req.body.ndocumento, 
            
        },
        {
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        } )

        res.status(200).json({success:true,message:"Usuario actualizado",user:usuario})


    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})


app.put('/actualizar-datos-2',async(req,res)=>{
    try{
        const usuario=await Usuario.update({
            correo:req.body.correo,
            contra:req.body.contra
        },{
            where:{
                ndocumento:req.body.ndocumento
            }
        })

        res.status(200).json({success:true,message:"Usuario actualizado",user:usuario})
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})

app.post("/insertar-libro",async(req,res)=>{
    try{
        const libro=Libro.create({
            ISBN:req.body.ISBN,
            autor:req.body.autor,
            editor:req.body.editor,
            titulo:req.body.titulo,
            foto:req.body.foto,
            foto2:req.body.foto2,
            stock:req.body.stock,
            des:req.body.des
        })

        res.status(200).json({success:true,message:"Libro insertado",libro:libro})
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})

app.get("/obtener-libros",async(req,res)=>{
    try{
        const libro=await Libro.findAll({})

        res.status(200).json({success:true,message:"Libros obtenidos",libro:libro})
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})

app.post("/buscar-libro",async(req,res)=>{
    try{
        const libro=await Libro.findOne({
            where:{
                ISBN:req.body.ISBN
            }
        })
        if(!libro)
            return res.status(404).json({success:false,message:"Libro no encontrado"})

        return res.status(200).json({success:true,message:"Libro encontrado",libro:libro})

    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})


app.post("/resevar-libro",async(req,res)=>{
    try{
        const libro=await Libro.findOne({
            where:{
                ISBN:req.body.ISBN
            }

        })
        if(!libro) 
            return res.status(404).send({success:false,message:"Libro no encontrado"})

        
        const usuario=await Usuario.findOne({
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        })

        if(!usuario)
            return res.status(404).send({success:false,message:"Usuario no encontrado"})



        const usuariolibro=await Libro_Usuario.create({
            UsuarioId:usuario.id,
            LibroId:libro.id,
            fecha:req.body.fecha
        })

        

        const libroactualizar=await Libro.update({
            stock:libro.stock-1
        },{
            where:{
                ISBN:req.body.ISBN
            }
        }
        
        )

        return res.status(201).send({success:true,message:"Libro reservado",UsuarioLibro:usuariolibro,libro:libro.stock})

        
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
