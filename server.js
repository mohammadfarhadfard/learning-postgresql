const express = require('express');
const dotenv = require('dotenv').config();
const studentsRoutes = require('./src/student/routes');

const app = express()
const port = 3040;

app.use(express.json())

app.get('/', (req,res)=>{
    res.send('hello')
})

app.use('/api/v1/students' , studentsRoutes);

app.listen(port, ()=>{
    console.log(`app listen on ${port}`);
})