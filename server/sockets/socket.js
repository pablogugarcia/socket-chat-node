const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

let usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es requerido'
            });
        }

        client.join(data.sala, (err) => {
            if (err) throw new Error(err);
        })

        usuarios.agregarPersonas(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listarPersonas', usuarios.getPersonaPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio a el chat`));


        callback(usuarios.getPersonaPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);


        callback(mensaje);
    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersonas(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} ha abandonado el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listarPersonas', usuarios.getPersonaPorSala(personaBorrada.sala));


    });

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit(' mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});