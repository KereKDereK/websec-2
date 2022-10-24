
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

    point_rotation(x_old, y_old) {
        let x = x_old * Math.cos(this.angle.alpha* (Math.PI/180)) - y_old * Math.sin(this.angle.alpha* (Math.PI/180))
        let y = x_old * Math.sin(this.angle.alpha* (Math.PI/180)) + y_old * Math.cos(this.angle.alpha* (Math.PI/180))
        return {x, y}
    }

    collision() {

        let x1 = this.position.x
        let y1 = this.position.y

        let p1 = {x1, y1}

        let newx = this.width
        let newy = this.height

        let p2 = this.point_rotation(newx, newy)

        p2.x += this.position.x
        p2.y += this.position.y

        newy = 0

        let p3 = this.point_rotation(newx, newy)

        p3.x += this.position.x
        p3.y += this.position.y

        newx = 0
        newy = this.height

        let p4 = this.point_rotation(newx, newy)

        p4.x += this.position.x
        p4.y += this.position.y

        let points = [p1, p2, p3, p4]
        console.log(points)
        return points
    }

    update() {
        this.draw()
        let points = this.collision()
        this.velocity.y = this.velocity.m * Math.abs(Math.cos((90-this.angle.alpha)*(Math.PI/180)))
        this.velocity.x = this.velocity.m * Math.abs(Math.cos(this.angle.alpha*(Math.PI/180)))

        for (let i = 0; i < points.length; ++i) {
            if (points[i].x >= canvas.width - 8 || points[i].x <= 10 || points[i].y >= canvas.height - 10 || points[i].y <= 8 ) {
                this.velocity.y = 0
                this.velocity.x = 0
            }
        }

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