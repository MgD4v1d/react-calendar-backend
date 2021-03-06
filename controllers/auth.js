const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try{

        //Verifica el corro en la base de datos

        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya existe en el sistema'
            })
        }

        usuario = new Usuario(req.body);

        //Encryptar password

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardado en base de datos
        await usuario.save();


        // Generar Token

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador del servidor'
        });
    }

    
}

// loginUsurio
const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Confirmar el correo

        const usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords

        const validPass = bcrypt.compareSync(password, usuario.password);

        if(!validPass){
            return res.status(400).json({
                ok:false,
                msg: 'La contraseña es incorrecta'
            });
        }

        // Generar nuestro JWT

        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador del servidor'
        });
    }

    
}

// revalidarToken

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req

    // generar un nuevo JWT y retornarlo en esta peticion

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}