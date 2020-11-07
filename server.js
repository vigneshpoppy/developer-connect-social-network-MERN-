const express = require('express');
const connectDB = require('./config/db');

const app = express();
//connect db
connectDB();

//middlewaare
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('api is runningg'));

//define routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at${PORT}`));
