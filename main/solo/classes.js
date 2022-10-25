
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
        this.width = 25
        this.height = 15
        this.key = [0,0,0,0]
        this.points = []
    }

    inputHandler(x, to) {
        switch (x) {
            case 'w':
                this.key[0] = to
                break
            case 'd':
                this.key[1] = to
                break
            case 'a':
                this.key[2] = to
                break
            case 's':
                this.key[3] = to
                break
        }
    }

    movement() {
        if (this.key[0] == 1){
            this.velocity.m += 0.3
        }
        else {
            this.slowdown()
        }

        if (this.key[3] == 1){
            this.velocity.m -= 0.3
        }
        else {
            this.slowdown()
        }

        if (this.key[1] == 1){
            this.angle.alpha += 3
        }

        if (this.key[2] == 1){
            this.angle.alpha -= 3
        }


    }

    slowdown() {
        this.velocity.m *= 0.95
    }

    inputHandlerDown(x) {
        switch (x) {
            case 'w':
                player.velocity.m = 2
                break
            case 'd':
                if (this.collision_checker(this.points)) {
                    break
                }
                player.angle.alpha += 3
                break
            case 'a':
                if (this.collision_checker(this.points)) {
                    break
                }
                player.angle.alpha -= 3
                break
            case 's':
                player.velocity.m = -2
                break
        }
    }

    draw() {
        c.save();
        c.fillStyle = 'red'
        c.translate(this.position.x, this.position.y)
        c.rotate(this.angle.alpha * (Math.PI/180))
        c.fillRect(0, -this.height/2, this.width, this.height)
        c.restore()
    }

    point_rotation(x_old, y_old) {
        let x = x_old * Math.cos(this.angle.alpha* (Math.PI/180)) - y_old * Math.sin(this.angle.alpha* (Math.PI/180))
        let y = x_old * Math.sin(this.angle.alpha* (Math.PI/180)) + y_old * Math.cos(this.angle.alpha* (Math.PI/180))
        return {x, y}
    }

    collision() {

        let x = this.position.x
        let y = this.position.y

        let p1 = {x, y}

        let newx = this.width
        let newy = this.height/2

        let p2 = this.point_rotation(newx, newy)

        p2.x += this.position.x
        p2.y += this.position.y

        newy = -this.height/2

        let p3 = this.point_rotation(newx, newy)

        p3.x += this.position.x
        p3.y += this.position.y

        newx = 0
        newy = 0

        let p4 = this.point_rotation(newx, newy)

        p4.x += this.position.x
        p4.y += this.position.y

        let points = [p1, p2, p3, p4]
        console.log(points[0])
        return points
    }

    collision_checker(points) {
        for (let i = 0; i < points.length; ++i) {
            if (points[i].x >= canvas.width - 8 || points[i].y >= canvas.height - 10) {
                this.position.x = this.position.x - 2
                this.position.y = this.position.y - 2
                return true
            }
            else if (points[i].x <= 12 || points[i].y <= 10 ){
                this.position.x = this.position.x + 2
                this.position.y = this.position.y + 2
                return true
            }
        }
    }

    axis_corel() {
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

    angle_loop() {
        if (this.angle.alpha >= 361) {
            this.angle.alpha = 1
        }
        else if (this.angle.alpha <= -1) {
            this.angle.alpha = 359
        }
    }

    velocity_corel() {
        this.velocity.y = this.velocity.m * Math.abs(Math.cos((90-this.angle.alpha)*(Math.PI/180)))
        this.velocity.x = this.velocity.m * Math.abs(Math.cos(this.angle.alpha*(Math.PI/180)))
    }

    update() {
        console.log(this.key)
        this.angle_loop()
        this.draw()
        this.movement()
        this.points = this.collision()
        this.velocity_corel()
        this.collision_checker(this.points)
        this.axis_corel()
    }
}