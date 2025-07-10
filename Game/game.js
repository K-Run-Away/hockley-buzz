const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

// Load bird image
const birdImage = new Image();
let imageLoaded = false;
birdImage.onload = () => {
    imageLoaded = true;
    // Start the game once the image is loaded
    initGame();
    gameLoop();
};
birdImage.onerror = () => {
    console.error('Error loading bird image');
    imageLoaded = false;
    // Start the game anyway, will use fallback rectangle
    initGame();
    gameLoop();
};
birdImage.src = 'bird.png';

// Set canvas size to match container
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();

// Game variables
let bird;
let obstacles;
let score;
let gameOver;

// Initialize game state
function initGame() {
    bird = {
        x: 150,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        velocity: 0,
        gravity: 0.3,
        jumpForce: -8
    };

    obstacles = [];
    score = 0;
    gameOver = false;
    scoreElement.textContent = '0';
    createObstacle();
}

const obstacleWidth = 60;
const gapHeight = 250;
const obstacleSpeed = 1.5;

// Add event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            initGame();
            gameLoop();
        } else {
            bird.velocity = bird.jumpForce;
        }
        e.preventDefault();
    }
});

// Create obstacle
function createObstacle() {
    const gapPosition = Math.random() * (canvas.height - gapHeight);
    obstacles.push({
        x: canvas.width,
        gapTop: gapPosition,
        gapBottom: gapPosition + gapHeight,
        passed: false
    });
}

// Check collision
function checkCollision(bird, obstacle) {
    return (
        bird.x + bird.width > obstacle.x &&
        bird.x < obstacle.x + obstacleWidth &&
        (bird.y < obstacle.gapTop || bird.y + bird.height > obstacle.gapBottom)
    );
}

// Draw the bird
function drawBird() {
    if (imageLoaded) {
        // Draw image if loaded
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    } else {
        // Draw pink rectangle
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        
        // Add text "Simone"
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Simone', bird.x + bird.width/2, bird.y + bird.height/2 + 6);
    }
}

// Game loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw bird
    drawBird();

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= obstacleSpeed;

        // Draw obstacles
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.gapTop);
        ctx.fillRect(
            obstacle.x,
            obstacle.gapBottom,
            obstacleWidth,
            canvas.height - obstacle.gapBottom
        );

        // Check collision
        if (checkCollision(bird, obstacle)) {
            gameOver = true;
        }

        // Update score
        if (!obstacle.passed && bird.x > obstacle.x + obstacleWidth) {
            score++;
            scoreElement.textContent = score;
            obstacle.passed = true;
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Create new obstacles
    if (obstacles[obstacles.length - 1].x < canvas.width - 300) {
        createObstacle();
    }

    // Check boundaries
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver = true;
    }

    requestAnimationFrame(gameLoop);
}

// Don't start the game immediately - it will start after image loads or fails to load 