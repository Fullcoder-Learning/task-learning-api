const Task = require('../models/taskModel');

async function postTask(req, res){
    const task = new Task();
    const params = req.body;

    task.name = params.name;
    task.description = params.description;

    try{
        const taskStore = await task.save();

        if(!taskStore){
            res.status(400).send({msg: "Error: cannot create task"});
        }else{
            res.status(201).send({task: taskStore});
        }
    }catch (error){
        res.status(500).send(error);
    }
}

async function getTasks(req, res){
    try{
        const tasks = await Task.find().sort({create_at: -1}); 

        if(!tasks){
            res.status(400).send({msg: "Error: Cannot get tasks"});
        }else {
            res.status(200).send(tasks);
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function getTask(req, res){
    const taskId = req.params.id;

    try{
        const task = await Task.findById(taskId);

        if(!task){
            res.status(400).send({msg: "Error: Task doesn't exists"});
        }else{
            res.status(200).send(task);
        }
    }catch(error){
        res.status(500).send(error);
    }
}

 function putTask(req, res){
    const taskId = req.params.id;
    const params = req.body;

    try{
        Task.findById(taskId, (err, taskData)=>{

            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                if(!taskData){
                    res.status(400).send({msg: "Error: Task doesn't exists"});
                }else{
                    
                    taskData.name = params.name;
                    taskData.description = params.description;

                    Task.findByIdAndUpdate(taskId, taskData, (err, result)=>{
                        if(err){
                            res.status(404).send({msg: err});
                        }else{
                            res.status(201).send({task: taskData});
                        }
                    });
                }
            }
        });

    }catch(error){
        res.status(500).send(error);
    }
}

async function deleteTask(req, res){
    const taskId = req.params.id;

    try{
        const task = await Task.findByIdAndDelete(taskId); 

        if(!task){
            res.status(400).send({msg: "Error: Task doesn't exists"});
        }else{
            res.status(200).send({msg: "Task successfully deleted"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

// cambiar estado de tarea:
function changeTask(req, res){
    // recuperar id de la tarea:
    const taskId = req.params.id;

    try{
        // buscar tarea a modificar y ejecutar callback:
        Task.findById(taskId, (err, taskData)=>{

            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                if(!taskData){
                    res.status(400).send({msg: "Error: Task doesn't exists"});
                }else{
                    // si existe la tarea cambiar campos is_complete y date_finish
                    taskData.is_complete = true;
                    taskData.date_finish = Date.now();
                    // realizar cambios: 
                    Task.findByIdAndUpdate(taskId, taskData, (err, result)=>{
                        if(err){
                            res.status(404).send({msg: err});
                        }else{
                            res.status(201).send({task: taskData});
                        }
                    });
                }
            }
        });

    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    postTask, 
    getTasks,
    getTask,
    putTask,
    deleteTask,
    changeTask  // exportar modulo
}; 