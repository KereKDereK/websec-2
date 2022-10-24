const menu = document.getElementById("menu");
let sound = new Audio('https://www.soundjay.com/buttons/sounds/button-41.mp3');

function mouseoverHandler(n){
    menu.dataset.index = n;
    sound.play();
}