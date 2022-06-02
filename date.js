// Metodo implementado para la exportacion de funciones, esto es recomendado hacer cuando
// se tiene funciones que pueden ser usadas continuamente y no se desee repetir codigo 
module.exports.getDate= function (){
    let today=new Date();
    let currentDay=today.getDay();
    let options = {weekday:"long", day:"numeric",month:"long"};
    return today.toLocaleDateString("en-US",options);
};

module.exports.getDay=function (){
    let today =new Date();
    let options={weekday: "long"};
    return today.toLocaleDateString("en-US",options);

}