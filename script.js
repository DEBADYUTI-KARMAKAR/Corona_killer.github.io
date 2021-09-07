// yha page se jo element chaiye honge wo saare select kar rhe hai 
const canvas = document.querySelector(".board");
const scoreElem = document.querySelector("span");
const startGame = document.querySelector(".start");
const box = document.querySelector(".box");
const powerLevelElem = document.querySelector(".meter span");

const restartBtn = document.querySelector(".restart");
const tool = canvas.getContext("2d");

const spaceImg = new Image();
const earth = new Image();
const corona = new Image();
spaceImg.src = "space.jpg";
earth.src = "earth.png";
corona.src = "corona.png";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let Bullets = [];
let particles = [];
let enemies = [];
let score = 0;
let fullPower = 100;

class Planet {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        tool.beginPath();
        tool.drawImage(earth, this.x, this.y, this.width, this.height);
    }
}
let rectWidth = window.innerWidth / 18;
let rectHeight = window.innerHeight / 10;

const xPos = (canvas.width / 2) - (rectWidth / 2);
const yPos = (canvas.height / 2) - (rectHeight / 2);
const planet = new Planet(xPos, yPos, rectWidth, rectHeight);
// corona
class Enemy {
    constructor(x, y, width, height, velocity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
        this.velocity = velocity;
    }
    draw() {
        tool.beginPath();
        tool.drawImage(corona, this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
class Bullet {
    constructor(x, y, width, height, color, velocity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        tool.beginPath();
        tool.fillStyle = this.color;
        tool.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        tool.save();
        tool.globalAlpha = this.alpha;
        tool.beginPath();
        tool.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        tool.fillStyle = this.color;
        tool.fill();
        tool.restore();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

function spawnEnemies() {
    setInterval(() => {
        const delta = 30;
        
        let x;
        let y;
        
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? delta : canvas.width + delta * 2;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? delta : canvas.height + delta * 2;
        }
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, 40, 40, velocity));
    }, 1000);
}
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.drawImage(spaceImg, 0, 0, canvas.width, canvas.height);
    planet.draw();
    
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
    
    Bullets.forEach((Bullet, index) => {
        Bullet.update();
        
        if (Bullet.x - Bullet.width < 0
            || Bullet.x - Bullet.width > canvas.width
            || Bullet.y + Bullet.width < 0 ||
            Bullet.y - Bullet.width > canvas.height
        ) {
            setTimeout(() => {
                Bullets.splice(index, 1);
            })
        }
    })
   
    enemies.forEach((enemy, index) => {
        enemy.update();
        
        if (collisonRec(planet.x, planet.y, planet.width, planet.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
            fullPower -= 20;
            powerLevelElem.style.width = `${fullPower}%`;
            enemies.splice(index, 1);
            if (!fullPower) {
                console.log("end game");
               
                cancelAnimationFrame(animationId)
                restart()
            }
        }
       
        Bullets.forEach((Bullet, BulletIndex) => {
            
            if (collisonRec(enemy.x, enemy.y, enemy.width, enemy.height, Bullet.x, Bullet.y, Bullet.width, Bullet.height)) {
                
                for (let i = 0; i < enemy.width * 2; i++) {
                    particles.push(new Particle(Bullet.x, Bullet.y, Math.random() * 2, "white", {
                        x: (Math.random() - 0.5) * Math.random() * 6,
                        y: (Math.random() - 0.5) * Math.random() * 6
                    }))
                }

                setTimeout(() => {
                    enemies.splice(index, 1);
                    score += 10;
                    scoreElem.innerText = score;
                    Bullets.splice(BulletIndex, 1);
                }, 0)
            } else {
            }
        })
    })
}
function init() {
    
    animate();
    spawnEnemies();
    
    addEventListener('click', (event) => {
        const angle = Math.atan2(event.clientY - canvas.height / 2
            , event.clientX - canvas.width / 2)
        const velocity = {
            x: Math.cos(angle) * 4.5,
            y: Math.sin(angle) * 4.5
        }
        Bullets.push(new Bullet(canvas.width / 2, canvas.height / 2, 8, 8, 'white', velocity))
    })
}
startGame.addEventListener("click", function () {
    box.style.display = "none";
    init();
})

window.addEventListener("resize", function () {
    window.location.reload();
})
function collisonRec(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    if (r1x + r1w >= r2x && r1x <= r2x + r2w && r1y + r1h >= r2y && r1y <= r2y + r2h) {
        return true
    }
    return false;
}
function restart() {
    restartBtn.style.display = "block";
    startGame.style.display="none";
    box.style.display = "block";
    canvas.height="0px";
    document.body.style.backgroundColor="white";
    powerLevelElem.parentElement.style.display="none";
    restartBtn.addEventListener("click", function () {
document.location.reload();
    })
}