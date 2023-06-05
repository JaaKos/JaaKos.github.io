let timestamp = Date.now();
let elapsedTime = 0;
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let vastustajanMaalit = 0;
document.getElementById("vastustajanMaalit").innerHTML = vastustajanMaalit;
let pelaajanMaalit = 0;
document.getElementById("pelaajanMaalit").innerHTML = pelaajanMaalit;
let scaleValue;

if (window.devicePixelRatio !== 1){
    scaleValue = (1/window.devicePixelRatio);
    ctx.canvas.width *= scaleValue;
    ctx.canvas.height *= scaleValue;
}
else {
    scaleValue = 1;
}

class esine
{
    constructor(xpos, ypos, radius, color)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.speed = {x:0, y:0}
    }
    setPos(xpos, ypos)
    {
        if (xpos < this.radius) xpos = this.radius;
        if (xpos > canvas.width-this.radius) xpos = canvas.width-this.radius;
        if (ypos < this.radius) ypos = this.radius; 
        if (ypos > canvas.height-this.radius) ypos = canvas.height-this.radius;
        this.xpos = xpos;
        this.ypos = ypos;
    }

    setSpeed(speed)
    {
        this.speed = speed;
    }

    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.lineWidth = 5*scaleValue;
        ctx.beginPath();
        ctx.arc(this.xpos, this.ypos, this.radius*scaleValue, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.fill();
    }
}

class ohjattava extends esine 
{
    updateStatus()
    {
        onmousemove = (e) =>
        {
            //let previousFramePos = {x:this.xpos, y:this.ypos};
            let pos = getMousePos(canvas, e);
            if (pos.x < 25 || pos.x > canvas.width-this.radius)
            {
                //super.setSpeed({x:0, y:0});
                return;
            } 
            if (pos.y < 25 || pos.y > canvas.height-this.radius) 
            {
                //super.setSpeed({x:0, y:0});
                return;
            } 
            super.setPos(pos.x, pos.y);
            //let speed = {x:this.xpos - previousFramePos.x, y:this.ypos - previousFramePos.y};
            //super.setSpeed(speed);
        }
    }
}

class vastustaja extends esine
{
    updateStatus()
    {
        if (Math.abs(this.xpos - pelivaline.xpos) < 1) return;
        if (Math.abs(this.xpos - pelivaline.xpos) < 10)
        {
            if (this.xpos - pelivaline.xpos > 0) this.xpos -= 1 * (elapsedTime/7)*scaleValue;
            else this.xpos += 1 * (elapsedTime/7)*scaleValue;
        } 
        else if (Math.abs(this.xpos - pelivaline.xpos) < 30) 
        {
            if (this.xpos - pelivaline.xpos > 0) this.xpos -= 5 * (elapsedTime/7)*scaleValue;
            else this.xpos += 5 * (elapsedTime/7) *scaleValue;
        }
        else 
        {
            if (this.xpos - pelivaline.xpos > 0) this.xpos -= 9 * (elapsedTime/7)*scaleValue;
            else this.xpos += 9 * (elapsedTime/7)*scaleValue;
        }
    }
}

class kiekko extends esine
{
    updateStatus()
    {
        super.setPos(this.xpos+=this.speed.x*(elapsedTime/7), this.ypos+=this.speed.y*(elapsedTime/7));
        if (this.xpos < this.radius + 1 || this.xpos > canvas.width-this.radius-1) this.speed.x *= -1;
        if (this.ypos < this.radius + 1 || this.ypos > canvas.height-this.radius-1) this.speed.y *= -1;
        for (let i = 0; i < ohjaimet.length; i++)
        {
            let distance = Math.hypot(this.xpos-ohjaimet[i].xpos, this.ypos-ohjaimet[i].ypos);
            if (distance < this.radius + ohjaimet[i].radius)
            {
                let collisionAngle = Math.atan2(this.ypos-ohjaimet[i].ypos, this.xpos-ohjaimet[i].xpos);
                this.speed.x = Math.cos(collisionAngle)*10;
                this.speed.y = Math.sin(collisionAngle)*10;
                super.setPos(this.xpos+=Math.cos(collisionAngle)*(ohjaimet[i].radius-this.radius), this.ypos+=Math.sin(collisionAngle)*(ohjaimet[i].radius-this.radius));
            }
        }
    }
}

class maali
{
    constructor(xpos,ypos,vastustajanMaali)
    {
        this.status = vastustajanMaali;
        this.xpos = xpos;
        this.ypos = ypos;
        this.xpos2 = xpos + 180;
        this.ypos2 = ypos + 40;
    }
    updateStatus()
    {
        if (pelivaline.xpos > this.xpos && pelivaline.xpos < this.xpos2 && pelivaline.ypos > this.ypos && pelivaline.ypos < this.ypos2)
        {
            if (!this.status) vastustajanMaalit++;
            if (this.status) pelaajanMaalit++;
            pelivaline.setSpeed({x:0, y:0});
            pelivaline.setPos(canvas.width/2, canvas.height/2);
            document.getElementById("pelaajanMaalit").innerHTML = pelaajanMaalit;
            document.getElementById("vastustajanMaalit").innerHTML = vastustajanMaalit;
        }
    }
    draw(ctx)
    {
        ctx.beginPath();
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.xpos, this.ypos, 180*scaleValue, 40*scaleValue);
    }
}

function getMousePos(canvas, evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function drawFrame()
{
    elapsedTime = Date.now()-timestamp;
    timestamp = Date.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < maalit.length; i++)
    {
        maalit[i].updateStatus();
        maalit[i].draw(ctx);
    }
    for (let i = 0; i < ohjaimet.length; i++)
    {
        ohjaimet[i].updateStatus();
        ohjaimet[i].draw(ctx);
    }
    pelivaline.updateStatus();
    pelivaline.draw(ctx);

    requestAnimationFrame(drawFrame);
}

let ohjaimet = [new ohjattava(300, 700, 25, "red"), new vastustaja(300, 100, 25, "green")];
let maalit = [new maali(canvas.width/2-90, canvas.height-40, 0), new maali(canvas.width/2-90, 0, 1)]
const pelivaline = new kiekko(canvas.width/2, canvas.height/2, 20, "black");
drawFrame();