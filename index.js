window.addEventListener('load', ()=>{
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

    const canvas = document.querySelector("#canvasid");
    const ctx = canvas.getContext("2d");
    canvas.height = 720;
    canvas.width = 1366;
    
    let circles = [];

    function randomPosition()
    {
        return [Math.abs(Math.random()*canvas.width-100)+50, Math.abs(Math.random()*canvas.height-100)+50, (Math.random()-0.5)*4, (Math.random()-0.5)*4];
    }

    function drawCircles()
    {
        canvas.height = canvas.height;
        canvas.width = canvas.width;
        ctx.clearRect(0,0, canvas.height, canvas.width);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        for (let i = 0; i < 5; i++)
        {
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(circles[i][0], circles[i][1], 25, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            if (circles[i][0] < 25 || circles[i][0] > canvas.width-25) circles[i][2] *= -1;
            if (circles[i][1] < 25 || circles[i][1] > canvas.height-25) circles[i][3] *= -1;
            if (!stopped)
            {
                circles[i][0] += circles[i][2];
                circles[i][1] += circles[i][3];
            }
        }
        animationframe = requestAnimationFrame(drawCircles);
    }


    function timer()
    {
        if (!pausetimer)
        {
            timeleft = timeleft-0.015;
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
        circles = [];
        for (let i = 0; i < 5; i++)
        {
            circles.push(randomPosition());
        }
        clearInterval(timervar);
        timeleft = 10;
        gameStarted = true;
        score = 0;
        timervar = setInterval(() => {
            timer();
        }, 15);
        canvas.height = canvas.height;
        canvas.width = canvas.width;
        ctx.clearRect(0,0, canvas.height, canvas.width);
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
        if (gameStarted)
        {
        pausetimer = false;
        stopped = false;
        let pos = getMousePos(canvas, e);
        for (let i = 0; i < 5; i++)
        {
            if (Math.hypot(pos.x-circles[i][0]-10, pos.y-circles[i][1]-10) < 26)
            {
                score++;
                document.getElementById("score").innerHTML = score;
                circles[i] = randomPosition();
                break;
            } 
        }
        }
    };
})