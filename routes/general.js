const router = require('express').Router();

// Ruta inicial
router.get('/', (req, res) => {
    res.render('landing_page');
});

router.get('/panelDeJuegos', (req, res) => {
    res.render('panel_de_juegos')
});

router.get('/settingTotis', (req, res) => {
    res.render('setting_totis')
});

// Ruta Juego Cuéntame Algo

router.get('/settingCA', (req, res) => {
    res.render('setting_ca')
});

router.get('/felicidadesCA', (req, res) => {
    res.render('felicidades_ca')
});

router.get('/felicidades', (req, res) => {
    res.render('felicidades')
});

router.get('/errorCA', (req, res) => {
    res.render('error_ca')
});

router.get('/perdiste', (req, res) => {
    res.render('perdiste')
});


router.get('/cuentameAlgo', (req, res) => {
    res.render('cuentame_algo')
});

router.get('/terminado_ca', (req, res) => {
    res.render('terminado_ca')
});

router.get('/coolorcitos', (req, res) => {
    res.render('coolorcitos')
});

router.get('/felicidadesC', (req, res) => {
    res.render('felicidadesC')
});

router.get('/error', (req, res) => {
    res.render('error')
});


router.get('/totis', (req, res) => {
    const playerRow = Math.floor(Math.random() * 9);
    const playerCol = Math.floor(Math.random() * 6);
    const totisRow = Math.floor(Math.random() * 9);
    const totisCol = Math.floor(Math.random() * 6);
    const remainingMoves = { up: 5, down: 5, left: 5, right: 5 }; // Ejemplo

    res.render('totis', {
        playerRow,
        playerCol,
        totisRow,
        totisCol,
        remainingMoves,
    });
});



module.exports = router