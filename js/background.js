const tickers = ["AAPL", "GOOG", "TSLA", "MSFT", "NVDA", "BTC", "ETH", "UBSG", "ROG", "CSGN", "SPX"];
const changes = ["+0.5%", "-1.2%", "+2.1%", "-0.8%", "+1.5%", "-0.2%", "+3.4%", "UNCH"];

function generateTickerText() {
  let t = tickers[floor(random(tickers.length))];
  let c = changes[floor(random(changes.length))];
  return `${t} ${c}`;
}

// --- p5.js Sketch ---
let packets = [];
let numPackets = 100;
let channelSpacing = 30;
let mouseHighlightDist = 100;
let baseAlpha = 50;
const fadeSpeed = 0.1; // Geschwindigkeit des Cross-fades (10% pro Frame)

class Packet {
  constructor() {
    this.y = floor(random(height / channelSpacing)) * channelSpacing;
    this.x = random(-width, -20);
    this.speed = random(1, 3);
    this.len = random(10, 30);

    // --- NEUE STATUS-LOGIK (Kein Timer) ---
    this.tickerText = "";
    this.fadeProgress = 0; // 0 = 100% Linie, 1 = 100% Ticker
  }

  update() {
    this.x += this.speed;

    if (this.x > width) {
      this.x = -this.len;
      this.y = floor(random(height / channelSpacing)) * channelSpacing;
      // Reset beim Wrappen
      this.tickerText = "";
      this.fadeProgress = 0;
    }
  }

  draw(dMouse) {

    // --- 1. STATUS AKTUALISIEREN (Nicht mehr zeitbasiert) ---
    if (dMouse < mouseHighlightDist) {
      // Maus ist NAHE DRAN
      // Wenn kein Ticker-Text da ist, generiere einen.
      if (this.tickerText === "") {
        this.tickerText = generateTickerText();
      }
      // Erhöhe den Fade-Status (bis max 1)
      this.fadeProgress = min(1, this.fadeProgress + fadeSpeed);
    } else {
      // Maus ist WEG
      // Verringere den Fade-Status (bis min 0)
      this.fadeProgress = max(0, this.fadeProgress - fadeSpeed);

      // Wenn komplett ausgeblendet, Ticker-Text löschen
      if (this.fadeProgress === 0) {
        this.tickerText = "";
      }
    }

    // --- 2. ALPHA (DECKKRAFT) BERECHNEN ---

    // Die Basis-Linie (wird heller, je näher die Maus ist)
    let baseLineAlpha = map(dMouse, 0, mouseHighlightDist, 255, baseAlpha, true);

    // Der Cross-fade:
    // Linie fadet von ihrer Basis-Helligkeit auf 0
    let lineAlpha = map(this.fadeProgress, 0, 1, baseLineAlpha, 0);
    // Text fadet von 0 auf 255
    let textAlpha = map(this.fadeProgress, 0, 1, 0, 255);


    // --- 3. ZEICHNEN ---

    // Zeichne die LINIE (wird unsichtbar bei fadeProgress = 1)
    stroke(255, 255, 255, lineAlpha);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.len, this.y);

    // Zeichne den TEXT (wird sichtbar bei fadeProgress > 0)
    if (textAlpha > 0) {
      fill(255, 255, 255, textAlpha);
      noStroke();
      textSize(10);
      textAlign(LEFT, CENTER);
      text(this.tickerText, this.x, this.y);
    }
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('bg-canvas');
  canvas.style('position', 'fixed');
  canvas.style('z-index', '-1');
  for (let i = 0; i < numPackets; i++) {
    packets.push(new Packet());
  }
}

function draw() {
  background(0, 66, 37); // #004225
  let mouseVec = createVector(mouseX, mouseY);

  for (let p of packets) {
    // Berechne Distanz HIER
    let midX = p.x + p.len / 2;
    let packetPos = createVector(midX, p.y);
    let dMouse = p5.Vector.dist(packetPos, mouseVec);

    p.update();
    p.draw(dMouse);
  }
}
