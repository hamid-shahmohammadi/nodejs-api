const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const colors=require('colors');
const errorHandler=require('./middleware/error');
const connectDB=require('./config/db');

//load env vars
dotenv.config({path:'./config/config.env'});

//connect database
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');

const app=express();

app.use(express.json());


// devlogging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//mount routers
app.use('/api/v1/bootcamps',bootcamps);

app.use(errorHandler);

const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);

    //Close server & process

    server.close(()=>process.exit(1))
})