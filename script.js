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


let bullets = [];


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
class Bullet{
    constructor(x,y,width,height,velocity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }
    draw(){
        tool.fillStyle = "white";
        tool.fillRect(this.x,this.y,this.width,this.height);

    }
}


startBtn.addEventListener("click",function(e){
e.stopImmediatePropagation();
    //alert("Start the game")
    box.style.display = "none";

    tool.fillRect(0,0,canvas.width,canvas.height);
    tool.drawImage(spaceImg,0,0,canvas.width,canvas.height);

    let eHight=40;
    let eWidth=40;
    let ePosX = canvas.width/2-20;
    let ePosY = canvas.height/2-20;
    let earth = new Plant(ePosX,ePosY,eWidth,eHight);

    earth.draw();
    window.addEventListener("click",function(e){
        /*console.log(e);
        console.log("mouse clocked");
        let bullet = new Bullet(e.clientX,e.clientY,7,7)
        bullet.draw();
        bullets.push(bullet)*/
    })

})