
const express = require('express');
const router = express.Router();
const entrevistaController = require('../controllers/entrevistaController');

router.post('/', entrevistaController.criarEntrevista);
router.get('/:id', entrevistaController.buscarEntrevistaPorId);
router.post('/:id/pergunta', entrevistaController.fazerPergunta);
router.post('/:id/finalizar', entrevistaController.finalizarEntrevista);
router.get('/:id/resultado', entrevistaController.mostrarResultado);

module.exports = router;
