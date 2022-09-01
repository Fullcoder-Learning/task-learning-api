// se importa mongoose para mongodb y se inicializa el modulo schema para hacer un modelo:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// importar el tipo ObjectId para trabajar con ids
const ObjectId = Schema.ObjectId;

const TaskSchema = Schema({ 
    name: { 
        type: String,
        require: true
    },
    description: { 
        type: String,
        require: true
    },
    is_complete: { 
        type: Boolean,
        require: true,
        default: false
    },
    date_created: { 
        type: Date,
        require: true,
        default: Date.now
    },
    date_finish: { 
        type: Date,
        require: true,
        default: null 
    },
    owner: { // crear el campo propietario y hacerlo de tipo ObjectId:
        type: ObjectId,
        require: true,
    }
});

module.exports = mongoose.model("tasks", TaskSchema);