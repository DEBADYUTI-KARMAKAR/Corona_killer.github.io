let startBtn = document.querySelector(".start");
let box = document.querySelector(".box");
let canvas = document.querySelector(".board");
let tool = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width =window.innerWidth;


let spaceImg = new Image();
spaceImg.src= "space.jpg";
let earthImg = new Image();
earthImg.src= "earth.png";
let coronaImg = new Image();
coronaImg.src= "corona.png";

let eHight=40;
let eWidth=40;
let ePosX = canvas.width/2-20;
let ePosY = canvas.height/2-20;


class Bullet{
    constructor(x,y,width,height,velocity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity =  velocity;


    }
    draw(){
        tool.fillStyle = "gold";
        tool.fillRect(this.x,this.y,this.width,this.height);

    }
    update(){
        this.draw();
        this.x = this.x+this.velocity.x;
        this.y= this.y+ this.velocity.y;
    }
}

class Corona{
    constructor(x,y,width,height,velocity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity =  velocity;


    }
    draw(){
        //tool.fillStyle = "gold";
        tool.drawImage(coronaImg ,this.x,this.y,this.width,this.height);

    }
    update(){
        this.draw();
        this.x = this.x+this.velocity.x;
        this.y= this.y+ this.velocity.y;
    }
}


let bullets = [];
let coronas = [];


class Plant {
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }
    draw(){

        tool.drawImage(earthImg,this.x,this.y,this.width,this.height);
    }
}


function animate(){
    tool.clearRect(0,0,canvas.width,canvas.height);
    tool.fillRect(0,0,canvas.width,canvas.height);
    tool.drawImage(spaceImg,0,0,canvas.width,canvas.height);

    let earth = new Plant(ePosX,ePosY,eWidth,eHight);

    earth.draw();
    let bLength = bullets.length;
    for(let i=0;i<bLength;i++){
        bullets[i].update();
        if(bullets[i].x<0 || bullets[i].y<0 || bullets[i].x>canvas.width || bullets[i].y>canvas.height){
            setTimeout(function(){

                bullets.splice(i,1);
            })
        }
    }
    let cLength = coronas.length;
    for(let i=0;i<cLength;i++){
        coronas[i].update();
        
        
    }
    
    requestAnimationFrame(animate);
}

function createCorona(){
    setInterval(function(){
        let x= Math.random()*canvas.width;
        let y=Math.random()*canvas.height;
        let angle = Math.atan2(canvas.height/2-y, canvas.width/2-x);
        let velocity ={
            x:Math.cos(angle)*3,
            y:Math.sin(angle)*3

        }
        let corona = new Corona(x,y,25,25,velocity);
        coronas.push(corona);
    },1000)
}
startBtn.addEventListener("click",function(e){
e.stopImmediatePropagation();
    //alert("Start the game")
    box.style.display = "none";

    
    animate()
    createCorona();
    window.addEventListener("click",function(e){
        console.log(e);
        console.log("mouse clocked");
        let angle = Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
        let velocity ={
            x:Math.cos(angle)*3,
            y:Math.sin(angle)*3

        }
        let bullet = new Bullet(canvas.width/2,canvas.height/2,7,7,velocity)
        bullet.draw();
        bullets.push(bullet)
    })

})