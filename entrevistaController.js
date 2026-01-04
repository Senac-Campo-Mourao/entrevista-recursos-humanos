const db = require('../config/db');

const EntrevistaController = {
    // Criar entrevista
    criarEntrevista: (req, res) => {
        const { candidato, vaga } = req.body;
        if (!candidato)
            return res.status(400).json({ message: 'O nome do candidato é obrigatório' });
        if (!vaga)
            return res.status(400).json({ message: 'A vaga é obrigatória' });

        const entrevista = {
            candidato,
            vaga,
            status: 'em andamento',
            perguntas: [],
            dataCriacao: new Date()
        };
        db.entrevistas.insert(entrevista, (err, newDoc) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao criar entrevista' });
            }
            res.status(200).json({
                message: 'Entrevista criada com sucesso',
                entrevista: newDoc
            });
        });
    },

    // Buscar entrevista por ID
    buscarEntrevistaPorId: (req, res) => {
        const { id } = req.params;
        db.entrevistas.findOne({ _id: id }, (err, entrevista) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar entrevista' });
            }
            if (!entrevista) {
                return res.status(404).json({ message: 'Entrevista não encontrada' });
            }
            res.status(200).json(entrevista);
        });
    },

    // Fazer pergunta
    fazerPergunta: (req, res) => {
        const { id } = req.params;
        const { pergunta } = req.body;
        if (!pergunta)
            return res.status(400).json({ message: 'A pergunta é obrigatória' });
        db.entrevistas.update(
            { _id: id },
            { $push: { perguntas: pergunta } },
            {},
            (err, numReplaced) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Erro ao adicionar pergunta' });
                }
                res.status(200).json({ message: 'Pergunta adicionada com sucesso' });
            }
        );
    },

    // Finalizar entrevista
    finalizarEntrevista: (req, res) => {
        const { id } = req.params;
        db.entrevistas.update(
            { _id: id },
            { $set: { status: 'finalizada' } },
            {},
            (err, numReplaced) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Erro ao finalizar entrevista' });
                }
                res.status(200).json({ message: 'Entrevista finalizada com sucesso' });
            }
        );
    },

    // Mostrar resultado
    mostrarResultado: (req, res) => {
        const { id } = req.params;
        db.entrevistas.findOne({ _id: id }, (err, entrevista) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar resultado' });
            }
            if (!entrevista) {
                return res.status(404).json({ message: 'Entrevista não encontrada' });
            }
            // Exemplo: resultado fictício
            res.status(200).json({
                resultado: 'Aprovado',
                entrevista
            });
        });
    }
};

module.exports = EntrevistaController;

            // Simulação de resposta da IA
            const respostaIA = `Resposta automática da IA para: "${pergunta}"`;

            const query = `
                INSERT INTO perguntas (id_entrevista, pergunta, resposta)
                VALUES ($1, $2, $3)
                RETURNING id_pergunta, pergunta, resposta
            `;

            const values = [id, pergunta, respostaIA];
            const result = await db.query(query, values);

            res.status(200).json({
                message: "Pergunta registrada",
                pergunta: result.rows[0],
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao registrar pergunta" });
        }
    }

    // Finalizar entrevista
    async finalizarEntrevista(req, res) {
        try {
            const { id } = req.params;

            // Exemplo simples: se respondeu 3+ perguntas = aprovado
            const perguntas = await db.query("SELECT * FROM perguntas WHERE id_entrevista = $1", [id]);
            const resultado = perguntas.rows.length >= 3 ? "aprovado" : "reprovado";

            const query = `
                UPDATE entrevista
                SET status = 'finalizada', resultado = $2
                WHERE id_entrevista = $1
                RETURNING id_entrevista, candidato, vaga, status, resultado
            `;

            const values = [id, resultado];
            const result = await db.query(query, values);

            if (result.rows.length === 0)
                return res.status(404).json({ message: "Entrevista não encontrada" });

            res.status(200).json({
                message: "Entrevista finalizada",
                entrevista: result.rows[0],
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao finalizar entrevista" });
        }
    }

    // Mostrar resultado
    async mostrarResultado(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query("SELECT resultado FROM entrevista WHERE id_entrevista = $1", [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Entrevista não encontrada" });
            }

            res.status(200).json({ resultado: result.rows[0].resultado });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao buscar resultado" });
        }
    }
}

export default new EntrevistaController();