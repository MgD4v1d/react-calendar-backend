/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const router =  Router();
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/register',[
    //middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre debe tener almenos 3 caracteres').isLength({ min: 3 }),
    check('email', 'Este campo debe ser un email correcto').isEmail(),
    check('password', 'La contraseña es obligatoria y debe ser de 6 caracteres').isLength({ min:6 }),
    validarCampos
],crearUsuario);

router.post('/', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email correcto').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min:6 }),
    validarCampos
],loginUsuario);


router.get('/renew', validarJWT, revalidarToken);


module.exports = router;