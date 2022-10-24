
class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }
}

class Player {
    constructor({position, angle, velocity}) {
        this.position = position
        this.angle = angle
        this.velocity = velocity
        this.width = 50
        this.height = 35
    }

    coord_check() {
        if (this.position.y + this.height >= canvas.height - 8 ){
            this.velocity.y = 0
        }
        if (this.position.x + this.width >= canvas.width - 8){
            this.velocity.x = 0
        }
    }

    draw() {
        c.save();
        c.fillStyle = 'red'
        c.translate(this.position.x, this.position.y)
        c.rotate(this.angle.alpha * (Math.PI/180))
        c.fillRect(0, 0, 50, 35)
        c.restore()
    }

    update() {
        this.draw()
        
        this.velocity.y = this.velocity.m * Math.abs(Math.cos((90-this.angle.alpha)*(Math.PI/180)))
        this.velocity.x = this.velocity.m * Math.abs(Math.cos(this.angle.alpha*(Math.PI/180)))

        if(this.angle.alpha <= 90 && this.angle.alpha > 0){
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
        }
        else if (this.angle.alpha <= 180 && this.angle.alpha > 90){
            this.position.y += this.velocity.y
            this.position.x -= this.velocity.x
        }
        else if (this.angle.alpha <= 270 && this.angle.alpha > 180){
            this.position.y -= this.velocity.y
            this.position.x -= this.velocity.x
        }
        else if (this.angle.alpha <= 360 && this.angle.alpha > 270 || this.angle.alpha == 0){
            this.position.y -= this.velocity.y
            this.position.x += this.velocity.x
        }
    }
}