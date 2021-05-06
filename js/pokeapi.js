'use strict'

const url = 'https://pokeapi.co/api/v2/pokemon/';

//elementos a renderizar
const spriteDOM = document.querySelector('.pokemon__sprite-img');
const idDOM = document.querySelector('.datap__id');
const nameDOM = document.querySelector('.datap__name');
const typeDOM = document.querySelector('.type__text');
const heightDOM = document.querySelector('.datas__height');
const weightDOM = document.querySelector('.datas__weight');

//llamada a la API
async function fetchPokemon(id = 1) {
    const response =  await fetch(url + id);
    const jsonResponse =  await response.json();

    if(response.status !== 200)
        throw Error('Error de conexión');

    return jsonResponse;
}

//invocar la petición
async function getPokemon(id) {
    try {
        const pokemon = await fetchPokemon(id);
        getData(pokemon);
    } catch(error) {
        console.log(`Error: ${error}`)
    }
}

//obteniendo solo algunos datos del pokémon
const getData = pokemon => {
    const pkmData = {
        name: pokemon.name,
        id: pokemon.id,
        height: pokemon.height,
        weight: pokemon.weight,
        type: pokemon.types[0].type.name,
        sprite: pokemon.sprites.front_default,
    }
    //llamando a la función principal para actualizar los datos en la pantalla
    render(pkmData);
}

//funciones para actualizar los datos en la pantalla
const render = ({ name, id, height, weight, type, sprite }) => {
    spriteDOM.src = sprite;
    spriteDOM.alt = `Sprite: ${name}`;
    spriteDOM.title = `Sprite: ${name}`;
    idDOM.innerHTML = renderID(id);
    nameDOM.innerHTML = name;
    typeDOM.innerHTML = type;
    typeDOM.className = `type__text pkm-data ${type}`;
    heightDOM.innerHTML = renderHeight(height);
    weightDOM.innerHTML = renderWeight(weight);
}

//imprimir el id del pokémon con 3 dígitos
const renderID = id => {
    if(id < 10)
        return '00' + id;
    if(id < 100)
        return '0' + id;
    return id;
}

const renderHeight = height => height / 10  + ' m';

const renderWeight = weight => weight / 10  + ' kg';

//añadiendo eventos a las flechas
const KEY_LEFT_ARROW  = 37; //flecha izquierda del teclado
const KEY_RIGHT_ARROW = 39; //flecha derecha del teclado

//botones flecha de la página
const arrowLeft = document.querySelector('.arrow__left');
const arrowRight = document.querySelector('.arrow__right');

//eventos de teclado
document.addEventListener('keydown', e => {
    e.preventDefault();
    if(e.keyCode == KEY_LEFT_ARROW)
        previousPokemon();
    if(e.keyCode == KEY_RIGHT_ARROW)
        nextPokemon();
});

//eventos de las flechas de la página
arrowLeft.addEventListener('click', () => {
    previousPokemon();
});

arrowRight.addEventListener('click', () => {
    nextPokemon();
});

//buscar el pokémon anterior
const previousPokemon = () => {
    if(globalID === 1)
        globalID = 899;
    getPokemon(--globalID);
}

//buscar el pokémon siguiente
const nextPokemon = () => {
    if(globalID === 898)
        globalID = 0;
    getPokemon(++globalID);
}

//inicializando la llamada a la API
let globalID = 1;
getPokemon(globalID);