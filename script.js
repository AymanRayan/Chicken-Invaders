// Select canvas
let yourScore = document.getElementById("playerScore");
let theHightScore = document.getElementById("heightScore")
let audio = document.getElementById("chicksound")

let canv = document.getElementById("canvas")
let gameArea = canv.getContext("2d")
canv.width = 800
canv.height = 600
let keys =
{
    up: false,
    left: false,
    down: false,
    right: false,
    mouse: false
}

const rocktImg = new Image()
rocktImg.src = "./assets/rocket.png"

//create the rocket class
class Rocket {
    constructor() {
        this.position = {
            x: 250,
            y: 500
        }
        this.speed = {
            x: 0,
            y: 0
        }
        this.width = 60
        this.height = 60
        this.image = rocktImg
    }
    draw() {
        //gameArea.fillStyle = "blue"
        //gameArea.fillRect(this.position.x, this.position.y, this.width, this.height)
        gameArea.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}

//create the bullet class
class Bullet {
    constructor({ position, speed }) {
        this.position = position
        this.speed = speed
        this.radius1 = 1.5
        this.radius = 3
    }
    draw() {
        gameArea.beginPath()
        gameArea.ellipse(this.position.x, this.position.y, this.radius, this.radius1, Math.PI / 2, 0, 2 * Math.PI)
        /*gameArea.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)*/
        gameArea.fillStyle = "red"
        gameArea.fill()
        gameArea.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}


const chickImg = new Image()
chickImg.src = "./assets/chick.png"

//create the Chick
class Chick {
    constructor() {
        this.position = {
            x: 300,
            y: 100
        }
        this.speed = {
            x: 2,
            y: -2
        }
        this.width = 100
        this.height = 100
        this.image = chickImg
    }
    draw() {
        //gameArea.fillStyle = "orange"
        //gameArea.fillRect(this.position.x, this.position.y, this.width, this.height)
        gameArea.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        if (this.position.x + this.width >= canv.width || this.position.x <= 0) {
            this.speed.x = -this.speed.x

        }
        if (this.position.y + this.height >= canv.height || this.position.y <= 0) {
            this.speed.y = -this.speed.y
        }
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}

//create the eggs
class Egg {
    constructor({ position, speed }) {
        this.position = position
        this.speed = speed

        this.radius = 6
        this.radius1 = 4
    }
    draw() {
        gameArea.beginPath()
        gameArea.ellipse(this.position.x, this.position.y, this.radius, this.radius1, Math.PI / 2, 0, 2 * Math.PI)
        /*gameArea.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)*/
        gameArea.fillStyle = "white"
        gameArea.fill()
        gameArea.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}

let theRocket = new Rocket()
let bullets = []
let theChick = new Chick()
let eggs = []
let count = 0
let playerScore = 30
let highScore = 0
const spaceImg = new Image()
spaceImg.src = "./assets/space.jpg"


function animate() {
    requestAnimationFrame(animate)
    //color the background
    gameArea.fillStyle = "black"
    /*gameArea.fillRect(0, 0, canv.width, canv.height)*/
    gameArea.drawImage(spaceImg, 0, 0, canv.width, canv.height)
    //call the update of rocket
    theRocket.update()
    //call the chick
    theChick.update()
    playerBoard()
    //clash logic
    if (
        (theRocket.position.x >= theChick.position.x
            && theRocket.position.x <= theChick.position.x + theChick.width
            && theRocket.position.y >= theChick.position.y
            && theRocket.position.y <= theChick.position.y + theChick.height)
        || (theRocket.position.x + theRocket.width <= theChick.position.x
            && theRocket.position.x + theRocket.width >= theChick.position.x + theChick.width
            && theRocket.position.y + theRocket.height <= theChick.position.y
            && theRocket.position.y + theRocket.height >= theChick.position.y + theChick.height)
    ) {
        alert("Game Over")
        reset()
    }

    //update eggs
    eggs.forEach((egg, index) => {
        if (egg.position.y + egg.radius >= canv.height) {
            eggs.splice(index, 1)
        } else {
            egg.update()
        }

        //game over logic
        if (
            egg.position.y >= theRocket.position.y
            && egg.position.y <= theRocket.position.y + theRocket.height
            && egg.position.x >= theRocket.position.x
            && egg.position.x <= theRocket.position.x + theRocket.width
        ) {
            playerScore -= 10
            alert("Try Again")
            if (playerScore < 0) {
                playerScore = 0;
                alert("Game Over!!! You Have Lost Gedddan")
            }
            reset()
        }
    })
    //loop on bullets to update positions
    bullets.forEach((bullet, index) => {
        if (bullet.position.y + bullet.radius <= 0) {
            bullets.splice(index, 1)
        } else {
            bullet.update()
        }
        //winner logic
        if (
            bullet.position.y >= theChick.position.y
            && bullet.position.y <= theChick.position.y + theChick.height
            && bullet.position.y + bullet.radius >= theChick.position.y
            && bullet.position.y + bullet.radius <= theChick.position.y + theChick.height
            && bullet.position.x >= theChick.position.x
            && bullet.position.x <= theChick.position.x + theChick.width
            && bullet.position.x + bullet.radius >= theChick.position.x
            && bullet.position.x + bullet.radius <= theChick.position.x + theChick.width
        ) {
            bullets.splice(index, 1)
            audio.play()
            count++
            if (count > 5) {
                playerScore += 10
                playerBoard()
                audio.pause()
                alert("congratulation You Kill the chick")
                reset()
            }
        }

    })
    //handling the keyboard controlles for the rocket
    if (keys.right && theRocket.position.x + theRocket.width <= canv.width) {
        theRocket.speed.x = 5
    } else if (keys.down && theRocket.position.y + theRocket.height <= canv.height) {
        theRocket.speed.y = 5
    } else if (keys.left && theRocket.position.x >= 0) {
        theRocket.speed.x = -5
    } else if (keys.up && theRocket.position.y >= 0) {
        theRocket.speed.y = -5
    }
    else {
        theRocket.speed.y = 0
        theRocket.speed.x = 0
    }
}
animate()
//shooting
function shoot() {
    eggs.push(
        new Egg({
            position: {
                x: theChick.position.x + theChick.width / 2,
                y: theChick.position.y + theChick.height
            },
            speed: {
                x: 0,
                y: 0.5
            }
        })
    )
}
setInterval(shoot, 1000);
//attacking
function attack() {
    bullets.push(
        new Bullet({
            position: {
                x: theRocket.position.x + theRocket.width / 2,
                y: theRocket.position.y
            },
            speed: {
                x: 0,
                y: -5
            }
        })
    )
}


//begin again
function reset() {
    theRocket.position.x = 250
    theRocket.position.y = 500
    theRocket.speed.x = 0
    theRocket.speed.y = 0
    theChick.position.x = Math.floor(Math.random() * 300) + 1
    theChick.position.y = Math.floor(Math.random() * 100) + 1
    bullets = []
    eggs = []
    count = 0
    keys = {
        up: false,
        left: false,
        down: false,
        right: false,
        mouse: false
    }
}

//move the rocket keyboard
document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 38:
            keys.up = true
            break
        case 37:
            keys.left = true
            break
        case 39:
            keys.right = true
            break
        case 40:
            keys.down = true
            break
        case 32:
            attack()
            break
    }
})
document.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
        case 38:
            theRocket.speed.y = 0
            keys.up = false
            break
        case 37:
            theRocket.speed.x = 0
            keys.left = false
            break
        case 39:
            theRocket.speed.x = 0
            keys.right = false
            break
        case 40:
            theRocket.speed.y = 0
            keys.down = false
            break
        case 32:
            /*console.log(bullets)*/
            break
    }
})

//move the rocket mouse
//document.addEventListener("mousedown", (e) => {
//    let relativex = e.clientX - canv.offsetLeft
//    let relativey = e.clientY - canv.offsetTop
//    if (relativex > 0 && relativex < canv.width && relativey > 0 && relativey < canv.height) {
//        attack()
//    }
//})
//document.addEventListener("mousemove", (e) => {
//    let relativex = e.clientX - canv.offsetLeft
//    let relativey = e.clientY - canv.offsetTop
//    if (relativex > 0 && relativex < canv.width && theRocket.position.x + theRocket.width <= canv.width) {
//        theRocket.position.x = relativex
//    }
//    if (relativey > 0 && relativey < canv.height && theRocket.position.y + theRocket.height <= canv.height) {
//        theRocket.position.y = relativey
//    }
//})


//update playerBoard

function playerBoard() {
    yourScore.innerHTML = playerScore
    if (!localStorage.getItem("Hight Score") || playerScore > localStorage.getItem("Hight Score")) {
        localStorage.setItem("Hight Score", playerScore)
    }
    theHightScore.innerHTML = localStorage.getItem("Hight Score")
}