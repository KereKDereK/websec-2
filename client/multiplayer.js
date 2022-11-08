let button = document.querySelector('#button');
let devError = document.querySelector('#error');
let devLogin = document.querySelector('#devLogin');

const widthCar = 25;
const heightCar = 16;

const widthCoin = 25;
const heightCoin = 25;

let key = [0, 0, 0, 0];

button.onclick = () =>{
    let login = document.getElementById('login').value;
    socket.emit('login', login);
    console.log('send');
    socket.on('login exist', ()=>{
        devError.innerHTML = 'login exist';
        return;
    })
    devError.innerHTML = '';
    socket.on("successful", ()=>{
        console.log("successful");
        devLogin.remove();
        document.body.appendChild(canvas);
        setInterval(()=>{socket.emit('key', key)}, 10);
    })
}

let socket = io()

const background = new Image(600,600);
background.src = 'assets/game_background1.png';

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
canvas.style.display = "block";
canvas.style.background = "white";
canvas.style.margin = "0 auto"

const Car = new Image(25,16);
Car.src = 'assets/car_1.png';

const coinImage = new Image(25,25);
coinImage.src = 'assets/coin.png';

document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  console.log(code);
  switch (name) {
    case 'w':
        key[0] = 1
        break
    case 'd':
        key[1] = 1
        break
    case 'a':
        key[2] = 1
        break
    case 's':
        key[3] = 1
        break
    
    }
}, false);


document.addEventListener('keyup', (event) => {
  var name = event.key;
  var code = event.code;
  switch (name) {
    case 'w':
        key[0] = 0
        break
    case 'd':
        key[1] = 0
        break
    case 'a':
        key[2] = 0
        break
    case 's':
        key[3] = 0
        break
    }
}, false);

socket.on('redraw', (data)=>{
  ctx.drawImage(background, 0, 0);
  const players = data[0]
  players.forEach(player => {
    console.log(player.angle.alpha, player.velocity.m, player.position.x, player.position.y);
    ctx.save();
    ctx.fillStyle = 'red'
    ctx.translate(player.position.x, player.position.y)
    ctx.rotate(player.angle.alpha * (Math.PI/180))
    ctx.drawImage(Car, 0, -8)
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.rotate(-90* Math.PI/180);
    ctx.fillText(player.login, -40, -5, 60);
    ctx.restore();
  });
  const coin = data[1]
  ctx.drawImage(coinImage, coin.x, coin.y, widthCoin, heightCoin);
})