'use strict'

const URL = 'https://pokeapi.co/api/v2/pokemon/';
const LAST_POKEMON = 898;
const FIRST_POKEMON = 1;

const KEY_LEFT_ARROW  = 37; //keyword left arrow
const KEY_RIGHT_ARROW = 39; //keyword right arrow
const KEY_ENTER = 13; //keyword "enter"

//elements to render
const spriteDOM = document.querySelector('.pokemon__sprite-img');
const idDOM = document.querySelector('.datap__id');
const nameDOM = document.querySelector('.datap__name');
const typeDOM = document.querySelector('.type__text');
const heightDOM = document.querySelector('.datas__height');
const weightDOM = document.querySelector('.datas__weight');

//calling API
async function fetchPokemon(id = 1) {
    const response =  await fetch(URL + id);
    
    if(response.status == 404)
        throw Error('Pokemon not found');
    if(response.status !== 200)
        throw Error('Connection error');

    const jsonResponse =  await response.json();
    return jsonResponse;
}

//awaiting for request
async function getPokemon(id) {
    try {
        const pokemon = await fetchPokemon(id);
        getData(pokemon);
        return true;
    } catch(error) {
        alert('Pokemon not found');
        return false;
    }
}

//filtering pokemon's data
const getData = pokemon => {
    const pkmData = {
        name: pokemon.name,
        id: pokemon.id,
        height: pokemon.height,
        weight: pokemon.weight,
        type: pokemon.types[0].type.name,
        sprite: pokemon.sprites.front_default,
    }
    //calling render function (sending full object)
    render(pkmData);
}

//function that renders the pokemon's data, destructuring object
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

//printing pokemon's ID with 3 digits
const renderID = id => {
    if(id < 10)
        return '00' + id;
    if(id < 100)
        return '0' + id;
    return id;
}

//original height is an integer number
const renderHeight = height => height / 10  + ' m';

//original weight is an integer number
const renderWeight = weight => weight / 10  + ' kg';

// -------------------- EVENTS -------------------- //

//getting arrow buttons
const arrowLeft = document.querySelector('.arrow__left');
const arrowRight = document.querySelector('.arrow__right');

//keywords events
document.addEventListener('keyup', e => {
    if(e.keyCode == KEY_LEFT_ARROW)
        previousPokemon();
    if(e.keyCode == KEY_RIGHT_ARROW)
        nextPokemon();
});

//arrow buttons events
arrowLeft.addEventListener('click', () => {
    previousPokemon();
});

arrowRight.addEventListener('click', () => {
    nextPokemon();
});

//looking for the previous pokemon
const previousPokemon = () => {
    if(globalID == FIRST_POKEMON) //globalID is string if updated by seeker
        globalID = LAST_POKEMON + 1; //beacause of <<-->> operator
    getPokemon(--globalID);
}

//looking for the next pokemon
const nextPokemon = () => {
    if(globalID == LAST_POKEMON) //globalID is string if updated by seeker
        globalID = FIRST_POKEMON - 1; //because of <<++>> operator
    getPokemon(++globalID);
}

//initializing globalID (current pokemon)
let globalID = 1; //at start shows the first pokemon
getPokemon(globalID);

// -------------------- SEEKER -------------------- //

const seeker = document.querySelector('.seeker__input');
const magnifying = document.querySelector('.magnifying-glass');

//user can search pokemon by ID
magnifying.addEventListener('click', () => {
    searchID(seeker.value);
});

//user can also press "enter" key
seeker.addEventListener('keyup', e => {
    if(e.keyCode === KEY_ENTER) {
        searchID(seeker.value);
    }
});

const searchID = id => {
    getPokemon(id)
        .then(response => {
            if(response === true)
                globalID = id; //update globalID only if no errors
        });
}