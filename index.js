

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const entrevistaRouter = require('./routes/entrevistaRoute');
const usuarioRoute = require('./routers/usuarioRoute');

const app = express();

app.use(cors({
    origin: true,
    credentials: false
}));

app.use(express.json());
app.use(express.static('public'));

app.use('/entrevista', entrevistaRouter);
app.use('/user', usuarioRoute);

app.get('/health', (req, res) => {
    res.json({ message: 'API no ar' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 Simulador de Entrevista iniciado!');
    console.log('Projeto Integrador - Turma de Programador Web 202500026');
    console.log(`Server running in ${PORT}`);
});



