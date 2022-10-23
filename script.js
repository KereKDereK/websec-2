const menu = document.getElementById("menu");


function mouseoverHandler(n){
    console.log(menu.dataset.index)
    menu.dataset.index = n;
    console.log(menu.dataset.index)
}