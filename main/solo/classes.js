let star_coord = []
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
    constructor({position, angle, velocity}, imageSrc) {
        this.position = position
        this.angle = angle
        this.velocity = velocity
        this.width = 25
        this.height = 16
        this.key = [0,0,0,0]
        this.points = []
        this.id = 1
        this.score = 0
        this.image = new Image()
        this.image.src = imageSrc
    }

    ouchHandler(e) {
        if (e == this.id) {
        this.velocity.m = -this.velocity.m
        }
    }

    collisionHandler(e, eid) {
        for (let i = 0; i < e.length; ++i){
        if (e[i].x >= this.points[i].x - 3 && e[i].x <= this.points[i].x + 3 && e[i].y >= this.points[i].y - 3 && e[i].y <= this.points[i].y + 3){
            this.velocity.m = -this.velocity.m
            window.dispatchEvent(new CustomEvent('ouch', {
                detail: {
                    id: eid
                }
            }))
        }
    }
}

    eventHandler(e) {
        if (e == this.id) {
            console.log(this.score)
            ++this.score
        }
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
            this.angle.alpha += 4
        }

        if (this.key[2] == 1){
            this.angle.alpha -= 4
        }


    }

    slowdown() {
        this.velocity.m *= 0.93
    }

    draw() {
        c.save();
        c.fillStyle = 'red'
        c.translate(this.position.x, this.position.y)
        c.rotate(this.angle.alpha * (Math.PI/180))
        c.drawImage(this.image, 0, -this.height/2)
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
        return points
    }

    collision_checker(points) {
        for (let i = 0; i < points.length; ++i) {
            if (points[i].x >= canvas.width - 8) {
                this.velocity.m = 0
                this.position.x = this.position.x - 2
                return true
            }
            else if (points[i].y >= canvas.height - 10) {
                this.velocity.m = 0
                this.position.y = this.position.y - 2
                return true
            }
            else if (points[i].x <= 12) {
                this.velocity.m = 0
                this.position.x = this.position.x + 2
                return true
            }
            else if (points[i].y <= 5) {
                this.velocity.m = 0
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
        this.angle_loop()
        this.draw()
        this.movement()
        this.points = this.collision()
        this.velocity_corel()
        this.collision_checker(this.points)
        this.axis_corel()
        window.dispatchEvent(new CustomEvent('my_points', {
            detail: {
                points: this.points,
                id: this.id
            }
        }))
    }
}

class Star {
    constructor({position}) {
        this.position = position
    }

    drawCircle(radius, fill, stroke, strokeWidth) {
        c.beginPath()
        c.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI, false)
        if (fill) {
          c.fillStyle = fill
          c.fill()
        }
        if (stroke) {
          c.lineWidth = strokeWidth
          c.strokeStyle = stroke
          c.stroke()
        }
      }

    eventHandler(e, id_e) {
        for (let i = 0; i < e.length; ++i){
            if (e[i].x >= this.position.x - 3 && e[i].x <= this.position.x + 28 && e[i].y >= this.position.y - 3 && e[i].y <= this.position.y + 28){
                window.dispatchEvent(new CustomEvent('got_it', {
                    detail: {
                        id: id_e
                    }
                }))
            }
        }
    }

    update() {
        this.drawCircle(5, 'green', 'green', 5)
        star.x = this.position.x
        star.y = this.position.y
    }
}

class Dummy {
    constructor({position, angle, velocity}, id, imageSrc) {
        this.position = position
        this.angle = angle
        this.velocity = velocity
        this.width = 25
        this.height = 16
        this.key = [0,0,0,0]
        this.points = []
        this.ai = []
        this.ip = id
        this.score = 0
        this.image = new Image()
        this.image.src = imageSrc
    }

    ouchHandler(e) {
        if (e == this.id) {
        this.velocity.m = -this.velocity.m
        }
    }

    collisionHandler(e, eid) {
        for (let i = 0; i < e.length; ++i){
        for (let j = 0; j < e.length; ++j){
        if (e[j].x >= this.points[i].x - 10 && e[j].x <= this.points[i].x+ 10 && e[j].y >= this.points[i].y - 10 && e[j].y <= this.points[i].y + 10){
            this.velocity.m = -this.velocity.m
            window.dispatchEvent(new CustomEvent('ouch', {
                detail: {
                    id: eid
                }
            }))
        }
    }
    }
}
    

    eventHandler(e) {
        if (e == this.id) {
            ++this.score
        }
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
            this.angle.alpha += 4
        }

        if (this.key[2] == 1){
            this.angle.alpha -= 4
        }


    }

    slowdown() {
        this.velocity.m *= 0.93
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y)
        c.rotate(this.angle.alpha * (Math.PI/180))
        c.drawImage(this.image, 0, -this.height/2)
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
        this.ai = [[p1.x, p1.y], [p2.x, p2.y], [p3.x, p3.y], [p4.x, p4.y]]
        let points = [p1, p2, p3, p4]
        return points
    }

    collision_checker(points) {
        for (let i = 0; i < points.length; ++i) {
            if (points[i].x >= canvas.width - 8) {
                this.velocity.m = 0
                this.position.x = this.position.x - 2
                return true
            }
            else if (points[i].y >= canvas.height - 10) {
                this.velocity.m = 0
                this.position.y = this.position.y - 2
                return true
            }
            else if (points[i].x <= 12) {
                this.velocity.m = 0
                this.position.x = this.position.x + 2
                return true
            }
            else if (points[i].y <= 5) {
                this.velocity.m = 0
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
        this.angle_loop()
        this.draw()
        this.movement()
        this.points = this.collision()
        this.velocity_corel()
        this.collision_checker(this.points)
        this.axis_corel()
        window.dispatchEvent(new CustomEvent('my_points', {
            detail: {
                points: this.points,
                id: this.id
            }
        }))
    }
}
