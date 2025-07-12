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
 * Diese Variante nutzt ImageData, das heisst, sie geht Pixel für Pixel durch und verschiebt die Farben
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} size - die Grösse des Sketches als Array
 * @param {String} style - die Art des Korns, colorfull, parallel, red, invert
 */
function addGrain(context, size, style = "parallelGrain") {
  // Graupunkte hinzufügen
  let grain = context.getImageData(0, 0, size[0], size[1]);
  let grainPixels = grain.data;

  const colorGrain = (context, grain, grainPixels) => {
    // variiert alle Farbwerte individuell
    for (let i = 0; i < grainPixels.length; i += 4) {
      let rMin = -25;
      let rMax = 25;
      grainPixels[i + 0] += random.range(rMin, rMax);
      grainPixels[i + 1] += random.range(rMin, rMax);
      grainPixels[i + 2] += random.range(rMin, rMax);
      grainPixels[i + 3] = 255;
    }

    context.putImageData(grain, 0, 0);
  };

  const parallelGrain = (context, grain, grainPixels) => {
    // variiert alle Farbwerte gleich
    for (let i = 0; i < grainPixels.length; i += 4) {
      let variant = random.range(-15, 15);
      grainPixels[i + 0] += variant;
      grainPixels[i + 1] += variant;
      grainPixels[i + 2] += variant;
      grainPixels[i + 3] = 255;
    }

    context.putImageData(grain, 0, 0);
  };
  const redGrain = (context, grain, grainPixels) => {
    // verschiebt nur die Rotwerte individuell
    for (let i = 0; i < grainPixels.length; i += 4) {
      let variant = random.range(50, 100);
      grainPixels[i + 0] += variant;
      grainPixels[i + 1] -= variant * 0.5;
      grainPixels[i + 2] -= variant * 0.5;
    }

    context.putImageData(grain, 0, 0);
  };

  const invert = (context, grain, grainPixels) => {
    for (let i = 0; i < grainPixels.length; i += 4) {
      grainPixels[i] = 255 - grainPixels[i]; // red
      grainPixels[i + 1] = 255 - grainPixels[i + 1]; // green
      grainPixels[i + 2] = 255 - grainPixels[i + 2]; // blue
    }
    context.putImageData(grain, 0, 0);
  };

  switch (style) {
    case "colorful":
      return colorGrain(context, grain, grainPixels);
    case "parallel":
      return parallelGrain(context, grain, grainPixels);
    case "red":
      return redGrain(context, grain, grainPixels);
    case "invert":
      return invert(context, grain, grainPixels);
  }
};


/**
 * Supoptimale Variante. Evtl. verbessern.
 * Fügt einen "Grain"-Effekt zum Canvas hinzu, basierend auf Dichte und Korngrösse.
 * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext.
 * @param {number} width - Die Breite des Canvas.
 * @param {number} height - Die Höhe des Canvas.
 * @param {number} [density=0.25] - Der prozentuale Anteil der Pixel, die zu Körnern werden (0 bis 1).
 * @param {number} [grainSize=1] - Die Grösse der einzelnen Körner in Pixel (z.B. 1 für 1x1, 2 für 2x2).
 */
function addGrain2(context, width, height, density = 0.25, grainSize = 1) {
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
  addGrain2,
  printFooter,
};
