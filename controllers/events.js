const { response } = require('express');

const Evento = require('../models/Evento');


const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });
}


const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const event = await evento.save()
        
        res.json({
            ok: true,
            evento: event
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
}


const actualizarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const evento = await Evento.findById(eventId);

        if(!evento){
            return res.status(400).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento, { new : true });

        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
    
}


const eliminarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventId);

        if(!evento){
            return res.status(400).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este evento'
            });
        }


        await Evento.findByIdAndDelete(eventId);

        res.json({
            ok: true
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
    
}

module.exports ={
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}