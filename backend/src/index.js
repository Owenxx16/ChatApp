const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const PORT = process.env.PORT || 5000;
const connectDB = require('./lib/db');
const cors = require('cors');

app.use(express.json({limit: '50mb'}));
app.use(cors(
  {
    origin: 'http://localhost:5173', 
    credentials: true
  }
));


app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});