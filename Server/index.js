const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const SignupRoutes = require('./Routes/SignupRoutes');
const ProductsRoutes = require('./Routes/ProductsRoutes');

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

//To connect Database
mongoose.connect("mongodb://127.0.0.1:27017/Machine-Task", { useNewUrlParser: true, useUnifiedTopology: true })

// Router
app.use('/auth', SignupRoutes);
app.use('/product', ProductsRoutes);

// Run Server Port
app.listen(3001, ()=>{
    console.log('Server is Running..')
})