const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Update track properties to match the image
const track = {
    outerPoints: [
        {x: 0.1, y: 0.2},  // Start of first turn
        {x: 0.4, y: 0.2},  // First straight
        {x: 0.5, y: 0.3},  // Into S curve
        {x: 0.5, y: 0.5},  // Middle of S
        {x: 0.4, y: 0.6},  // Out of S
        {x: 0.2, y: 0.6},  // Bottom straight
        {x: 0.1, y: 0.7},  // Final curve
        {x: 0.1, y: 0.4}   // Back to start
    ],
    innerPoints: [
        {x: 0.15, y: 0.25},
        {x: 0.35, y: 0.25},
        {x: 0.45, y: 0.35},
        {x: 0.45, y: 0.5},
        {x: 0.35, y: 0.55},
        {x: 0.2, y: 0.55},
        {x: 0.15, y: 0.65},
        {x: 0.15, y: 0.4}
    ],
    trackWidth: 100
};

// At the top of the file, add image loading
const carImage = new Image();
carImage.src = 'assets/Screenshot 2025-03-09 at 12.24.05';

let gameState = 'loading'; // Add 'loading' state
let imagesLoaded = 0;
const requiredImages = 1;

function startGame() {
    // Initialize everything once images are loaded
    initializeCoins();
    gameState = 'countdown';
    lastCountdownTime = Date.now();
    gameLoop();
}

function handleImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === requiredImages) {
        startGame();
    }
}

function handleImageError() {
    console.error('Error loading car image');
    // Fallback to colored rectangles if images fail to load
    startGame();
}

// Set up image loading
carImage.onload = handleImageLoad;
carImage.onerror = handleImageError;

// Car class
class Car {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 60;  // Adjust based on image size
        this.height = 40; // Adjust based on image size
        this.angle = 0;
        this.speed = 0;
        this.maxSpeed = 5;
        this.color = color;
        this.controls = controls;
        this.useImage = color === 'gold'; // Only second car uses the image
    }

    update() {
        if (gameState !== 'racing') return; // Only move if game is in racing state
        
        // Handle controls
        if (keys[this.controls.up]) {
            this.speed = Math.min(this.speed + 0.2, this.maxSpeed);
        } else if (keys[this.controls.down]) {
            this.speed = Math.max(this.speed - 0.2, -this.maxSpeed);
        } else {
            this.speed *= 0.95; // Friction
        }

        if (keys[this.controls.left]) {
            this.angle -= 0.05;
        }
        if (keys[this.controls.right]) {
            this.angle += 0.05;
        }

        // Update position based on angle and speed
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle);

        if (this.useImage && carImage.complete) {
            // Draw the loaded image for car 2
            ctx.drawImage(
                carImage,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else {
            // Draw a rectangle for car 1
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            // Direction indicator
            ctx.fillStyle = 'white';
            ctx.fillRect(this.width/4, -this.height/2, 5, 10);
        }

        ctx.restore();
    }
}

// Create two cars
const car1 = new Car(100, 200, 'red', {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
});

const car2 = new Car(100, 300, 'gold', {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd'
});

// Track key states
const keys = {};
document.addEventListener('keydown', (e) => {
    // Handle both arrow keys and WASD
    if (e.key.startsWith('Arrow')) {
        keys[e.key] = true;
    } else {
        keys[e.key.toLowerCase()] = true;
    }
    // Prevent scrolling with arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key.startsWith('Arrow')) {
        keys[e.key] = false;
    } else {
        keys[e.key.toLowerCase()] = false;
    }
});

function drawBackground() {
    // Sand/dirt colored background
    ctx.fillStyle = '#c2b280';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some texture to the background
    for(let i = 0; i < 10000; i++) {
        ctx.fillStyle = `rgba(160, 140, 90, ${Math.random() * 0.3})`;
        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
        );
    }
}

function drawTrack() {
    ctx.save();
    
    // Draw track surface
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    drawTrackPath(track.outerPoints);
    ctx.fill();

    // Draw colored block borders
    drawBlockBorder();
    
    // Draw red and white kerbs at corners
    drawKerbs();
    
    // Draw start/finish line
    drawStartLine();
    
    ctx.restore();
}

function drawTrackPath(points) {
    const scaledPoints = points.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height
    }));
    
    ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
    
    for (let i = 1; i < scaledPoints.length; i++) {
        const curr = scaledPoints[i];
        const prev = scaledPoints[i - 1];
        const next = scaledPoints[(i + 1) % scaledPoints.length];
        
        // Create smooth curves
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y + (curr.y - prev.y) * 0.5;
        const cp2x = curr.x + (next.x - curr.x) * 0.5;
        const cp2y = curr.y + (next.y - curr.y) * 0.5;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y);
    }
    
    // Close the path
    ctx.closePath();
}

function drawBlockBorder() {
    const blockSize = 20;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    let colorIndex = 0;
    
    // Draw blocks around the outer edge
    track.outerPoints.forEach((point, i) => {
        const next = track.outerPoints[(i + 1) % track.outerPoints.length];
        const x1 = point.x * canvas.width;
        const y1 = point.y * canvas.height;
        const x2 = next.x * canvas.width;
        const y2 = next.y * canvas.height;
        
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1);
        
        for(let d = 0; d < distance; d += blockSize) {
            ctx.fillStyle = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
            
            ctx.save();
            ctx.translate(
                x1 + Math.cos(angle) * d,
                y1 + Math.sin(angle) * d
            );
            ctx.rotate(angle);
            ctx.fillRect(-blockSize/2, -blockSize, blockSize, blockSize);
            ctx.restore();
        }
    });
}

function drawKerbs() {
    const kerbSize = 15;
    const stripeWidth = 20;
    
    track.outerPoints.forEach((point, i) => {
        const next = track.outerPoints[(i + 1) % track.outerPoints.length];
        const x1 = point.x * canvas.width;
        const y1 = point.y * canvas.height;
        const x2 = next.x * canvas.width;
        const y2 = next.y * canvas.height;
        
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1);
        
        // Only draw kerbs at corners
        if (Math.abs(angle) > 0.2) {
            for(let d = 0; d < distance; d += stripeWidth) {
                ctx.fillStyle = (Math.floor(d/stripeWidth) % 2 === 0) ? '#ff0000' : '#ffffff';
                ctx.save();
                ctx.translate(
                    x1 + Math.cos(angle) * d,
                    y1 + Math.sin(angle) * d
                );
                ctx.rotate(angle);
                ctx.fillRect(-stripeWidth/2, 0, stripeWidth, kerbSize);
                ctx.restore();
            }
        }
    });
}

function drawStartLine() {
    const startX = track.outerPoints[0].x * canvas.width;
    const startY = track.outerPoints[0].y * canvas.height;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(startX - 5, startY, 10, track.trackWidth);
    
    // Checkered pattern
    const squareSize = 20;
    for(let i = 0; i < track.trackWidth/squareSize; i++) {
        for(let j = 0; j < 2; j++) {
            if((i + j) % 2 === 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(
                    startX - squareSize/2,
                    startY + i * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }
}

// Update car starting positions
car1.x = track.outerPoints[0].x * canvas.width;
car1.y = track.outerPoints[0].y * canvas.height + 20;
car2.x = track.outerPoints[0].x * canvas.width;
car2.y = track.outerPoints[0].y * canvas.height + 60;

// Add game state
let countdown = 3;
let lastCountdownTime = 0;

// Add coins/items
const coins = [];
function initializeCoins() {
    // Add coins along the track
    track.outerPoints.forEach((point, i) => {
        const next = track.outerPoints[(i + 1) % track.outerPoints.length];
        const x = (point.x + next.x) * canvas.width / 2;
        const y = (point.y + next.y) * canvas.height / 2;
        coins.push({x, y});
    });
}

function drawCoins() {
    ctx.fillStyle = '#ffd700';
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Add UI drawing function
function drawUI() {
    const uiWidth = 200;
    const padding = 20;
    const rightPanelX = canvas.width - uiWidth;

    // Draw UI background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(rightPanelX, 0, uiWidth, canvas.height);

    // Draw player 1 UI
    drawPlayerUI(car1, rightPanelX + padding, 50, 'Player 1', 'red');
    
    // Draw player 2 UI
    drawPlayerUI(car2, rightPanelX + padding, 250, 'Player 2', 'gold');
}

function drawPlayerUI(car, x, y, playerName, color) {
    // Player name
    ctx.fillStyle = color;
    ctx.font = 'bold 20px Arial';
    ctx.fillText(playerName, x, y);

    // Speed meter background
    const meterWidth = 160;
    const meterHeight = 20;
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y + 10, meterWidth, meterHeight);

    // Speed meter fill
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 10, meterWidth * (car.speedPercent / 100), meterHeight);

    // Speed text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Speed: ${Math.round(car.speedPercent)}%`, x, y + 50);

    // Power-up display
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 70, 50, 50);

    if (car.currentPowerup) {
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(car.currentPowerup, x, y + 140);
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '30px Arial';
        ctx.fillText('?', x + 15, y + 105);
    }

    // Controls reminder
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    const controls = car.controls.up === 'ArrowUp' ? 
        'Arrow Keys' : 
        'WASD Keys';
    ctx.fillText(`Controls: ${controls}`, x, y + 160);
}

// Add power-up system
const powerUps = ['Speed', 'Shield', 'Boost'];

function addRandomPowerUp(car) {
    car.currentPowerup = powerUps[Math.floor(Math.random() * powerUps.length)];
}

// Update gameLoop to handle loading state
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'loading') {
        // Show loading screen
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', canvas.width/2, canvas.height/2);
    } else {
        drawBackground();
        drawTrack();
        drawCoins();

        if (gameState === 'countdown') {
            // Draw countdown
            ctx.fillStyle = 'white';
            ctx.font = 'bold 100px Arial';
            ctx.textAlign = 'center';
            
            if (countdown > 0) {
                ctx.fillText(countdown, canvas.width/2, canvas.height/2);
                
                // Update countdown every second
                const currentTime = Date.now();
                if (currentTime - lastCountdownTime >= 1000) {
                    countdown--;
                    lastCountdownTime = currentTime;
                }
            } else {
                ctx.fillText('GO!', canvas.width/2, canvas.height/2);
                setTimeout(() => {
                    gameState = 'racing';
                }, 1000);
            }
            
            // Draw cars but don't update their positions
            car1.draw();
            car2.draw();
        } else if (gameState === 'racing') {
            // Update and draw cars
            car1.update();
            car2.update();
            car1.draw();
            car2.draw();
        }
        
        // Draw UI on top
        drawUI();
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop immediately to show loading screen
gameLoop();

// Add keyboard controls for power-ups
document.addEventListener('keydown', (e) => {
    if (gameState === 'racing') {
        // Space bar for Player 1 power-up
        if (e.code === 'Space' && car1.currentPowerup) {
            activatePowerUp(car1);
        }
        // Left Shift for Player 2 power-up
        if (e.code === 'ShiftLeft' && car2.currentPowerup) {
            activatePowerUp(car2);
        }
    }
});

function activatePowerUp(car) {
    switch (car.currentPowerup) {
        case 'Speed':
            car.maxSpeed *= 1.5;
            setTimeout(() => {
                car.maxSpeed /= 1.5;
            }, 3000);
            break;
        case 'Shield':
            // Implement shield logic
            break;
        case 'Boost':
            car.speed = car.maxSpeed * 2;
            break;
    }
    car.currentPowerup = null;
}

// Periodically give power-ups to cars
setInterval(() => {
    if (gameState === 'racing') {
        if (!car1.currentPowerup) {
            addRandomPowerUp(car1);
        }
        if (!car2.currentPowerup) {
            addRandomPowerUp(car2);
        }
    }
}, 10000); // Every 10 seconds 