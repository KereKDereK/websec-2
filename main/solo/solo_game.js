const canvas = document.querySelector('canvas')
const c = canvas.getContext("2d")
let spawned = false
const player = new Player({
    position:{
        x: 300,
        y: 300
    },
    angle: {
        alpha: 0
    },
    velocity: {
        m: 0,
        x: 0,
        y: 0
    }
})

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "game_background1.png"
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let star = new Star({
    position: {
        x: getRandomInt(550),
        y: getRandomInt(550)
    }
})

let flag = true

function animate() {
    window.requestAnimationFrame(animate)
    background.update()
    player.update()
    if (flag){
        star.update()
    }
    else {
        star = new Star({
            position: {
                x: getRandomInt(550),
                y: getRandomInt(550)
            }
        })
        flag = true
    }
}
animate()

window.addEventListener('keydown', (event) => {
    player.inputHandler(event.key, 1)
})

window.addEventListener('keyup', (event) => {
    player.inputHandler(event.key, 0)
})

window.addEventListener('my_points', function(event) {
    star.eventHandler(event.detail.points, event.detail.id)
})

window.addEventListener('got_it', function(event) {
    flag = false
    player.eventHandler(event.detail.id)
})
