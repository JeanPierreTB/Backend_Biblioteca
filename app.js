import express from "express"
import { sequelize } from "./database/database.js";
const app = express();
const puerto = 3001;
import cors from "cors";
import { Libro } from "./models/Libro.js";
import { Usuario } from "./models/Usuario.js";
import { Libro_Usuario } from "./models/Libro_Usuario.js";
import { Op } from "sequelize";




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

app.delete("/eliminar-libro",async(req,res)=>{
    try{
        const libro=await Libro.destroy({
            where:{
                ISBN:req.body.ISBN
            }
        })

        res.status(200).json({success:true,message:"Libro eliminado",libro:libro})

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


/*app.post('/obtener-reserva',async(req,res)=>{
    try{
        const user=await Usuario.findOne({
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        })

        if(!user)
            return res.status(404).send({success:false,message:"Usuario no encontrado"})

        
        const libro_usuario=await Libro_Usuario.findAll({
            where:{
                UsuarioId:user.id
            }
        })


        if(!libro_usuario)
            return res.status(404).send({success:false,message:"No hay libros reservados"})

        const libroid=libro_usuario.map(libro=>libro.LibroId)

        //console.log(libroid);

        const libro=await Libro.findAll({
            where:{
                id:libroid
            }
        })

        console.log(libro)
    
        return res.status(200).json({success:true,message:"Libros encontrados",libros_usuario:libro_usuario,libro:libro})
    }catch(e){
        res.status(500).json({success:false,message:"Error interno del servidor"})
    }
})*/

app.post('/obtener-reserva', async (req, res) => {
    try {
        const { correo, contra } = req.body;

        const user = await Usuario.findOne({
            where: { correo, contra },
            include: Libro  // Sequelize reconocerá automáticamente la relación a través de Libro_Usuario
        });

        console.log(user);

        if (!user) {
            return res.status(404).send({ success: false, message: "Usuario no encontrado" });
        }

        const librosUsuario = user.Libros;  // Accede a los libros directamente a través de la relación

        if (!librosUsuario.length) {
            return res.status(404).send({ success: false, message: "No hay libros reservados" });
        }

        console.log(librosUsuario);

        return res.status(200).json({ success: true, message: "Libros encontrados", librosUsuario });
    } catch (e) {
        console.error(e);  // Imprime el error en la consola
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});


app.post('/vence-pronto', async (req, res) => {
    try {
        const { correo, contra } = req.body;

        const user = await Usuario.findOne({
            where: { correo, contra },
            include: Libro
        });

        if (!user) {
            return res.status(404).send({ success: false, message: "Usuario no encontrado" });
        }

        const currentDate = new Date();
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const librosVencenPronto = user.Libros.filter(libro => {
            return libro.Libro_Usuario.fecha >= currentDate && libro.Libro_Usuario.fecha <= nextWeek;
        });

        console.log(librosVencenPronto);

        return res.status(200).json({ success: true, message: "Libros que vencen pronto", librosVencenPronto });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

app.post('/entregar-producto',async(req,res)=>{
    try{
        const usuario=await Usuario.findOne({
            where:{
                correo:req.body.correo,
                contra:req.body.contra
            }
        })

        if(!usuario)
            return res.status(404).send({success:false,message:"Usuario no encontrado"})

        const libro=await Libro.findOne({
            where:{
                titulo:req.body.titulo
            }
        })
        if(!libro)
            return res.status(404).send({success:false,message:"Libro no encontrado"})

        const libro_usuario=await Libro_Usuario.destroy({
            where:{
                LibroId:libro.id
            }
        })

        const libro2=await Libro.update({
            stock:libro.stock+1
        },{
            where:{
                titulo:libro.titulo
            }
        })

        return res.status(200).send({success:true,message:"Libro devuelto",libro:libro_usuario})


    }catch(e){
        res.status(500).json({ success: false, message: "Error interno del servidor" });
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
