/**
 * @file Ein Modul, das verschiedene Funktionen zum Zeichnen von punkt- und bogenbasierten Formen auf einem HTML-Canvas bereitstellt.
 * @author Marc & Gemini
 * @version 2.1.0
 */

/**
 * Zeichnet einen einzelnen, gefüllten Kreis.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} x - Die x-Koordinate des Mittelpunkts.
 * @param {number} y - Die y-Koordinate des Mittelpunkts.
 * @param {number} radius - Der Radius des Kreises.
 * @param {object} color - Ein Farbobjekt mit einer .hex Eigenschaft (z.B. aus helpersV2).
 */
function drawSingleDot(context, x, y, radius, color) {
  context.save();
  context.fillStyle = color.hex;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/**
 * Zeichnet einen Kreisbogen (ein "Spaghetti"-Segment).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} x - Die x-Koordinate des Mittelpunkts des Bogens.
 * @param {number} y - Die y-Koordinate des Mittelpunkts des Bogens.
 * @param {number} radius - Der Radius des Bogens.
 * @param {object} color - Ein Farbobjekt mit .hex und .alpha Eigenschaften.
 * @param {number} lineWidth - Die Dicke der Bogenlinie.
 * @param {number} startAngle - Der Startwinkel in Radiant.
 * @param {number} endAngle - Der Endwinkel in Radiant.
 * @param {boolean} [isClockwise=false] - Die Zeichenrichtung. false für gegen den Uhrzeigersinn.
 */
function drawArc(context, x, y, radius, color, lineWidth, startAngle, endAngle, isClockwise = false) {
  context.save();
  context.lineWidth = lineWidth;
  context.strokeStyle = color.hex;
  context.globalAlpha = color.alpha || 1;
  context.beginPath();
  context.arc(x, y, radius, startAngle, endAngle, isClockwise);
  context.stroke();
  context.restore();
}

/**
 * Zeichnet die Kontur eines Kreises.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} x - Die x-Koordinate des Mittelpunkts.
 * @param {number} y - Die y-Koordinate des Mittelpunkts.
 * @param {number} radius - Der Radius des Kreises.
 * @param {object} color - Ein Farbobjekt mit .hex und .alpha Eigenschaften.
 * @param {number} lineWidth - Die Dicke der Konturlinie.
 */
function drawOutline(context, x, y, radius, color, lineWidth) {
  context.save();
  context.strokeStyle = color.hex;
  context.globalAlpha = color.alpha || 1;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

/**
 * Zeichnet einen "Circumpunct" (einen Punkt innerhalb eines Kreises).
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} x - Die x-Koordinate des Mittelpunkts.
 * @param {number} y - Die y-Koordinate des Mittelpunkts.
 * @param {number} outerRadius - Der Radius des äusseren Kreises.
 * @param {object} color - Ein Farbobjekt.
 * @param {number} innerRadius - Der Radius des inneren Punktes.
 * @param {number} lineWidth - Die Dicke der Konturlinie des äusseren Kreises.
 */
function drawCircumpunct(context, x, y, outerRadius, color, innerRadius, lineWidth) {
  drawOutline(context, x, y, outerRadius, color, lineWidth);
  drawSingleDot(context, x, y, innerRadius, color);
}


// Exportiert die Funktionen, damit sie in anderen Modulen importiert werden können.
module.exports = {
  drawSingleDot,
  drawArc,
  drawOutline,
  drawCircumpunct,
};
