const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // headers => x-token

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay un token en la peticion'
        });
    }


    try {

        const {uid, name} = jwt.verify(
            token, 
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name =name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }


    next();

}


module.exports = {
    validarJWT
}