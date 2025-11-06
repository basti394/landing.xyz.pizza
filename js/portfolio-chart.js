
const allocation = [
  {
    label: 'Information Technology',
    shortLabel: 'IT',
    percentage: 33,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Crypto',
    shortLabel: 'Crypto',
    percentage: 25,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Cash',
    shortLabel: 'Cash',
    percentage: 12,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Consumer Staples',
    shortLabel: 'Cons Staples',
    percentage: 7,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Financials',
    shortLabel: 'Financials',
    percentage: 5,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Consumer Discretionary',
    shortLabel: 'Cons Discr',
    percentage: 5,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Real Estate',
    shortLabel: 'RE',
    percentage: 4,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Industrials',
    shortLabel: 'Industrials',
    percentage: 3,
    anim: { alpha: 255, weight: 3 }
  },
  {
    label: 'Others',
    shortLabel: 'Others',
    percentage: 6,
    anim: { alpha: 255, weight: 3 }
  },
];

const portfolioSketch = (p) => {
  let container;
  let hoveredSegment = null;

  p.setup = () => {
    container = document.getElementById('portfolio-chart-container');
    let canvas = p.createCanvas(container.offsetWidth, container.offsetWidth * 0.85);
    canvas.parent(container);
    p.textFont('Roboto Mono');
  };

  p.draw = () => {
    p.clear();
    p.translate(p.width / 2, p.height / 2);

    const isSmall = p.width < 450;
    const chartDiameter = isSmall ? p.width * 0.6 : p.width * 0.5;
    const thickness = chartDiameter * 0.15;
    const innerDiameter = chartDiameter - 2 * thickness;
    const gap = 0.05;

    // --- CORRECTED: Normalize the data ---
    const totalPercentage = allocation.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPercentage <= 0) return; // Do nothing if there's no data

    // --- 1. Hit Detection ---
    const mouseDist = p.dist(0, 0, p.mouseX - p.width / 2, p.mouseY - p.height / 2);
    let mouseAngle = p.atan2(p.mouseY - p.height / 2, p.mouseX - p.width / 2) + p.HALF_PI;
    if (mouseAngle < 0) mouseAngle += p.TWO_PI;

    let currentHover = null;
    if (mouseDist > innerDiameter / 2 && mouseDist < chartDiameter / 2) {
      let lastAngle = 0;
      for (const item of allocation) {
        const angle = (item.percentage / totalPercentage) * p.TWO_PI; // Use normalized angle
        if (angle <= 0) continue;
        if (mouseAngle > lastAngle + gap / 2 && mouseAngle < lastAngle + angle - gap / 2) {
          currentHover = item;
          break;
        }
        lastAngle += angle;
      }
    }
    hoveredSegment = currentHover;

    // --- 2. Draw Chart Segments with Animation ---
    p.push();
    p.rotate(-p.HALF_PI);
    let lastAngle = 0;
    for (const item of allocation) {
      const angle = (item.percentage / totalPercentage) * p.TWO_PI; // Use normalized angle
      if (angle <= 0) continue;

      const isHovered = item === hoveredSegment;
      const isAnyHovered = hoveredSegment !== null;

      const targetAlpha = !isAnyHovered || isHovered ? 255 : 100;
      const targetWeight = !isAnyHovered || isHovered ? 3 : 2;

      item.anim.alpha = p.lerp(item.anim.alpha, targetAlpha, 0.1);
      item.anim.weight = p.lerp(item.anim.weight, targetWeight, 0.1);

      p.stroke(255, 255, 255, item.anim.alpha);
      p.strokeWeight(item.anim.weight);
      p.noFill();

      const startAngle = lastAngle + gap / 2;
      const endAngle = lastAngle + angle - gap / 2;
      p.arc(0, 0, chartDiameter, chartDiameter, startAngle, endAngle);
      p.arc(0, 0, innerDiameter, innerDiameter, startAngle, endAngle);

      const outerRadius = chartDiameter / 2;
      const innerRadius = innerDiameter / 2;
      p.line(p.cos(startAngle) * outerRadius, p.sin(startAngle) * outerRadius, p.cos(startAngle) * innerRadius, p.sin(startAngle) * innerRadius);
      p.line(p.cos(endAngle) * outerRadius, p.sin(endAngle) * outerRadius, p.cos(endAngle) * innerRadius, p.sin(endAngle) * innerRadius);

      lastAngle += angle;
    }
    p.pop();

    // --- 3. Draw Center Text ---
    if (hoveredSegment) {
      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();
      p.fill(255);

      const label = isSmall ? hoveredSegment.shortLabel : hoveredSegment.label;
      const percentageTextSize = isSmall ? 24 : 32;
      const labelTextSize = isSmall ? 12 : 14;

      p.textSize(percentageTextSize);
      p.text(`${hoveredSegment.percentage.toFixed(2)}%`, 0, -labelTextSize / 2);

      p.textSize(labelTextSize);
      p.text(label, 0, labelTextSize + 4);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(container.offsetWidth, container.offsetWidth * 0.85);
  };
};

function initPortfolioChart() {
  if (document.getElementById('portfolio-chart-container')) {
    new p5(portfolioSketch);
  }
}
