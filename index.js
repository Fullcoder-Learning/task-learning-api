const mongoose = require('mongoose');
// cargar dotenv: 
const dotenv = require('dotenv');
const app = require('./app');
const port = 5000;

// ejecutar variables de entorno:
dotenv.config()


mongoose.connect("mongodb://localhost:27017/task-learn", (err, res) =>{
    try{
        if(err){
            throw err;
        }else{
            console.log("Se ha extablecido la conexión a la base de datos");
        }
    }catch(error){
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Servidor funcionando en: http://localhost:${port}`);
});