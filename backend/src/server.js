require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');
const ownerRoutes = require('./routes/owner');

const app = express();
app.use(helmet());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());

app.get('/api/health', (req,res)=> res.json({ok:true}));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Backend running on ${PORT}`));
