const canvas = document.querySelector('canvas')
const c = canvas.getContext("2d")
let spawned = false
let win_condition = false
let winner = 'Nope'

function check(x, y) {
    return Math.sqrt(Math.pow((x - star.position.x), 2) + Math.pow((y - star.position.y), 2))
}

function ai(dummy) {

        if (Math.floor(check(dummy.ai[1][0], dummy.ai[1][1]) - check(dummy.ai[3][0], dummy.ai[3][1])) == 0){
            dummy.key[0] = 1
            dummy.key[2] = 0
            dummy.key[1] = 0
        }
        if (check(dummy.ai[1][0], dummy.ai[1][1]) - check(dummy.ai[3][0], dummy.ai[3][1]) > 0) {
            dummy.key[2] = 1
            dummy.key[1] = 0
        }
        else if (check(dummy.ai[1][0], dummy.ai[1][1]) - check(dummy.ai[3][0], dummy.ai[3][1]) < 0){
            dummy.key[2] = 0
            dummy.key[1] = 1
        }
        if (dummy.score >= 10) {
            win_condition = true
            winner = dummy.id
        }
}

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
}, "../../assets/car_1.png")

const dummy = new Dummy({
    position:{
        x: 500,
        y: 500
    },
    angle: {
        alpha: 0
    },
    velocity: {
        m: 0,
        x: 0,
        y: 0
    }
}, 2, "../../assets/car_2.png")

const dummy2 = new Dummy({
    position:{
        x: 200,
        y: 200
    },
    angle: {
        alpha: 0
    },
    velocity: {
        m: 0,
        x: 0,
        y: 0
    }
}, 3, "../../assets/car_3.png")

const dummy3 = new Dummy({
    position:{
        x: 100,
        y: 100
    },
    angle: {
        alpha: 0
    },
    velocity: {
        m: 0,
        x: 0,
        y: 0
    }
}, 4, "../../assets/car_4.png")

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "game_background1.png"
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max + 50);
}

let star = new Star({
    position: {
        x: getRandomInt(520),
        y: getRandomInt(520)
    }
})

let flag = true

function animate() {
    if (win_condition == true) {
        console.log('The winner is: ', winner)
    }
    else {
    window.requestAnimationFrame(animate)
    background.update()
    player.update()
    if (player.score >= 10) {
        win_condition = true
        winner = player.id
    }
    dummy.update()
    dummy2.update()
    dummy3.update()
    ai(dummy)
    ai(dummy2)
    ai(dummy3)
    if (flag){
        star.update()
    }
    else {
        star = new Star({
            position: {
                x: getRandomInt(520),
                y: getRandomInt(520)
            }
        })
        flag = true
    }
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
    player.collisionHandler(event.detail.points, event.detail.id)
    dummy.collisionHandler(event.detail.points, event.detail.id)
    dummy2.collisionHandler(event.detail.points, event.detail.id)
    dummy3.collisionHandler(event.detail.points, event.detail.id)
})

window.addEventListener('ouch', function(event) {
    player.ouchHandler(event.detail.id)
    dummy.ouchHandler(event.detail.id)
    dummy2.ouchHandler(event.detail.id)
    dummy3.ouchHandler(event.detail.id)
})

window.addEventListener('got_it', function(event) {
    flag = false
    player.eventHandler(event.detail.id)
})
