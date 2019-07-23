

class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersonas(id, nombre, sala) {

        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    borrarPersonas(id) {

        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id !== id);
        return personaBorrada;
    }

    getPersona(id) {
        let persona = this.personas.find(persona => persona.id === id);
        return persona;
    }
    getPersonas() {
        return this.personas;
    }

    getPersonaPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }



}

module.exports = {
    Usuarios
}