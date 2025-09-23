/**
 * Vamos a crear dos montones de tarjetas, uno de películas y otro de recursos relacionados:
 * 
 */
const NMOVIES = 5
const NELEMENTSPMOVIE = 3
const getMoviesDeck = () => {
    let movieDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        movieDeck.push("0"+i+"M")
    }
    //Barajamos con un método dela librería Underscore. Esta librería ofrece muchas funciones,
    //en este caso uso shuffle que recibe un arrayy lo devuelve de forma aleatoria
    movieDeck = _.shuffle(movieDeck)
    return movieDeck;
}

const getElementsDeck = () => {
    let elementDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        for(let j = 1; j <= NELEMENTSPMOVIE; j++) {
            elementDeck.push("0"+i+"C"+j)
        } 
    }
    //Barajamos
    elementDeck = _.shuffle(elementDeck)
    return elementDeck;
}

const getElement = (deck) => {
  if (deck.length === 0) {
    console.warn("El mazo está vacío");
    return null;
  }
  return deck.pop(); // quita y devuelve el último elemento
};


const mostrarPelicula = () => {
  const btnMovie = document.querySelector('#btnpelicula');
  const divPelicula = document.querySelector('#pelicula-caratula');

  if (!btnMovie || !divPelicula) {
    console.error('No se encontró el botón o el contenedor');
    return;
  }

  btnMovie.addEventListener('click', () => {
    const movie = getElement(movieDeck);
    const imgMovie = document.createElement('img');
    imgMovie.src = `assets/movies/${movie}.jpg`;
    imgMovie.classList.add('elemento');
    divPelicula.appendChild(imgMovie);
  });
};

const Adivina = () => {
  const btnAdivina = document.querySelector('#btnadivina');
  const divElemento = document.querySelector('#elementos-pelicula');

  if (!btnAdivina || !divElemento) {
    console.error('No se encontró el botón o el contenedor');
    return;
  }

  btnAdivina.addEventListener('click', () => {
    const elemento = getElement(elementDeck);
    const imgElemento = document.createElement('img');
    imgElemento.src = `assets/characters/${elemento}.jpg`;
    imgElemento.classList.add('elemento');
    divElemento.appendChild(imgElemento);
  });
};



document.addEventListener('DOMContentLoaded', mostrarPelicula);
document.addEventListener('DOMContentLoaded', Adivina);
let movieDeck = getMoviesDeck()
let elementDeck = getElementsDeck()


