const pool = require('../../db')
const queries = require('./queries')

const getStudents = (req,res) => {
    pool.query(queries.getStudents, (error,result) => {
        if(error) throw error;
        res.status(200).json(result.rows)
    })
};

const getStudentById = (req,res) => {
    const id = parseInt(req.params.id)
    pool.query(queries.getStudentById, [id], (error,result) => {
        if(error) throw error;
        res.status(200).json(result.rows)
    })
};


const addStudent = (req,res) => {
    const { name, email, age , dob } = req.body;

    pool.query(queries.checkEmailExists,[email],(error,result) => {
        if (result.rows.length) {
            res.send('email already exists.')
        }

        pool.query(queries.addStudent,[name,email,age,dob] , (error,result) => {
            if(error) throw error;
            res.status(201).send('student created successfully!');
        })
    })
};

const removeStudent = (req,res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById,[id],(error,result) => {
        const noStudentFound = !result.rows.length;
        if(noStudentFound){
            res.send("student does not exist in the database.")
        }

        pool.query(queries.removeStudent,[id],(error,result)=>{
            if(error) throw error;
            res.status(200).send("student removed successfully!")
        })
    })
}

const updateStudent = (req,res) =>{
    const id = parseInt(req.params.id);
    const {name} = req.body;

    pool.query(queries.getStudentById,[id],(error,result)=> {
        const noStudentFound = !result.rows.length;
        if(noStudentFound){
            res.send("student does not exist in the database.")
        }

        pool.query(queries.updateStudent,[name,id],(error,result)=>{
            if(error) throw error;
            res.status(200).send("student updated successfully!")
        })
    })
}

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    removeStudent,
    updateStudent,
};