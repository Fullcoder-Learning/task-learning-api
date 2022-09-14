const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config()

// movemos despues del dotenv.config los datos de port y host para recuperarlos del .env
const port = 5000;
const host = process.env.PORT || 5000; // le pasamos un puerto por las variables de entorno

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.die77rr.mongodb.net/?retryWrites=true&w=majority`, (err, res) =>{
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
    console.log(`Servidor funcionando en: ${host}`);
});