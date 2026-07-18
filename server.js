const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

dotenv.config();

const connectDB = async () => {
    try 
    {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } 
    catch (err) 
    {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/processed', express.static(path.join(__dirname, 'processed')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/image', require('./routes/image'));

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Central error handler so unhandled errors don't crash the process
// or leak stack traces to the client
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server error'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
