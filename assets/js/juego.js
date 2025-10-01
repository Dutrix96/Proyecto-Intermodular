const NMOVIES = 5
const NELEMENTSPMOVIE = 3
const getMoviesDeck = () => {
    let movieDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        movieDeck.push("0"+i+"M")
    }
    movieDeck = _.shuffle(movieDeck)
    return movieDeck;
}

const getElementsDeck = () => {
    let elementDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        for(let j = 0; j < NELEMENTSPMOVIE; j++) {
            elementDeck.push("0"+i+"C"+j)
        } 
    }
    elementDeck = _.shuffle(elementDeck)
    return elementDeck;
}

let movieDeck = Array.from(getMoviesDeck())
let elementDeck = Array.from(getElementsDeck())

const getElement = (deck) => {
  if (deck.length === 0) {
    console.warn("El mazo está vacío");
    return null;
  }
  return deck.pop();
};


const mostrarPelicula = () => {
  const btnMovie = document.getElementById('btnpelicula');
  const divPelicula = document.getElementById('pelicula-caratula');

  btnMovie.addEventListener('click', () => {
    if (movieDeck.length > 0){
    const movie = getElement(movieDeck);
    const imgMovie = document.createElement('img');
    imgMovie.src = `assets/movies/${movie}.jpg`;
    imgMovie.classList.add('elemento');
    const imagenAnterior = divPelicula.querySelector("img");
    if (imagenAnterior){
        divPelicula.replaceChild(imgMovie, imagenAnterior)
        
    }
    else{
        divPelicula.appendChild(imgMovie);
    }
}})
};

const Adivina = () => {
  const btnAdivina = document.getElementById('btnadivina');
  const zonaLista = document.getElementById('elementos-pelicula');

  btnAdivina.addEventListener('click', () => {
    if (elementDeck.length === 0) return;

    const idCarta = getElement(elementDeck);              
    const src = `assets/characters/${idCarta}.jpg`;

    const carta = document.createElement('div');
    carta.classList.add('elemento');                    
    carta.setAttribute('draggable', 'true');
    carta.dataset.id = idCarta;                         

    const img = document.createElement('img');
    img.src = src;
    img.classList.add('recurso');                         
    carta.appendChild(img);

    carta.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', idCarta);
      e.dataTransfer.effectAllowed = 'move';
      carta.classList.add('arrastrando');
      const ghost = carta.cloneNode(true);
      ghost.style.position = 'absolute';
      ghost.style.top = '-10000px';
      ghost.style.left = '-10000px';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
      carta._ghost = ghost;
    });

    carta.addEventListener('dragend', () => {
      carta.classList.remove('arrastrando');
      if (carta._ghost) { document.body.removeChild(carta._ghost); carta._ghost = null; }
    });

    zonaLista.appendChild(carta);
  });
};

const getPrefix2 = (str) => str.slice(0, 2);

const getCurrentMovieId = () => {
  const img = document.querySelector('#pelicula-caratula img');
  if (!img) return null;
  const file = img.src.split('/').pop();
  return getPrefix2(file);
};

const prepararDrop = () => {
  document.querySelectorAll('.adivinar').forEach(zona => {

    zona.addEventListener('dragover', (e) => {
      e.preventDefault();
      zona.classList.add('zona-hover');
    });

    zona.addEventListener('dragleave', () => {
      zona.classList.remove('zona-hover');
    });

    zona.addEventListener('drop', (e) => {
      e.preventDefault();
      zona.classList.remove('zona-hover');

      const cartaId = e.dataTransfer.getData('text/plain');
      const carta = document.querySelector(`.elemento[data-id="${cartaId}"]`) 
                 || document.querySelector(`.elemento img[src*="${cartaId}.jpg"]`)?.closest('.elemento');
      if (!carta) return;

      const cartaPrefix = getPrefix2(cartaId);
      const moviePrefix = getCurrentMovieId();

      if (!moviePrefix) return;

     if (cartaPrefix === moviePrefix) {
      zona.innerHTML = "";
      zona.appendChild(carta);
      zona.classList.add('drop-correcto');
      }

      else {
        zona.classList.add('drop-invalido');
        setTimeout(() => zona.classList.remove('drop-invalido'), 600);
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', prepararDrop);


const Reiniciar = () => {
  const btnReiniciar = document.getElementById("btnreiniciar")
  btnReiniciar.addEventListener("click", () => {
    let pelis = document.getElementById("pelicula-caratula")
    let personajes = document.getElementById("elementos-pelicula")
    pelis.innerHTML = ""
    personajes.innerHTML = ""
    document.querySelectorAll(".adivinar").forEach(div => {
      div.innerHTML = ""
      div.classList.remove("ocupado")
    })
    movieDeck = Array.from(getMoviesDeck())
    elementDeck = Array.from(getElementsDeck())
  })
}

document.addEventListener('DOMContentLoaded', mostrarPelicula);
document.addEventListener('DOMContentLoaded', Adivina);
document.addEventListener('DOMContentLoaded', Reiniciar);