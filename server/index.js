const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const {logger}  = require('./middlewares/loggerMiddleware');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/api', dataRoutes);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});