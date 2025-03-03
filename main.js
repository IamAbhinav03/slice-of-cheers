document.addEventListener("DOMContentLoaded", function () {
  const cake = document.getElementById("cake");
  const flame = document.getElementById("flame");
  const resetButton = document.getElementById("resetButton");
  const messageContainer = document.getElementById("messageContainer");
  const closeButton = document.getElementById("closeButton");
  let isMouseDown = false;
  let startX, startY;
  let cutLine;
  let cuts = 0;

  // Blow out candle on click
  flame.addEventListener("click", function (e) {
    e.stopPropagation();
    flame.style.opacity = "0";
    createConfetti(150);
  });

  // Cut cake functionality
  cake.addEventListener("mousedown", function (e) {
    if (cuts >= 3) return; // Limit to 3 cuts

    isMouseDown = true;
    const rect = cake.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    // Create cutting line
    cutLine = document.createElement("div");
    cutLine.className = "cut-line";
    cutLine.style.width = "0px";
    cutLine.style.height = "3px";
    cutLine.style.left = startX + "px";
    cutLine.style.top = startY + "px";
    cutLine.style.opacity = "1";
    cutLine.style.position = "absolute";
    cake.appendChild(cutLine);
  });

  document.addEventListener("mousemove", function (e) {
    if (!isMouseDown || !cutLine) return;

    const rect = cake.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate length and angle of cutting line
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    cutLine.style.width = length + "px";
    cutLine.style.transform = `rotate(${angle}deg)`;
  });

  document.addEventListener("mouseup", function () {
    if (isMouseDown && cutLine) {
      isMouseDown = false;
      createSlice(cutLine);
      cuts++;

      if (cuts >= 1) {
        resetButton.style.display = "inline-block";
      }

      if (cuts >= 3) {
        // Show message after cutting 3 slices
        setTimeout(showMessage, 1000);
      }
    }
  });

  function createSlice(line) {
    const width = parseInt(line.style.width);
    const angle = getRotationDegrees(line);
    const x = parseInt(line.style.left);
    const y = parseInt(line.style.top);

    // Create a slice that will move
    const slice = document.createElement("div");
    slice.className = "slice";
    slice.style.left = x + "px";
    slice.style.top = y + "px";
    slice.style.width = width + "px";
    slice.style.height = "150px";
    slice.style.transform = `rotate(${angle}deg)`;

    // Add inner content to the slice - red velvet cake with white frosting
    const innerSlice = `
                    <div style="position: absolute; width: ${width}px; height: 100px; 
                         background-color: #ffcccc; border-radius: 10px; bottom: 0;"></div>
                    <div style="position: absolute; width: ${width}px; height: 10px; 
                         background-color: #ffb3e6; border-radius: 10px; bottom: 100px;"></div>
                    <div style="position: absolute; width: ${
                      width * 0.75
                    }px; height: 80px; 
                         background-color: #ff99ff; border-radius: 10px; bottom: 110px; left: ${
                           width * 0.125
                         }px;"></div>
                    <div style="position: absolute; width: ${
                      width * 0.75
                    }px; height: 10px; 
                         background-color: #ffffff; border-radius: 10px; bottom: 190px; left: ${
                           width * 0.125
                         }px;"></div>
                    <div style="position: absolute; width: ${
                      width * 0.5
                    }px; height: 60px; 
                         background-color: #800000; border-radius: 10px; bottom: 200px; left: ${
                           width * 0.25
                         }px;"></div>
                `;
    slice.innerHTML = innerSlice;

    cake.appendChild(slice);

    // Animate the slice moving away
    setTimeout(() => {
      slice.style.opacity = "1";
      slice.style.transition = "transform 0.5s ease-out, opacity 0.5s";
      slice.style.transform = `rotate(${angle}deg) translateX(50px)`;

      setTimeout(() => {
        slice.style.opacity = "0";
      }, 400);
    }, 100);
  }

  function getRotationDegrees(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
  }

  function createConfetti(count) {
    const colors = [
      "#ff0000",
      "#c71585",
      "#ffffff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 300 + "px";
      confetti.style.top = "100px";
      confetti.style.width = Math.random() * 5 + 5 + "px";
      confetti.style.height = Math.random() * 5 + 5 + "px";
      confetti.style.opacity = 1;
      confetti.style.transition =
        "top 1s ease-out, left 1s ease-out, opacity 1s";

      cake.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = Math.random() * 200 + 300 + "px";
        confetti.style.left =
          parseInt(confetti.style.left) + (Math.random() * 200 - 100) + "px";

        setTimeout(() => {
          confetti.style.opacity = "0";
          setTimeout(() => {
            cake.removeChild(confetti);
          }, 1000);
        }, 800);
      }, 10);
    }
  }

  function showMessage() {
    messageContainer.style.visibility = "visible";
    messageContainer.style.opacity = "1";

    setTimeout(() => {
      messageContainer.querySelector(".message-box").style.transform =
        "scale(1)";
      createHearts();
    }, 100);
  }

  function createHearts() {
    const colors = ["#ff6666", "#ff3366", "#c71585", "#cc0066"];

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement("div");
      heart.className = "hearts";
      heart.innerHTML = "❤️";
      heart.style.position = "absolute";
      heart.style.fontSize = Math.random() * 20 + 20 + "px";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      heart.style.zIndex = "101";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.opacity = "1";
        heart.style.transition =
          "top 3s ease-out, transform 3s ease-out, opacity 3s";
        heart.style.transform =
          "translateY(-100px) rotate(" + (Math.random() * 90 - 45) + "deg)";

        setTimeout(() => {
          heart.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(heart);
          }, 1000);
        }, 2000);
      }, Math.random() * 1000);
    }
  }

  closeButton.addEventListener("click", function () {
    messageContainer.style.opacity = "0";
    setTimeout(() => {
      messageContainer.style.visibility = "hidden";
      messageContainer.querySelector(".message-box").style.transform =
        "scale(0.8)";
    }, 500);
  });

  resetButton.addEventListener("click", function () {
    // Remove all cuts and slices
    const cutLines = document.querySelectorAll(".cut-line");
    const slices = document.querySelectorAll(".slice");
    cutLines.forEach((line) => line.remove());
    slices.forEach((slice) => slice.remove());

    // Reset flame
    flame.style.opacity = "1";

    // Reset counter
    cuts = 0;

    // Hide reset button until first cut
    resetButton.style.display = "none";

    // Add celebration effect
    createConfetti(50);
  });
});
