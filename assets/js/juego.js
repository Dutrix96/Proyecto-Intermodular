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

let intentosRestantes = 4;

const getPrefix2 = (s) => s.slice(0, 2);
const getCurrentMovieId = () => {
  const img = document.querySelector('#pelicula-caratula img');
  if (!img) return null;
  const file = img.src.split('/').pop();
  return getPrefix2(file);
};

const actualizarContador = () => {
  const contador = document.getElementById('contador-intentos');
  if (contador) contador.textContent = `Intentos restantes: ${intentosRestantes}`;
};

const checkVictoria = () => {
  const slots = Array.from(document.querySelectorAll('.adivinar'));
  const ok = slots.every(z => z.querySelector('.elemento.bloqueada'));
  if (ok) document.getElementById('game-win').style.display = 'flex';
};

const prepararDrop = () => {
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.bloqueada')) e.preventDefault();
  });

  document.querySelectorAll('.adivinar').forEach(zona => {

    zona.addEventListener('dragover', (e) => {
      if (intentosRestantes > 0) {
        e.preventDefault();
        zona.classList.add('zona-hover');
      }
    });

    zona.addEventListener('dragleave', () => zona.classList.remove('zona-hover'));

    zona.addEventListener('drop', (e) => {
      e.preventDefault();
      zona.classList.remove('zona-hover');

      if (intentosRestantes <= 0) return;

      const cartaId = e.dataTransfer.getData('text/plain');
      const carta =
        document.querySelector(`.elemento[data-id="${cartaId}"]`) ||
        document.querySelector(`.elemento img[src*="${cartaId}.jpg"]`)?.closest('.elemento');
      if (!carta) return;

      const cartaPrefix = cartaId.slice(0, 2);
      const moviePrefix = getCurrentMovieId();
      if (!moviePrefix) return;

      if (cartaPrefix === moviePrefix) {
        zona.innerHTML = "";
        zona.appendChild(carta);
        zona.classList.add('drop-correcto');
        carta.draggable = false;
        carta.classList.add('bloqueada');
        actualizarContador();
        checkVictoria();
      } else {
        intentosRestantes = Math.max(0, intentosRestantes - 1);
        actualizarContador();
        zona.classList.add('drop-invalido');
        setTimeout(() => zona.classList.remove('drop-invalido'), 600);
        if (intentosRestantes === 0) {
          document.getElementById("game-over").style.display = "flex";
        }
      }
    });
  });
};
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnContinuar');
  if (btn) btn.addEventListener('click', () => {
    document.getElementById('btnreiniciar').click();
    document.getElementById('game-win').style.display = 'none';
  });
});

const Reiniciar = () => {
  const btnReiniciar = document.getElementById("btnreiniciar");
  btnReiniciar.addEventListener("click", () => {
    let pelis = document.getElementById("pelicula-caratula");
    let personajes = document.getElementById("elementos-pelicula");
    pelis.innerHTML = "";
    personajes.innerHTML = "";
    document.querySelectorAll(".adivinar").forEach(div => {
      div.innerHTML = "";
      div.classList.remove("drop-correcto");
    });
    document.querySelectorAll(".elemento.bloqueada").forEach(c => {
      c.draggable = true;
      c.classList.remove("bloqueada");
    });
    movieDeck = Array.from(getMoviesDeck());
    elementDeck = Array.from(getElementsDeck());
    intentosRestantes = 4;
    actualizarContador();
    document.getElementById("game-over").style.display = "none";
    document.getElementById('game-win').style.display = 'none';
  });
};


document.addEventListener('DOMContentLoaded', () => {
  mostrarPelicula();
  Adivina();
  Reiniciar();
  prepararDrop();
  actualizarContador();

  const btnReintentar = document.getElementById("btnReintentar");
  if (btnReintentar) {
    btnReintentar.addEventListener("click", () => {
      document.getElementById("btnreiniciar").click();
      document.getElementById("game-over").style.display = "none";
    });
  }

  const btnContinuar = document.getElementById('btnContinuar');
  if (btnContinuar) {
    btnContinuar.addEventListener('click', () => {
      document.getElementById('btnreiniciar').click();
      document.getElementById('game-win').style.display = 'none';
    });
  }
});