const path = require('path')
const express = require('express');

const morgan = require('morgan')

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const cors = require('cors')
const connectDb = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
const fileUpload = require('express-fileupload');



connectDb()

const port = process.env.PORT || 5000;


const app = express();

app.use(cors());

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/ads', require('./routes/ad'))
app.use(errorHandler)

app.listen(port, () => console.log('Server Started On Port ' + port))

