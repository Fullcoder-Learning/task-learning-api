// importar el modulo mongoose:
const mongoose = require('mongoose');
const app = require('./app');
const port = 3000;

// conectar mongoose a mongodb, en la ruta de la base de datos el /task-learn crear una nueva colección con dicho nombre:
mongoose.connect("mongodb://localhost:27017/task-learn",  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) =>{
    // trabajar con try / catch por si la url no estuviese bien definida:    
    try{
        if(err){
            throw err;
        }else{
            // si todo va bien avisamos por consola:
            console.log("Se ha extablecido la conexión a la base de datos");
        }
    }catch(error){
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Servidor funcionando en: http://localhost:${port}`);
});