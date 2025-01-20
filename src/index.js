const colors = require('colors');
const express = require('express');
const connect = require('./config/db');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const { PORT } = require('./config/index');
const ApiRoutes = require('./routes/index');

const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', ApiRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to chat App');
});


app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`.bgCyan);
    } catch (error) {
        console.error('Server startup error:'.bgRed, error.message);
    }
});