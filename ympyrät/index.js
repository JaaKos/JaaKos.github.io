window.addEventListener('load', ()=>{
    let elapsedTime = Date.now();
    let timeStamp = 0;
    let stopped = true;
    let score = 0;
    let timeleft = 10;
    let timervar;
    let pausetimer = true;
    let button = document.getElementById("start");
    button.addEventListener("click", startgame);
    gameStarted = false;
    document.getElementById("score").innerHTML = score;
    document.getElementById("time").innerHTML = timeleft;
    let animationframe = null;
    let start;
    let scaleValue;

    const canvas = document.querySelector("#canvasid");
    const ctx = canvas.getContext("2d");

    if (window.devicePixelRatio !== 1){
        scaleValue = (1/window.devicePixelRatio);
        ctx.canvas.width *= scaleValue;
        ctx.canvas.height *= scaleValue;
    }
    else {
        scaleValue = 1;
    }
    
    let circles = [];

    function randomPosition()
    {
        return [Math.abs(Math.random()*canvas.width-100)+50, Math.abs(Math.random()*canvas.height-100)+50, (Math.random()-0.5)*4, (Math.random()-0.5)*4];
    }

    function drawCircles()
    {
        elapsedTime = Date.now()-timeStamp;
        timeStamp = Date.now();
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        for (let i = 0; i < 5; i++)
        {
            ctx.lineWidth = 10*scaleValue;
            ctx.beginPath();
            ctx.arc(circles[i][0], circles[i][1], 25*scaleValue, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            if (circles[i][0] < 25 || circles[i][0] > canvas.width-25) circles[i][2] *= -1;
            if (circles[i][1] < 25 || circles[i][1] > canvas.height-25) circles[i][3] *= -1;
            for (let j = 0; j < 5; j++)
            {
                if (j != i && Math.hypot(circles[i][0]-circles[j][0], circles[i][1]-circles[j][1]) < 51)
                {
                    let nx = (circles[j][0] - circles[i][0]) / Math.hypot(circles[i][0]-circles[j][0], circles[i][1]-circles[j][1]);
                    let ny = (circles[j][1] - circles[i][1]) / Math.hypot(circles[i][0]-circles[j][0], circles[i][1]-circles[j][1]); 
                    let p = 2 * (circles[i][2] * nx + circles[i][3] * ny - circles[j][2] * nx - circles[j][3] * ny) / 2;
                    circles[i][2] = circles[i][2] - p * nx; 
                    circles[i][3] = circles[i][3] - p * ny; 
                    circles[j][2] = circles[j][2] + p * nx; 
                    circles[j][3] = circles[j][3] + p * ny;
                } 
            }
            if (!stopped)
            {
                circles[i][0] += circles[i][2]*(elapsedTime/7)*scaleValue;
                circles[i][1] += circles[i][3]*(elapsedTime/7)*scaleValue;
            }
        }
        animationframe = requestAnimationFrame(drawCircles);
    }


    function timer()
    {
        if (!pausetimer)
        {
            timeleft = (10000-(Date.now()-start))/1000;
            document.getElementById("time").innerHTML = timeleft.toPrecision(2);
            if (timeleft < 0.1)
            {
                gameStarted = false;
                stopped = true;
                document.getElementById("time").innerHTML = 0;
                clearInterval(timervar);
            } 
        }
    }  

    function startgame()
    {
        pausetimer = true;
        stopped = true;
        cancelAnimationFrame(animationframe);
        let goodFlag;
        do
        {
            circles = [];
            goodFlag = true;
            for (let i = 0; i < 5; i++)
            {
                circles.push(randomPosition());
            }
            for (let i = 0; i < 5; i++)
            {
                for (let j = 0; j < 5; j++)
                {
                    if (j != i && Math.hypot(circles[i][0]-circles[j][0], circles[i][1]-circles[j][1]) < 51) goodFlag = false;
                }
            }
        }while (!goodFlag);
        clearInterval(timervar);
        timeleft = 10;
        gameStarted = true;
        score = 0;
        document.getElementById("score").innerHTML = score;
        document.getElementById("time").innerHTML = timeleft;
        timervar = setInterval(() => {
            timer();
        }, 15);
        ctx.clearRect(0,0, canvas.width, canvas.height);
        drawCircles();
    }

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }

    onmousedown = function(e)
    {
        let pos = getMousePos(canvas, e);
        if (pos.x < 0 || pos.x > canvas.width) return;
        if (pos.y < 0 || pos.y > canvas.height) return;
        if (gameStarted)
        {
        if (stopped) start = Date.now();
        pausetimer = false;
        stopped = false;
        for (let i = 0; i < 5; i++)
        {
            if (Math.hypot(pos.x-circles[i][0], pos.y-circles[i][1]) < 26*scaleValue)
            {
                score++;
                document.getElementById("score").innerHTML = score;
                let goodFlag;
                do
                {
                    goodFlag = true;
                    circles[i] = randomPosition();
                    for (let j = 0; j < 5; j++)
                    {
                        if (j != i && Math.hypot(circles[i][0]-circles[j][0], circles[i][1]-circles[j][1]) < 51) goodFlag = false;
                    }
                } while (!goodFlag)
                break;
            } 
        }
        }
    };
})