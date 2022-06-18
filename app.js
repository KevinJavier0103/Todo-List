//jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
// seccion implementada para llamar una funcion generada en otro archivo por el ususario 
//const date= require(__dirname+"/date.js");
const mongoose=require("mongoose");
//El npm lodash se llama para modificar que siempre se use mayusculas como titulos y no importa si se usa mayusculas
const _=require("lodash");

// Se llama previamente la variable para seguir el orden de programacion
const app=express();
// Implementado para llamar a ejs
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
// Es necesario para llamar a archivos estaticos de esta manera poder generar el uso del documento
// En caso que se sea un documento css u otro es necesario que la direccion en HTML sea la correcta 
// entre comillas se coloca el nombre de la carpeta
app.use(express.static("public"));
//Al momento de usar una base de datos con mongoose se procede a realizar el almacenaje de las variables que van a ser 
// ingresadas en la base de datos 
// se realiza la coneccion a la base de dato
// lo que se encuentra entre llaves se usa cueando se genera un deprecation warning por lo cual se debe tener cuidado
mongoose.connect("mongodb+srv://admin-Kevin:Ledzeppelin0103@cluster0.lp7mk.mongodb.net/todolistDB",{useNewUrlParser: true});
// database
const itemsSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemsSchema);

const items1=new Item({
    name:" Welcome  to your to do list."
});
const items2= new Item({
    name:"Hit the + button to add a new item."
});
const items3= new Item({
    name:"<-- Hit this to delete an item."
});
// se crea una lista en la cual contendra los items creados anteriormente
const defaulItems=[items1,items2,items3];


// Se crea una nueva schema lista esto para la seccion de nuevas paginas 
// es creado para la creacion de un nuevo documento
const listSchema=({
    name:String,
    items:[itemsSchema]
});

const List=mongoose.model("List",listSchema);

app.get("/",(req,res)=>{

    // Para llamar los compoenentes almacenados en la base de datos se realiza lo siguiente
    // se usa las llaves vacias para llamar a todos los elementos almacenados
    //LA funcion para llamar se usa de mongoose 
    //foundItems contendra toda la informacion agregada en Item collection
    Item.find({},function(err,foundItems){
     //let day=date.getDate();
    //funcion usada para llamar ejs
    // en caso que se tenga mas de uno es necesario llamarlos a get desde las funciones que se han creado
    // mediante el uso de redirect(); es necesario tener en cuenta que el orden de la ubicacion de los render
    // es muy importante a tener en cuenta 
    // Se usa la siguiente sentencia if para agregar elementos de forma no repetitiva
    // De esta manera se puede obtener un mejor control en lo que se almacena en la base de datos
        if (foundItems.length==0){
            //Usado para agregar los compoenentes a la base de datos
            Item.insertMany(defaulItems,function(err){
                if (err){
                        console.log(err);
                } else {
                        console.log("Successfully saved default items to DB.");
                }});
            // la siguiente linea es usada para enviar la nueva informacion y se ejecute el primer if
            res.redirect("/");
        } else {
            res.render("lists",{listTitle:"Today", newListItem:foundItems});
        };
        });
});
//El siguiente app.get se usa para crear una pagina diferente en la cual se pueda detallar que se desea hacer por
// ejemplo en caso que se desee una lista para el trabajo y sea almacenada
app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    // Se usa la funcion de mongoose findOne para encontrar el nombre de una de las listas de las nuevas paginas para ser almacenados
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list=new List({
                    name:customListName,
                    items:defaulItems
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                //Show an existing list
                res.render("lists",{listTitle:foundList.name, newListItem:foundList.items});
            };
        };
    });
    // el nombre de la lista se encuentra enlazado con el nombre de la nueva pagina
});
app.post("/",(req,res)=>{
    // La siguiente linea se usa para llamar al objeto ingresado en la pagina principal
    //se encuentra enlazado con el documento lists.ejs 
    const itemName=req.body.newItem;
    // Se realiza el anclaje en una variable el llamado desde el boton +
    const listName=req.body.list;
    // Con  la creacion de un item es posible anadir los nuevos elementos a la base de datos determinada
    const item=new Item({
        name:itemName
    });
    
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
    
    // Metodo usado anteriormente ya que se tenia una lista bacia para anadir los elementos
    // if(req.body.list === "Work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else {
    //     items.push(item);
    //     // se usa la funcion redirect para enviar la informacion a la seccion get 
    //     res.redirect("/");
    // };
});

app.post("/delete",function(req,res){
    const checkedItemId=(req.body.checkbox);
    const listName=req.body.listName;

    if (listName==="Today"){
            //funcion de mongoose para borrar de la base de datos
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (err){
            console.log(err);
        }else{
            console.log("The item was removed")
        }
    });
    res.redirect("/");
    }else {
        //La siguiente linea permite borrar un elemento de una array guardada en la base de datos y actualizar dicha base

        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if (!err){
                res.redirect("/"+listName);
            }else{
                console.log(err);
            };
        });
    };

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(3000,()=>{
    console.log("Server has started on port succesfully");
});