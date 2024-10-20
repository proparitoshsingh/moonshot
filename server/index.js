const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const {logger}  = require('./middlewares/loggerMiddleware');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({
   origin: 'http://localhost:5173',
   credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/api', dataRoutes);
app.use('/api', preferencesRoutes);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});