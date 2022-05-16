/*
    Rutas de Eventos
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate')

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router =  Router();

// Rutas validadas con JWT
router.use(validarJWT);

// obtener eventos

router.get('/', getEventos);

// Crear un evento

router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(  isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom(  isDate ),
    validarCampos
],crearEvento);


// Actualizar un evento

router.put('/edit/:id',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(  isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom(  isDate ),
    validarCampos
],actualizarEvento);


// Borrar evento

router.delete('/delete/:id', eliminarEvento)



module.exports = router;