const express = require('express');
const connectDB = require('./config/db');
const userRouter = require("./Routes/User-routes");
const teacherRoutes = require('./Routes/Teacher-routes');
const admin = require("./Routes/Admin-router");
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api', userRouter);
app.use('/teacher', teacherRoutes);
app.use('/admin', admin);

connectDB();

const port =process.env.PORT|| 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
