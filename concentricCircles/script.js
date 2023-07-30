const introContainer = document.getElementById('introContainer');
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('scoreText');
const attemptsText = document.getElementById('attemptsText');

function getRandomPointInCircle(radius) {
  let randomX, randomY;
  do {
    randomX = Math.random() * (radius * 2) - radius;
    randomY = Math.random() * (radius * 2) - radius;
  } while (randomX * randomX + randomY * randomY > radius * radius);

  return { x: randomX, y: randomY };
}

function getRandomPointInAnnulus(outerRadius, innerRadius) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * (outerRadius - innerRadius) + innerRadius;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function drawScore(score) {
  scoreText.textContent = score;
}

function drawAttempts(attempts) {
  attemptsText.textContent = attempts + '/5';
}

function restartGame() {
  alert.apply ? window.location.reload() : window.location.reload();
}

function playGame() {
  const outerRadius = 100;
  const innerRadius = 80;
  const smallerRadius = 80;
  const center_x = canvas.width / 2;
  const center_y = canvas.height / 2;
  let score = 0;
  let attempts = 0;
  let initialPoint = null;
  let hitPoints = [];

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawCircles() {
    drawCircle(center_x, center_y, outerRadius, '#1565c0');
    drawCircle(center_x, center_y, innerRadius, '#1565c0');
  }

  function startGame() {
    introContainer.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('infoPanel').style.display = 'block';
    initialPoint = getRandomPointInAnnulus(outerRadius, innerRadius);
    const x = center_x + initialPoint.x;
    const y = center_y + initialPoint.y;
    drawPoint(x, y);

    clearCanvas();
    drawCircles();
    drawPoint(x, y);

    score = 0;
    attempts = 0;
    hitPoints = [];
    drawScore(score);
    drawAttempts(attempts);
  }

  function handleKeyPress(event) {
    if ((event.key === 's' || event.key === 'S') && attempts < 5) {
      if (initialPoint !== null) {
        if (hitPoints.length < 5) {
          const hitPoint = getRandomPointInCircle(smallerRadius);
          const x = center_x + hitPoint.x;
          const y = center_y + hitPoint.y;

          drawCircles();
          drawPoint(x, y);
          const distance = Math.sqrt((initialPoint.x - hitPoint.x) ** 2 + (initialPoint.y - hitPoint.y) ** 2);
          if (distance <= 20) {
            score++;
            drawCircle(x, y, 20, 'green');
            let hitAttempt = attempts + 1;
            setTimeout(() => {
              if (confirm('Čestitamo, pogodili ste iz ' + hitAttempt + '-og pokušaja!')) {
                restartGame();
              }
            }, 500);
            window.removeEventListener('keydown', handleKeyPress);
          } else {
            drawCircle(x, y, 20, 'red');
          }

          hitPoints.push(hitPoint);
        }
      }

      attempts++;
      drawAttempts(attempts);

      if (attempts === 5) {
        window.removeEventListener('keydown', handleKeyPress);
        setTimeout(() => {
          if (confirm('Igra je završena. Želite li ponovo da igrate?')) {
            restartGame();
          }
        }, 500);
      }
    }
  }

  function handleTouchStart(event) {
    event.preventDefault();
    if (attempts < 5) {
      const hitPoint = getRandomPointInCircle(smallerRadius);
      const x = center_x + hitPoint.x;
      const y = center_y + hitPoint.y;

      drawCircles();
      drawPoint(x, y);
      const distance = Math.sqrt((initialPoint.x - hitPoint.x) ** 2 + (initialPoint.y - hitPoint.y) ** 2);
      if (distance <= 20) {
        score++;
        drawCircle(x, y, 20, 'green');
        let hitAttempt = attempts + 1;
        setTimeout(() => {
          if (confirm('Čestitamo, pogodili ste iz ' + hitAttempt + '-og pokušaja!')) {
            restartGame();
          }
        }, 500);
        attempts = 5;
      } else {
        drawCircle(x, y, 20, 'red');
      }
      attempts++;
      drawAttempts(attempts);
      if (attempts === 5) {
        window.removeEventListener('keydown', handleKeyPress);
        setTimeout(() => {
          if (confirm('Igra je završena. Želite li ponovo da igrate?')) {
            restartGame();
          }
        }, 1000);
      }
    }
  }

  startButton.addEventListener('click', startGame);
  window.addEventListener('keydown', handleKeyPress);
  window.addEventListener('touchstart', handleTouchStart);
}

playGame();
