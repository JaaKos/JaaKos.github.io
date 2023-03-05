window.addEventListener('load', ()=>{
    let score = 0;
    let timeleft = 10;
    let timervar;
    let button = document.getElementById("start");
    button.addEventListener("click", startgame);
    gameStarted = false;
    document.getElementById("score").innerHTML = score;
    document.getElementById("time").innerHTML = timeleft;

    const canvas = document.querySelector("#canvasid");
    const ctx = canvas.getContext("2d");
    canvas.height = 720;
    canvas.width = 1366;

    ctx.fillStyle = "black";

    let circles = [];

    function randomPosition()
    {
        return [Math.abs(Math.random()*canvas.width-100)+50, Math.abs(Math.random()*canvas.height-100)+50];
    }

    function drawCircles()
    {
        for (let i = 0; i < 5; i++)
        {
            ctx.beginPath();
            ctx.arc(circles[i][0], circles[i][1], 25, 0, 2 * Math.PI);
            ctx.fill();
        }
    }


    function timer()
    {
        timeleft = timeleft-0.1;
        document.getElementById("time").innerHTML = timeleft.toPrecision(2);
        if (timeleft < 0.1)
        {
            gameStarted = false;
            document.getElementById("time").innerHTML = 0;
            clearInterval(timervar);
        } 
    }  

    function startgame()
    {
        clearInterval(timervar);
        timeleft = 10;
        gameStarted = true;
        circles = [];
        for (let i = 0; i < 5; i++)
        {
            circles.push(randomPosition());
        }
        score = 0;
        timervar = setInterval(() => {
            timer();
        }, 100);
        canvas.height = canvas.height;
        canvas.width = canvas.width;
        ctx.clearRect(0,0, canvas.height, canvas.width);
        drawCircles();
    }

    onmousedown = function(e)
    {
        if (gameStarted)
        {
        canvas.height = canvas.height;
        canvas.width = canvas.width;
        for (let i = 0; i < 5; i++)
        {
            if (Math.hypot(e.x-circles[i][0]-10, e.y-circles[i][1]-10) < 26)
            {
                score++;
                document.getElementById("score").innerHTML = score;
                circles[i] = randomPosition();
                break;
            } 
        }
        ctx.clearRect(0,0, canvas.height, canvas.width);
        drawCircles();
        }
    };
})

function startgame()
{
    gameStarted = true;
    timeleft = 10;
    score = 0;
    clearInterval(timervar);
    timervar;
}
