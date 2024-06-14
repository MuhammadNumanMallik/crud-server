const express=require('express');
const app=express()
const cors=require('cors')
var bodyParser = require('body-parser')
const todo =require('./Routes/TodoRoute')
const auth =require('./Routes/AuthRoute')

app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())

app.use(express.json());

app.use('/api',todo);
app.use('/api',auth);


const PORT=3001;

app.listen(PORT,()=>{
console.log('server Runing.....')

})