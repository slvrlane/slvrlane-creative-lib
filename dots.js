/**
 * @file Ein Modul, das verschiedene Funktionen zum Zeichnen von punkt- und bogenbasierten Formen auf einem HTML-Canvas bereitstellt.
 * @author Marc & Gemini
 * @version 2.2.0
 */
const random = require('canvas-sketch-util/random');

/**
 * Zeichnet einen einzelnen, gefüllten Kreis am Ursprung des Kontexts (0,0).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius des Kreises.
 * @param {object} color - Ein Farbobjekt mit einer .hex und optional .alpha Eigenschaft.
 */
function drawSingleDot(context, radius, color) {
  context.save();
  context.fillStyle = color.hex;
  context.globalAlpha = color.alpha || 1;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/**
 * Zeichnet einen Kreisbogen am Ursprung des Kontexts (0,0).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius des Bogens.
 * @param {object} color - Ein Farbobjekt mit .hex und .alpha Eigenschaften.
 * @param {number} lineWidth - Die Dicke der Bogenlinie.
 * @param {number} startAngle - Der Startwinkel in Radiant.
 * @param {number} endAngle - Der Endwinkel in Radiant.
 * @param {boolean} [isClockwise=false] - Die Zeichenrichtung.
 */
function drawArc(context, radius, color, lineWidth, startAngle, endAngle, isClockwise = false) {
  context.save();
  context.lineWidth = lineWidth;
  context.strokeStyle = color.hex;
  context.globalAlpha = color.alpha || 1;
  context.beginPath();
  context.arc(0, 0, radius, startAngle, endAngle, isClockwise);
  context.stroke();
  context.restore();
}

/**
 * Zeichnet die Kontur eines Kreises am Ursprung des Kontexts (0,0).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius des Kreises.
 * @param {object} color - Ein Farbobjekt mit .hex und .alpha Eigenschaften.
 * @param {number} lineWidth - Die Dicke der Konturlinie.
 */
function drawOutline(context, radius, color, lineWidth) {
  context.save();
  context.strokeStyle = color.hex;
  context.globalAlpha = color.alpha || 1;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

/**
 * Zeichnet einen "Circumpunct" am Ursprung des Kontexts (0,0).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} outerRadius - Der Radius des äusseren Kreises.
 * @param {object} color - Ein Farbobjekt.
 * @param {number} innerRadius - Der Radius des inneren Punktes.
 * @param {number} lineWidth - Die Dicke der Konturlinie des äusseren Kreises.
 */
function drawCircumpunct(context, outerRadius, color, innerRadius, lineWidth) {
  drawOutline(context, outerRadius, color, lineWidth);
  drawSingleDot(context, innerRadius, color);
}

/**
 * Zeichnet mehrere konzentrische Kreise.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} maxRadius - Der maximale Radius für den äussersten Kreis.
 * @param {object} color - Das Farbobjekt.
 * @param {number} numCircles - Die Anzahl der zu zeichnenden Kreise.
 * @param {number} lineWidth - Die Linienstärke für die Kreise.
 * @param {boolean} ordered - Ob die Abstände gleichmässig oder zufällig sein sollen.
 */
function drawConcentricDots(context, maxRadius, color, numCircles, lineWidth, ordered) {
  for (let i = 1; i <= numCircles; i++) {
    const radius = ordered
      ? (i / numCircles) * maxRadius
      : random.range(0.1, 1) * maxRadius;
    drawOutline(context, radius, color, lineWidth);
  }
}

/**
 * Zeichnet einen Kreis aus segmentierten Punkten.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius des Kreises, auf dem die Punkte liegen.
 * @param {object} color - Das Farbobjekt.
 * @param {number} dotRadius - Der Radius der einzelnen Punkte.
 * @param {number} numSegments - Die Anzahl der Segmente (Punkte).
 * @param {number} lineWidth - Die Dicke der Punkte (kann 0 sein für gefüllte Kreise).
 */
function drawSegmentedDots(context, radius, color, dotRadius, numSegments, lineWidth) {
  for (let i = 0; i < numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    context.save();
    context.translate(x, y);
    if (lineWidth > 0) {
      drawOutline(context, dotRadius, color, lineWidth);
    } else {
      drawSingleDot(context, dotRadius, color);
    }
    context.restore();
  }
}

/**
 * Füllt einen Bereich mit zufällig platzierten Punkten (Stippling).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} maxRadius - Der Radius des Bereichs, der gefüllt werden soll.
 * @param {object} color - Das Farbobjekt.
 * @param {number} density - Ein Faktor zur Steuerung der Punktdichte.
 * @param {number} dotSizeFactor - Ein Faktor zur Steuerung der Punktgrösse.
 */
function drawSplash(context, maxRadius, color, density, dotSizeFactor) {
  const numDots = 200 * density;
  for (let i = 0; i < numDots; i++) {
    const angle = random.range(0, Math.PI * 2);
    const radius = random.range(0, maxRadius) * Math.sqrt(random.range(0, 1));
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const dotRadius = Math.abs(random.gaussian(0, maxRadius * 0.05 * dotSizeFactor));

    context.save();
    context.translate(x, y);
    drawSingleDot(context, dotRadius, color);
    context.restore();
  }
}

/**
 * Zeichnet einen radialen Farbverlauf.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius des Verlaufs.
 * @param {object} color - Das Farbobjekt. Die .hex Eigenschaft wird als Endfarbe verwendet.
 */
function drawRadialGradient(context, radius, color) {
  context.save();
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, color.hex);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/**
 * Zeichnet eine radiale Vignette.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} radius - Der Radius der Vignette.
 * @param {object} color - Das Farbobjekt. Die .hex Eigenschaft wird als Startfarbe verwendet.
 */
function drawRadialVignette(context, radius, color) {
  context.save();
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, color.hex);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

// Exportiert die Funktionen, damit sie in anderen Modulen importiert werden können.
module.exports = {
  drawSingleDot,
  drawArc,
  drawOutline,
  drawCircumpunct,
  drawConcentricDots,
  drawSegmentedDots,
  drawSplash,
  drawRadialGradient,
  drawRadialVignette
};