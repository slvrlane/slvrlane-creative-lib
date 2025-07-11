/**
 * @file Ein Modul mit Hilfsfunktionen für canvas-sketch Projekte.
 * Beinhaltet Farbmanagement, Seed-Initialisierung, Grain-Effekte und eine Footer-Funktion.
 * @author Marc & Gemini
 * @version 2.5.0
 */

const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

/**
 * Initialisiert einen Seed für den Zufallsgenerator.
 * Stellt sicher, dass die Generierung eines neuen Seeds nicht den Zustand des Haupt-Generators beeinflusst.
 * @param {number | string} [seed=0] - Ein spezifischer Seed. Bei 0 oder leer wird ein zufälliger Seed verwendet.
 * @returns {string} Der verwendete Seed.
 */
function initiateSeed(seed = 0) {
  let seedToUse = seed;
  if (seed === 0 || !seed) {
    seedToUse = String(Math.floor(Math.random() * 1000000));
  }
  // Gib den Seed als String zurück. Das Setzen passiert im Hauptskript.
  return String(seedToUse);
}

/**
 * Wählt eine Farbe aus. Kann eine spezifische Farbe oder eine zufällige Riso-Farbe zurückgeben.
 * @param {string} [colorName=""] - Der Name einer Farbe (z.B. 'red', '#ff0000') oder ein Riso-Farbname.
 * Wenn leer, wird eine zufällige Riso-Farbe gewählt.
 * @param {number} [alpha=1] - Der Alpha-Wert (Transparenz) der Farbe.
 * @returns {object} Ein Objekt mit den Eigenschaften name, hex und alpha.
 */
function myColors(colorName = "", alpha = 1) {
  let color;
  if (colorName === "") {
    color = random.pick(risoColors);
  } else {
    const risoColor = risoColors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (risoColor) {
      color = risoColor;
    } else {
      const parsed = Color.parse(colorName);
      if (parsed) {
        color = { name: colorName, hex: Color.style(parsed.rgb) };
      } else {
        console.warn(`Farbe "${colorName}" nicht gefunden, wähle zufällige Riso-Farbe.`);
        color = random.pick(risoColors);
      }
    }
  }
  return { ...color, alpha };
}

/**
 * Fügt einen "Grain"-Effekt zum Canvas hinzu, basierend auf Dichte und Korngrösse.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} width - Die Breite des Canvas.
 * @param {number} height - Die Höhe des Canvas.
 * @param {number} [density=0.25] - Der prozentuale Anteil der Pixel, die zu Körnern werden (0 bis 1).
 * @param {number} [grainSize=1] - Die Grösse der einzelnen Körner in Pixel (z.B. 1 für 1x1, 2 für 2x2).
 */
function addGrain(context, width, height, density = 0.25, grainSize = 1) {
  context.save();
  context.globalCompositeOperation = 'multiply';
  const totalPixels = width * height;
  const amount = Math.floor(totalPixels * density / (grainSize * grainSize));

  for (let i = 0; i < amount; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    const alpha = random.range(0.5, 0.9);
    context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    context.fillRect(x, y, grainSize, grainSize);
  }
  context.restore();
}

/**
 * Zeichnet eine Fusszeile mit Informationen zum generierten Bild auf den Canvas.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} width - Die Breite des Canvas.
 * @param {number} height - Die Höhe des Canvas.
 * @param {object} seeds - Ein Objekt mit den Seeds, z.B. { shape: '123', color: '456' }.
 * @param {object} settings - Das Settings-Objekt von canvas-sketch.
 * @param {Array<object>} colorList - Ein Array von Farbobjekten, die angezeigt werden sollen.
 */
function printFooter(context, width, height, seeds, settings, colorList) {
  context.save();
  context.globalCompositeOperation = 'source-over';

  const fontSize = Math.min(width, height) * 0.015;
  const boxHeight = fontSize * 1.5;
  const padding = fontSize * 0.5;
  const boxWidth = width * 0.4; // Etwas breiter für die zwei Seeds

  context.font = `${fontSize}px Inter, sans-serif`;
  let currentY = height - padding;

  const drawLine = (text, colorObj = null) => {
    context.translate(0, -boxHeight - (padding / 2));
    context.fillStyle = "rgba(255, 255, 255, 0.85)";
    context.fillRect(0, 0, boxWidth, boxHeight);

    if (colorObj) {
      context.fillStyle = colorObj.hex;
      context.fillRect(padding, padding / 2, fontSize, fontSize);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    const textX = colorObj ? padding * 2 + fontSize : padding;
    context.fillText(text, textX, padding + fontSize * 0.8);
  };

  context.translate(padding, currentY);

  const dimText = `${settings.dimensions[0]}x${settings.dimensions[1]}px`;
  drawLine(dimText);

  // Zeige beide Seeds an
  if (seeds && seeds.color) drawLine(`Color Seed: ${seeds.color}`);
  if (seeds && seeds.shape) drawLine(`Shape Seed: ${seeds.shape}`);

  colorList.slice().reverse().forEach((color) => {
    const colorText = `${color.name} (${color.hex}, α=${color.alpha})`;
    drawLine(colorText, color);
  });

  context.restore();
}


module.exports = {
  initiateSeed,
  myColors,
  addGrain,
  printFooter,
};
