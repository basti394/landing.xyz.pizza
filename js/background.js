const tickers = [
  "AAPL", "GOOG", "TSLA", "MSFT", "NVDA", "SPX", "BTC", "ETH",
  "AMZN", "META", "V", "MA", "JPM",
  "UBSG", "ROG", "CSGN", "NESN", "NOVN", "SMI"
];

const changes = [
  "+0.5%", "-1.2%", "+2.1%", "-0.8%", "+1.5%", "-0.2%", "+3.4%", "0.00%",
  "+0.1%", "-0.9%", "+3.9%", "-2.5%", "+0.01%", "-1.8%", "+5.5%", "-4.2%"
];

function generateTickerText() {
  let t = tickers[floor(random(tickers.length))];
  let c = changes[floor(random(changes.length))];
  return `${t} ${c}`;
}

let packets = [];
let numPackets = 500;
let channelSpacing = 30;
let mouseHighlightDist = 100;
let baseAlpha = 50;
const fadeSpeed = 0.1;

class Packet {
  constructor() {
    this.y = floor(random(height / channelSpacing)) * channelSpacing;
    this.x = random(-width, -20);
    this.speed = random(1, 3);
    this.len = random(10, 30);

    this.tickerText = "";
    this.fadeProgress = 0;
  }

  update() {
    this.x += this.speed;

    if (this.x > width) {
      this.x = -this.len;
      this.y = floor(random(height / channelSpacing)) * channelSpacing;
      this.tickerText = "";
      this.fadeProgress = 0;
    }
  }

  draw(dMouse) {

    if (dMouse < mouseHighlightDist) {
      if (this.tickerText === "") {
        this.tickerText = generateTickerText();
      }
      this.fadeProgress = min(1, this.fadeProgress + fadeSpeed);
    } else {
      this.fadeProgress = max(0, this.fadeProgress - fadeSpeed);

      if (this.fadeProgress === 0) {
        this.tickerText = "";
      }
    }


    let baseLineAlpha = map(dMouse, 0, mouseHighlightDist, 255, baseAlpha, true);


    let lineAlpha = map(this.fadeProgress, 0, 1, baseLineAlpha, 0);
    let textAlpha = map(this.fadeProgress, 0, 1, 0, 255);



    stroke(255, 255, 255, lineAlpha);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.len, this.y);

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
