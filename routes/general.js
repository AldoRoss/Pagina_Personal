const router = require('express').Router();

// Ruta inicial
router.get('/', (req, res) => {
    res.render('landing_page');
});

// Rutas Secundarias
router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/photos', (req, res) => {
    res.render('photos');
});

router.get('/information', (req, res) => {
    res.render('information');
});

router.get('/projects', (req, res) => {
    res.render('projects');
});

module.exports = router;
