function byField(field) {
    return (a, b) => a[field] > b[field] ? -1 : 1;
  }

let button = document.querySelector('#button');
let devError = document.querySelector('#error');
let devLogin = document.querySelector('#devLogin');
let leaderboard = document.querySelector('#leaderboard')
let divs = document.getElementsByClassName('menu-item')

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
        leaderboard.style.display = 'block'
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
canvas.style.position = "absolute"
canvas.style.top = "50%"
canvas.style.left = "50%"
canvas.style.marginRight = "-50%"
canvas.style.transform = "translate(-50%, -50%)"
canvas.style.background = "white";
canvas.style.margin = "0 auto"

const Car = new Image(25,16);
Car.src = 'assets/car_1.png';

const coinImage = new Image(25,25);
coinImage.src = 'assets/coin.png';

document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
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


let draw = 1
let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
socket.on('redraw', (data)=>{
  ctx.drawImage(background, 0, 0);
  const players = data[0]
  draw = 1
  arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  players.forEach(player => {
    arr[draw-1] = {name: player.login, score: player.score}
    Car.src = `assets/car_${draw}.png`;
    ctx.save();
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.translate(player.position.x, player.position.y)
    ctx.rotate(0* Math.PI/180);
    ctx.fillText(player.login, -15, -25, 60);
    ctx.restore()
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.translate(player.position.x, player.position.y)
    ctx.rotate(player.angle.alpha * (Math.PI/180))
    ctx.drawImage(Car, 0, -8)
    ctx.restore();
    draw++;
  });
  arr.sort(byField('score'));
  console.log(divs.length)
  for (let i = 1; i <= divs.length-1; ++i){
        if (i > players.length) {
            divs[i].style.display = 'none'
        }
        else{
            divs[i].style.display = 'block'
            divs[i].innerHTML = `${i}. ${arr[i-1].name} ${arr[i-1].score}`
        }
  }
  const coin = data[1]
  ctx.drawImage(coinImage, coin.x, coin.y, widthCoin, heightCoin);
})