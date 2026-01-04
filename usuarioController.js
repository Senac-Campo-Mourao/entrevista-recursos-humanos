const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'sua_chave_secreta_aqui'; // Em produção, use variáveis de ambiente

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Buscar usuário pelo email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};

exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verificar se usuário já existe
        const usuarioExistente = await User.findByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash da senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criar novo usuário
        const novoUsuario = await User.create({
            nome,
            email,
            senha: senhaCriptografada
        });

        res.status(201).json({ message: 'Usuário criado com sucesso', userId: novoUsuario._id });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
};