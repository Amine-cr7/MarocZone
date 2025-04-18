const path = require('path')
const express = require('express');

const morgan = require('morgan')

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

 
const cors = require('cors')
const connectDb = require('./config/db');
const {errorHandler} = require('./middlewares/errorMiddleware');



connectDb()

const port = process.env.PORT || 5000;


const app = express();

app.use(cors());

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};
app.use('/api/auth',require('./routes/auth'));
app.use('/api/categories',require('./routes/category'));
app.use('/api/cities',require('./routes/city'));
app.use(errorHandler)

app.listen(port, () => console.log('Server Started On Port ' + port))

