const canvas = document.querySelector('canvas')
const c = canvas.getContext("2d")

const player = new Player({
    position:{
        x: 300,
        y: 300
    },
    angle: {
        alpha: 30
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

function animate() {
    window.requestAnimationFrame(animate)
    background.update()
    player.update()
}
animate()