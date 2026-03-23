const data = [
    { id: "p01", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1018/1200/675" },
    { id: "p02", title: "Amanecer", desc: "Luz suave y cielo polar", src: "https://picsum.photos/id/1015/1200/675" },
    { id: "p03", title: "Río", desc: "Paseo reflexivo por el río", src: "https://picsum.photos/id/1011/1200/675" },
    { id: "p04", title: "Alaska", desc: "Fauna salvaje de Alaska", src: "https://picsum.photos/id/1020/1200/675" },
    { id: "p05", title: "Desierto", desc: "Atardecer en el desierto", src: "https://picsum.photos/id/1016/1200/675" },
    { id: "p06", title: "Navegar", desc: "Lago en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

//Selección de elementos del DOM
const thumbs = document.querySelector("#thumbs");
const heroImg = document.querySelector("#heroImg");
const heroTitle = document.querySelector("#heroTitle");
const heroDesc = document.querySelector("#heroDesc");
const likeBtn = document.querySelector("#likeBtn");
const counter = document.querySelector("#counter");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const playBtn = document.querySelector("#playBtn");

// Variables para el estado de la aplicación
let currentIndex = 0;
let likes = {};
let autoPlayId = null;
let isPlaying = false;
const AUTO_TIME = 3000; //Tiq po en milisegundos

//Función para renderizar las miniaturias
function renderThumbs() {
    thumbs.innerHTML = data.map((item, index) => {
        return`
        <article class="thumb ${index === currentIndex ? "active" : ""}" data-index="${index}"}">
        <span class="badge">${index + 1}</span>
        <img src="${item.src}" alt="${item.title}" />
        </article>
        `;
    }).join("");
}

//Renderizar imágen en el visor principal
function renderHero(index){
    //Recuperar el elemento acorde al índice
    const item = data[index];

    //Actualizar la imágen principal
    heroImg.src = item.src;
    heroImg.alt = item.title;

    //Actualizar título y descripción
    heroTitle.textContent = item.title;
    heroDesc.textContent = item.desc;

    //Actualizar el contador de las imagenes
    updateCounter();
    updateActiveThumb();
    updateLikeBtn();
}

// Actualizar el botón de reproducción
function updatePlayButton(){
    playBtn.textContent = isPlaying ? "■" : "▶";
    playBtn.dataset.state = isPlaying ? "stop" : "play";
}

function updateCounter(){
    counter.textContent = `${currentIndex + 1} / ${data.length}`;
}

function updateActiveThumb(){
    document.querySelectorAll(".thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentIndex);
    })
}

function updateLikeBtn(){
    const currentItem = data[currentIndex]
    const isLiked = likes[currentItem.id] === true;

    //Actualizar el botón visualmente
    likeBtn.textContent = isLiked ? "❤️" : "♡";
    likeBtn.classList.toggle("on", isLiked);
    likeBtn.setAttribute("aria-pressed", isLiked);
}

//Cambiar de imagen automaticamenre
function changeSlide(newIndex){
    heroImg.classList.add("fade-out");
    setTimeout(() => {
        currentIndex = newIndex;
        renderHero(currentIndex);
        heroImg.classList.remove("fade-out");
    }, 200);
}

function nextSlide(){
    const newIndex = (currentIndex + 1) % data.length;
    changeSlide(newIndex);
}

function prevSlide(){
    const newIndex = (currentIndex - 1 + data.length) % data.length;
    changeSlide(newIndex);
}

function startAutoplay(){
    autoPlayId = setInterval (() => {
        nextSlide();
    }, AUTO_TIME);
    isPlaying = true;
    updatePlayButton();
}

function stopAutoplay(){
    clearInterval(autoPlayId);
    autoPlayId = null;
    isPlaying = false;
    updatePlayButton();
}

function toggleAutoplay(){
    if (isPlaying){
        stopAutoplay();
    }else {
        startAutoplay();
    }
}

//Evento para manejar el click del boton de me gusta
likeBtn.addEventListener("click", () => {
    const currentItem = data[currentIndex];
    //Cambiar de true a false
    likes[currentItem.id] = !likes[currentItem.id];
    updateLikeBtn();
});

//Evento para manejar click en las miniaturas
thumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return; //Si no se hixo clic en miniatura salir

    const newIndex = Number(thumb.dataset.index);
    if(newIndex === currentIndex)return;
    changeSlide(newIndex);

    //Actualizar el visor principal
    // renderHero(currentIndex);
});

nextBtn.addEventListener("click", nextSlide);

prevBtn.addEventListener("click", prevSlide);

playBtn.addEventListener("click", toggleAutoplay);

//Eventos para sacar el teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight"){
        nextSlide();
    }
    if (e.key === "ArrowLeft"){
        prevSlide();
    }
})

renderThumbs();
renderHero(currentIndex);
updatePlayButton();
