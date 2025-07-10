const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Car properties
const car = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 100,
    width: 30,
    height: 50,
    angle: 0,
    speed: 0,
    acceleration: 0.2,
    maxSpeed: 5,
    turnSpeed: 0.05,
    friction: 0.98
};

// Add second car properties
const car2 = {
    x: canvas.width / 2,
    y: canvas.height / 2 - 100,  // Start above center
    width: 30,
    height: 50,
    angle: Math.PI,  // Start facing opposite direction
    speed: 0,
    acceleration: 0.2,
    maxSpeed: 5,
    turnSpeed: 0.05,
    friction: 0.98
};

// Track properties
const track = {
    innerRadius: 150,
    outerRadius: 300,
    centerX: canvas.width / 2,
    centerY: canvas.height / 2
};

// Replace triangles array with new objects
const gameObjects = {
    houses: [],
    tanks: [],
    guards: []
};

// Generate random objects
function generateObjects() {
    // Generate 5 houses
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = track.innerRadius + Math.random() * (track.outerRadius - track.innerRadius);
        gameObjects.houses.push({
            x: track.centerX + Math.cos(angle) * distance,
            y: track.centerY + Math.sin(angle) * distance,
            width: 40,
            height: 30,
            rotation: Math.random() * Math.PI * 2
        });
    }

    // Generate 3 tanks
    for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = track.innerRadius + Math.random() * (track.outerRadius - track.innerRadius);
        gameObjects.tanks.push({
            x: track.centerX + Math.cos(angle) * distance,
            y: track.centerY + Math.sin(angle) * distance,
            width: 30,
            height: 20,
            rotation: Math.random() * Math.PI * 2,
            lastShot: 0,
            bullets: []
        });
    }

    // Generate 6 guards
    for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = track.innerRadius + Math.random() * (track.outerRadius - track.innerRadius);
        gameObjects.guards.push({
            x: track.centerX + Math.cos(angle) * distance,
            y: track.centerY + Math.sin(angle) * distance,
            size: 10,
            rotation: Math.random() * Math.PI * 2,
            lastShot: 0,
            bullets: []
        });
    }
}

// Key states
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault();  // Prevent page scrolling
    } else if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    } else if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = false;
    }
});

// Add at the top with other global variables
let lastCollisionTime = 0;
const COLLISION_COOLDOWN = 500; // Half a second between beeps

function drawTrack() {
    // Draw outer track
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner track
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.innerRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw track details
    for (let i = 0; i < 36; i++) {
        const angle = (i * Math.PI * 2) / 36;
        ctx.beginPath();
        ctx.moveTo(
            track.centerX + Math.cos(angle) * track.innerRadius,
            track.centerY + Math.sin(angle) * track.innerRadius
        );
        ctx.lineTo(
            track.centerX + Math.cos(angle) * track.outerRadius,
            track.centerY + Math.sin(angle) * track.outerRadius
        );
        ctx.strokeStyle = `rgba(0, 255, 255, 0.2)`;
        ctx.stroke();
    }
}

function drawCar(carObj) {
    ctx.save();
    ctx.translate(carObj.x, carObj.y);
    ctx.rotate(carObj.angle);
    
    // Draw car body with a brighter color
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(-carObj.width / 2, -carObj.height / 2, carObj.width, carObj.height);
    
    // Add glowing effect
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    
    // Draw car details with a contrasting color
    ctx.fillStyle = '#000033';
    ctx.fillRect(-carObj.width / 2 + 5, -carObj.height / 2 + 5, carObj.width - 10, carObj.height - 10);
    
    // Add windshield
    ctx.fillStyle = '#80ffff';
    ctx.fillRect(-carObj.width / 2 + 5, -carObj.height / 2 + 5, carObj.width - 10, carObj.height / 3);
    
    // Add name text with improved visibility
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';  // Made text bigger and bold
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Swap the names (Niam for WASD car, Arna for arrow keys car)
    const text = (carObj === car) ? 'Arna' : 'Niam';
    
    // Add white outline to make text more readable
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    
    ctx.restore();
}

// Draw functions for each object type
function drawHouse(house) {
    ctx.save();
    ctx.translate(house.x, house.y);
    ctx.rotate(house.rotation);
    
    // Draw house body
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(-house.width/2, -house.height/2, house.width, house.height);
    
    // Draw roof
    ctx.beginPath();
    ctx.moveTo(-house.width/2, -house.height/2);
    ctx.lineTo(0, -house.height);
    ctx.lineTo(house.width/2, -house.height/2);
    ctx.fillStyle = '#6a6a6a';
    ctx.fill();
    
    // Draw door
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(-house.width/6, -house.height/6, house.width/3, house.height/2);
    
    ctx.restore();
}

function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.rotation);
    
    // Draw tank body
    ctx.fillStyle = '#355e3b';
    ctx.fillRect(-tank.width/2, -tank.height/2, tank.width, tank.height);
    
    // Draw turret
    ctx.fillStyle = '#2d4f33';
    ctx.fillRect(-tank.width/4, -tank.height/2, tank.width/2, tank.height/4);
    ctx.fillRect(0, -tank.height/3, tank.width/2, tank.height/6);
    
    // Draw tank treads
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-tank.width/2, -tank.height/2, tank.width, tank.height/6);
    ctx.fillRect(-tank.width/2, tank.height/3, tank.width, tank.height/6);
    
    // Draw bullets
    tank.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x - tank.x, bullet.y - tank.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0';
        ctx.fill();
    });
    
    ctx.restore();
}

function drawGuard(guard) {
    ctx.save();
    ctx.translate(guard.x, guard.y);
    ctx.rotate(guard.rotation);
    
    // Draw body
    ctx.fillStyle = '#355e3b';
    ctx.fillRect(-guard.size/2, -guard.size/2, guard.size, guard.size);
    
    // Draw head
    ctx.beginPath();
    ctx.arc(0, -guard.size/2, guard.size/3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    
    // Draw gun
    ctx.fillStyle = '#000';
    ctx.fillRect(guard.size/2, -guard.size/6, guard.size/2, guard.size/3);
    
    // Draw bullets
    guard.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x - guard.x, bullet.y - guard.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0';
        ctx.fill();
    });
    
    ctx.restore();
}

// Update shooting logic
function updateShooting() {
    const currentTime = Date.now();
    
    // Update tank shooting
    gameObjects.tanks.forEach(tank => {
        // Shoot every 2 seconds if a car is within range
        if (currentTime - tank.lastShot > 2000) {
            const nearestCar = findNearestCar(tank.x, tank.y);
            if (nearestCar && getDistance(tank, nearestCar) < 200) {
                const angle = Math.atan2(nearestCar.y - tank.y, nearestCar.x - tank.x);
                tank.bullets.push({
                    x: tank.x,
                    y: tank.y,
                    angle: angle,
                    speed: 5
                });
                tank.lastShot = currentTime;
            }
        }
        
        // Update bullet positions
        tank.bullets = tank.bullets.filter(bullet => {
            bullet.x += Math.cos(bullet.angle) * bullet.speed;
            bullet.y += Math.sin(bullet.angle) * bullet.speed;
            return isInCanvas(bullet);
        });
    });
    
    // Update guard shooting
    gameObjects.guards.forEach(guard => {
        // Shoot every 1.5 seconds if a car is within range
        if (currentTime - guard.lastShot > 1500) {
            const nearestCar = findNearestCar(guard.x, guard.y);
            if (nearestCar && getDistance(guard, nearestCar) < 150) {
                const angle = Math.atan2(nearestCar.y - guard.y, nearestCar.x - guard.x);
                guard.bullets.push({
                    x: guard.x,
                    y: guard.y,
                    angle: angle,
                    speed: 4
                });
                guard.lastShot = currentTime;
            }
        }
        
        // Update bullet positions
        guard.bullets = guard.bullets.filter(bullet => {
            bullet.x += Math.cos(bullet.angle) * bullet.speed;
            bullet.y += Math.sin(bullet.angle) * bullet.speed;
            return isInCanvas(bullet);
        });
    });
}

// Helper functions
function findNearestCar(x, y) {
    const dist1 = getDistance({x, y}, car);
    const dist2 = getDistance({x, y}, car2);
    return dist1 < dist2 ? car : car2;
}

function getDistance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

function isInCanvas(obj) {
    return obj.x >= 0 && obj.x <= canvas.width && obj.y >= 0 && obj.y <= canvas.height;
}

// Update collision detection
function checkCollisions(carObj) {
    // Check collisions with houses
    for (const house of gameObjects.houses) {
        if (rectCollision(carObj, house)) {
            return true;
        }
    }
    
    // Check collisions with tanks
    for (const tank of gameObjects.tanks) {
        if (rectCollision(carObj, tank)) {
            return true;
        }
        // Check tank bullets
        for (const bullet of tank.bullets) {
            if (pointRectCollision(bullet, carObj)) {
                restartGame();
                return true;
            }
        }
    }
    
    // Check collisions with guards and their bullets
    for (const guard of gameObjects.guards) {
        if (circleRectCollision(guard, carObj)) {
            return true;
        }
        // Check guard bullets
        for (const bullet of guard.bullets) {
            if (pointRectCollision(bullet, carObj)) {
                restartGame();
                return true;
            }
        }
    }
    
    return false;
}

function rectCollision(rect1, rect2) {
    return Math.abs(rect1.x - rect2.x) < (rect1.width + rect2.width) / 2 &&
           Math.abs(rect1.y - rect2.y) < (rect1.height + rect2.height) / 2;
}

function pointRectCollision(point, rect) {
    return point.x >= rect.x - rect.width/2 &&
           point.x <= rect.x + rect.width/2 &&
           point.y >= rect.y - rect.height/2 &&
           point.y <= rect.y + rect.height/2;
}

function circleRectCollision(circle, rect) {
    return getDistance(circle, rect) < circle.size + Math.max(rect.width, rect.height) / 2;
}

// Update car movement functions to prevent triangle collisions
function updateCar() {
    // Store old position
    const oldX = car.x;
    const oldY = car.y;
    
    // Handle acceleration (Arna's car - arrow keys)
    if (keys.ArrowUp) {
        car.speed += car.acceleration;
    }
    if (keys.ArrowDown) {
        car.speed -= car.acceleration;
    }
    
    // Handle turning
    if (keys.ArrowLeft) {
        car.angle -= car.turnSpeed * Math.sign(car.speed);
    }
    if (keys.ArrowRight) {
        car.angle += car.turnSpeed * Math.sign(car.speed);
    }
    
    // Apply speed limits
    car.speed = Math.max(Math.min(car.speed, car.maxSpeed), -car.maxSpeed / 2);
    
    // Apply friction
    car.speed *= car.friction;
    
    // Update position
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed;
    
    // Check for triangle collisions
    if (checkCollisions(car)) {
        // If collision, revert to old position
        car.x = oldX;
        car.y = oldY;
        car.speed = 0;
    }
    
    // Keep car within canvas bounds
    car.x = Math.max(0, Math.min(car.x, canvas.width));
    car.y = Math.max(0, Math.min(car.y, canvas.height));
}

// Add function to update second car
function updateCar2() {
    // Store old position
    const oldX = car2.x;
    const oldY = car2.y;
    
    // Handle acceleration (Niam's car - WASD)
    if (keys.w) {
        car2.speed += car2.acceleration;
    }
    if (keys.s) {
        car2.speed -= car2.acceleration;
    }
    
    // Handle turning
    if (keys.a) {
        car2.angle -= car2.turnSpeed * Math.sign(car2.speed);
    }
    if (keys.d) {
        car2.angle += car2.turnSpeed * Math.sign(car2.speed);
    }
    
    // Apply speed limits
    car2.speed = Math.max(Math.min(car2.speed, car2.maxSpeed), -car2.maxSpeed / 2);
    
    // Apply friction
    car2.speed *= car2.friction;
    
    // Update position
    car2.x += Math.sin(car2.angle) * car2.speed;
    car2.y -= Math.cos(car2.angle) * car2.speed;
    
    // Check for triangle collisions
    if (checkCollisions(car2)) {
        // If collision, revert to old position
        car2.x = oldX;
        car2.y = oldY;
        car2.speed = 0;
    }
    
    // Keep car within canvas bounds
    car2.x = Math.max(0, Math.min(car2.x, canvas.width));
    car2.y = Math.max(0, Math.min(car2.y, canvas.height));
}

// Add this function for restarting the game
function restartGame() {
    // Reset car 1 (Arna)
    car.x = canvas.width / 2;
    car.y = canvas.height / 2 + 100;
    car.angle = 0;
    car.speed = 0;
    
    // Reset car 2 (Niam)
    car2.x = canvas.width / 2;
    car2.y = canvas.height / 2 - 100;
    car2.angle = Math.PI;
    car2.speed = 0;
    
    // Clear all bullets
    gameObjects.tanks.forEach(tank => tank.bullets = []);
    gameObjects.guards.forEach(guard => guard.bullets = []);
}

// Update the car collision check function
function checkCollision() {
    // Calculate distance between cars
    const dx = car.x - car2.x;
    const dy = car.y - car2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If cars are touching
    if (distance < (car.width + car2.width) / 2) {
        const sound = document.getElementById('collisionSound');
        sound.currentTime = 0;
        sound.play();
        restartGame();  // Restart the game on collision
    }
}

// Update gameLoop function to use the correct collision checks
function gameLoop() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawTrack();
    
    // Draw all objects
    gameObjects.houses.forEach(drawHouse);
    gameObjects.tanks.forEach(drawTank);
    gameObjects.guards.forEach(drawGuard);
    
    updateShooting();
    updateCar();
    updateCar2();
    checkCollision();  // Check car-to-car collisions
    drawCar(car);
    drawCar(car2);
    
    requestAnimationFrame(gameLoop);
}

// Initialize objects and start game
generateObjects();
gameLoop(); 