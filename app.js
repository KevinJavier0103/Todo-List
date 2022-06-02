//jshint esversion:6


const express=require("express");
const bodyParser=require("body-parser");
// seccion implementada para llamar una funcion generada en otro archivo por el ususario 
const date= require(__dirname+"/date.js");
// Se llama previamente la variable para seguir el orden de programacion
let items=["buy food","prepare food","eat food"];
let workItems=[];
const app=express();
// Implementado para llamar a ejs
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
// Es necesario para llamar a archivos estaticos de esta manera poder generar el uso del documento
// En caso que se sea un documento css u otro es necesario que la direccion en HTML sea la correcta 
// entre comillas se coloca el nombre de la carpeta
app.use(express.static("public"))

app.get("/",(req,res)=>{
    let day=date.getDate();
    //funcion usada para llamar ejs
    // en caso que se tenga mas de uno es necesario llamarlos a get desde las funciones que se han creado
    // mediante el uso de redirect(); es necesario tener en cuenta que el orden de la ubicacion de los render
    // es muy importante a tener en cuenta 
    res.render("lists",{listTitle:day, newListItem:items});
});
app.post("/",(req,res)=>{
    
    let item=req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else {
        items.push(item);
        // se usa la funcion redirect para enviar la informacion a la seccion get 
        res.redirect("/");
    };
   
});

app.get("/work",(req,res)=>{
    res.render("lists",{listTitle:"Work List", newListItem:workItems})

})

app.listen(3000,()=>{
    console.log("Server started on port 3000");
});