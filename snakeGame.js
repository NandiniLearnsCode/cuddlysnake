const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d;
document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

let speed = 200; // Initial speed
let score = 0;   // Initial score
let foodEaten = 0; // Counter for food eaten

const gameTune = document.getElementById('gameTune');
gameTune.play();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        score++;
        foodEaten++;
        speed = Math.max(50, speed - 10); // Increase speed
        clearInterval(game);
        game = setInterval(draw, speed);

        if (foodEaten % 3 === 0) {
            generateMathProblem();
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with walls
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        clearInterval(game);
        gameTune.pause();
        alert(`Game Over! Your score is ${score}`);
        return;
    }

    // Check for collision with snake's body
    if (collision(newHead, snake)) {
        clearInterval(game);
        gameTune.pause();
        alert(`Game Over! Your score is ${score}`);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function generateMathProblem() {
    const mathProblemDiv = document.getElementById('math-problem');
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const answer = num1 + num2;
    mathProblemDiv.innerHTML = `Solve: ${num1} + ${num2} = ?`;

    const userAnswer = prompt(`Solve: ${num1} + ${num2} = ?`);
    if (parseInt(userAnswer) !== answer) {
        clearInterval(game);
        gameTune.pause();
        alert(`Wrong Answer! Game Over! Your score is ${score}`);
    }

    mathProblemDiv.innerHTML = '';
}

let game = setInterval(draw, speed);

