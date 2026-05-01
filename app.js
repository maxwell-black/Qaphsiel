let words = [];
let verses = [];
let cumsum = [];
let cumsumMap = new Map();
let isLoaded = false;
let kjvText = "";

// Pagination state
const RESULTS_PER_PAGE = 10;
let currentPage = 1;
let currentGroupedResults = [];
let currentInputText = "";
let currentInputAQ = 0;

const OEDIPUS_STOP_WORDS = new Set([
  "god",
  "lord",
  "man",
  "king",
  "father",
  "son",
  "jesus",
  "christ",
  "spirit",
  "holy",
  "heaven",
  "angel",
  "prophet",
  "priest",
  "david",
  "moses",
  "israel",
  "judah",
  "saul",
  "solomon",
  "amen",
]);

// Math / AQ Utility Functions
function charToAqValue(char) {
  if (char >= "A" && char <= "Z")
    return 10 + (char.charCodeAt(0) - "A".charCodeAt(0));
  if (char >= "a" && char <= "z")
    return 10 + (char.charCodeAt(0) - "a".charCodeAt(0));
  if (char >= "0" && char <= "9") return parseInt(char, 10);
  return null;
}

function calculateAQ(word) {
  let sum = 0;
  for (let char of word) {
    const value = charToAqValue(char);
    if (value !== null) sum += value;
  }
  return sum;
}

function calculateStringAQ(text) {
  const useOedipus =
    document.getElementById("oedipusFilter") &&
    document.getElementById("oedipusFilter").checked;
  let wordList = text.toLowerCase().match(/[a-z0-9]+/gi) || [];
  if (useOedipus) {
    wordList = wordList.filter((w) => !OEDIPUS_STOP_WORDS.has(w));
  }
  return wordList.reduce((sum, word) => sum + calculateAQ(word), 0);
}

function toBase36(n) {
  if (n === 0) return "0";
  const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const negative = n < 0;
  let value = Math.abs(n);
  let result = "";
  while (value > 0) {
    const remainder = value % 36;
    result = digits[remainder] + result;
    value = Math.floor(value / 36);
  }
  return negative ? "-" + result : result;
}

function digitalRoot(n) {
  let value = Math.abs(n);
  if (value === 0) return 0;
  while (value >= 10) {
    let sum = 0;
    while (value > 0) {
      sum += value % 10;
      value = Math.floor(value / 10);
    }
    value = sum;
  }
  return value;
}

function sumOfDivisors(n) {
  const value = Math.abs(n);
  if (value === 0) return 0;
  let sum = 0;
  const limit = Math.floor(Math.sqrt(value));
  for (let i = 1; i <= limit; i++) {
    if (value % i === 0) {
      sum += i;
      const other = value / i;
      if (other !== i) sum += other;
    }
  }
  return sum;
}

function isPerfectSquare(n) {
  if (n < 0) return false;
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

function isTriangular(n) {
  if (n < 0) return false;
  return isPerfectSquare(8 * n + 1);
}

// CCRU Esoteric Math Functions
function getNumogramDemon(n) {
  const root = digitalRoot(n);
  // Five CCRU syzygetic demons, each associated with both zones of its syzygy
  const demons = {
    0: "Uttunul (Zone 0)", // 9::0 Plex
    1: "Murmur (Zone 1)", // 8::1 Surge
    2: "Oddubb (Zone 2)", // 7::2
    3: "Djynxx (Zone 3)", // 6::3 Warp
    4: "Katak (Zone 4)", // 5::4 Sink
    5: "Katak (Zone 5)",
    6: "Djynxx (Zone 6)",
    7: "Oddubb (Zone 7)",
    8: "Murmur (Zone 8)",
    9: "Uttunul (Zone 9)",
  };
  return demons[root] || "Unknown";
}

const HEXAGRAMS = [
  "1. 乾 (Force)",
  "2. 坤 (Field)",
  "3. 屯 (Sprouting)",
  "4. 蒙 (Enveloping)",
  "5. 需 (Attending)",
  "6. 訟 (Arguing)",
  "7. 師 (Leading)",
  "8. 比 (Grouping)",
  "9. 小畜 (Small Accumulating)",
  "10. 履 (Treading)",
  "11. 泰 (Pervading)",
  "12. 否 (Obstruction)",
  "13. 同人 (Concording People)",
  "14. 大有 (Great Possessing)",
  "15. 謙 (Humbling)",
  "16. 豫 (Providing-For)",
  "17. 隨 (Following)",
  "18. 蠱 (Corrupting)",
  "19. 臨 (Nearing)",
  "20. 觀 (Viewing)",
  "21. 噬嗑 (Gnawing Bite)",
  "22. 賁 (Adorning)",
  "23. 剝 (Stripping)",
  "24. 復 (Returning)",
  "25. 無妄 (Without Embroiling)",
  "26. 大畜 (Great Accumulating)",
  "27. 頤 (Swallowing)",
  "28. 大過 (Great Exceeding)",
  "29. 坎 (Gorge)",
  "30. 離 (Radiance)",
  "31. 咸 (Conjoining)",
  "32. 恆 (Persevering)",
  "33. 遯 (Retiring)",
  "34. 大壯 (Great Invigorating)",
  "35. 晉 (Prospering)",
  "36. 明夷 (Darkening of the Light)",
  "37. 家人 (Dwelling People)",
  "38. 睽 (Polarising)",
  "39. 蹇 (Limping)",
  "40. 解 (Taking-Apart)",
  "41. 損 (Diminishing)",
  "42. 益 (Augmenting)",
  "43. 夬 (Parting)",
  "44. 姤 (Coupling)",
  "45. 萃 (Clustering)",
  "46. 升 (Ascending)",
  "47. 困 (Confining)",
  "48. 井 (Well)",
  "49. 革 (Skinning)",
  "50. 鼎 (Holding)",
  "51. 震 (Shake)",
  "52. 艮 (Bound)",
  "53. 漸 (Infiltrating)",
  "54. 歸妹 (Converting the Maiden)",
  "55. 豐 (Abounding)",
  "56. 旅 (Sojourning)",
  "57. 巽 (Ground)",
  "58. 兌 (Open)",
  "59. 渙 (Dispersion)",
  "60. 節 (Articulating)",
  "61. 中孚 (Inner Truth)",
  "62. 小過 (Small Exceeding)",
  "63. 既濟 (Already Fording)",
  "64. 未濟 (Not Yet Fording)",
];

function getMeshTag(n) {
  const root = digitalRoot(n);
  return root === 0
    ? "0000"
    : (Math.pow(2, root) - 1).toString().padStart(4, "0");
}

function getDoor(n) {
  const doors = {
    1: "Lurgo (1::0)",
    2: "Duoddod (2::0)",
    3: "Ixix (3::0)",
    4: "Krako (4::0)",
    5: "Tokhatto (5::0)",
    6: "Tchu (6::0)",
    7: "Puppo (7::0)",
    8: "Minommo (8::0)",
    9: "Uttunul (9::0)",
  };
  return doors[digitalRoot(n)] || null;
}

function getTractorCurrent(n) {
  const currents = { 1: "Sink", 3: "Warp", 5: "Hold", 7: "Surge", 9: "Plex" };
  return currents[digitalRoot(n)] || null;
}

function getHexagram(n) {
  if (n === 0) return "None";
  const mod = n % 64;
  const index = mod === 0 ? 63 : mod - 1;
  return HEXAGRAMS[index];
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

const primesList = [2];
function getPrimeIndex(p) {
  if (p < 2) return 0;
  let currentPrime = primesList[primesList.length - 1];
  while (currentPrime < p) {
    currentPrime++;
    if (isPrime(currentPrime)) {
      primesList.push(currentPrime);
    }
  }
  return primesList.indexOf(p) + 1;
}

function getNthPrime(n) {
  if (n < 1) return 0;
  let currentPrime = primesList[primesList.length - 1];
  while (primesList.length < n) {
    currentPrime++;
    if (isPrime(currentPrime)) {
      primesList.push(currentPrime);
    }
  }
  return primesList[n - 1];
}

function primeFactorization(n) {
  if (n <= 1) return [];
  let factors = [];
  let divisor = 2;
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

function xenotate(n) {
  if (n === 0) return "0";
  if (n === 1) return "";
  if (n === 2) return "•";

  if (isPrime(n)) {
    const idx = getPrimeIndex(n);
    return "(" + xenotate(idx) + ")";
  }

  const factors = primeFactorization(n);
  factors.sort((a, b) => b - a);
  let result = "";
  factors.forEach((f) => {
    result += xenotate(f);
  });
  return result;
}

function unxenotate(str) {
  if (!str) return 1;
  let factors = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
      if (depth === 0) {
        factors.push(current);
        current = "";
      }
    } else if (char === "•" || char === ":" || char === ".") {
      if (depth === 0) {
        factors.push(char);
      } else {
        current += char;
      }
    } else if (char === " ") {
      continue;
    } else {
      if (depth > 0) current += char;
    }
  }

  let product = 1;
  factors.forEach((f) => {
    if (f === "•" || f === ":" || f === ".") {
      product *= 2;
    } else if (f.startsWith("(") && f.endsWith(")")) {
      let inner = f.substring(1, f.length - 1);
      let innerVal = unxenotate(inner);
      product *= getNthPrime(innerVal);
    }
  });
  return product;
}

function getHyperprimeResonances(targetAQ) {
  let targets = [targetAQ];
  if (targetAQ > 0) {
    if (targetAQ < 1000) {
      let nth = getNthPrime(targetAQ);
      if (nth) targets.push(nth);
    }
    if (isPrime(targetAQ)) {
      let idx = getPrimeIndex(targetAQ);
      targets.push(idx);
    }
  }
  return targets;
}

function findLexicalTwins(targetAQ) {
  const twins = new Set();
  words.forEach((w) => {
    if (w.aq === targetAQ) {
      twins.add(w.word);
    }
  });
  const arr = Array.from(twins);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 15);
}

function generateNumogramSVG(inputAQ) {
  const containerId = "numogram-" + Math.random().toString(36).slice(2, 10);
  setTimeout(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML =
      '<svg id="numogram-svg" viewBox="0 0 520 560" width="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Numogram zone relations"></svg>';
    const zone = digitalRoot(inputAQ);
    if (typeof window.renderZone === "function") {
      window.renderZone(zone);
    }
  }, 0);
  return `<div id="${containerId}" class="numogram-container" style="max-width: 520px; margin: 0 auto;"></div>`;
}

function generateHexagramSVG(inputAQ) {
  if (inputAQ === 0) return "";
  const mod = inputAQ % 64;
  const index = mod === 0 ? 63 : mod - 1;
  let bin = index.toString(2).padStart(6, "0");

  let svg = `<svg viewBox="0 0 100 120" width="80" height="100" style="margin: auto; display: block;">`;
  for (let i = 0; i < 6; i++) {
    let bit = bin[i];
    let y = 10 + i * 16;
    if (bit === "1") {
      svg += `<rect x="10" y="${y}" width="80" height="8" fill="var(--primary-color)"/>`;
    } else {
      svg += `<rect x="10" y="${y}" width="35" height="8" fill="var(--primary-color)"/>`;
      svg += `<rect x="55" y="${y}" width="35" height="8" fill="var(--primary-color)"/>`;
    }
  }
  svg += `</svg>`;
  return svg;
}

function parseVerseRef(line) {
  const match = line.match(/^([A-Za-z0-9\s]+?)\s+(\d+):(\d+)\t/);
  if (match) {
    return {
      book: match[1].trim(),
      chapter: parseInt(match[2]),
      verse: parseInt(match[3]),
      fullRef: `${match[1].trim()} ${match[2]}:${match[3]}`,
    };
  }
  return null;
}

function extractWords(text) {
  return text.toLowerCase().match(/[a-z0-9]+/gi) || [];
}

function parseBible() {
  words = [];
  verses = [];
  cumsum = [0];
  cumsumMap = new Map();

  const useOedipus =
    document.getElementById("oedipusFilter") &&
    document.getElementById("oedipusFilter").checked;
  const lines = kjvText.split("\n");

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const verseRef = parseVerseRef(line);
    if (!verseRef) continue;

    const tabIndex = line.indexOf("\t");
    if (tabIndex === -1) continue;

    const verseText = line.substring(tabIndex + 1);
    let verseWords = extractWords(verseText);

    if (useOedipus) {
      verseWords = verseWords.filter((w) => !OEDIPUS_STOP_WORDS.has(w));
    }

    verses.push({
      ref: verseRef,
      text: verseText, // Original text for context
      wordIndices: [],
      startWordIndex: undefined,
      endWordIndexExclusive: undefined,
    });

    const verseIndex = verses.length - 1;
    const verseStartWordIndex = words.length;

    for (let word of verseWords) {
      const aq = calculateAQ(word);
      const wordIndex = words.length;
      words.push({ word: word, aq: aq, verseIndex: verseIndex });
      verses[verseIndex].wordIndices.push(wordIndex);
    }

    verses[verseIndex].startWordIndex = verseStartWordIndex;
    verses[verseIndex].endWordIndexExclusive = words.length;
  }

  cumsum = [0];
  for (let i = 0; i < words.length; i++) {
    cumsum.push(cumsum[i] + words[i].aq);
  }

  for (let i = 0; i < cumsum.length; i++) {
    const sum = cumsum[i];
    if (!cumsumMap.has(sum)) {
      cumsumMap.set(sum, []);
    }
    cumsumMap.get(sum).push(i);
  }

  console.log(
    `Parsed ${words.length} words from ${verses.length} verses. Oedipus Filter: ${useOedipus}`,
  );
}

async function loadBible() {
  try {
    const bibleResp = await fetch("kjv.txt");
    if (!bibleResp.ok) throw new Error("Failed to fetch kjv.txt");
    kjvText = await bibleResp.text();
    parseBible();

    isLoaded = true;
    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.opacity = "0";
    setTimeout(() => (loadingOverlay.style.display = "none"), 500);
  } catch (error) {
    console.error("Error loading Bible:", error);
    document.getElementById("loadingText").textContent =
      "Error loading Bible text. Please ensure you are running this via a local server (e.g. python -m http.server 8000).";
    document.querySelector(".spinner").style.display = "none";
  }
}

function getPhraseText(startIndex, endIndex) {
  if (startIndex >= endIndex || endIndex > words.length) return "";
  let phraseWords = [];
  for (let i = startIndex; i < endIndex; i++) {
    phraseWords.push(words[i].word);
  }
  return phraseWords.join(" ");
}

function searchAQ(targetAQ, maxWords, phraseScope) {
  const results = [];
  const seen = new Set();
  const scope = phraseScope === "cross" ? "cross" : "within";

  if (scope === "within") {
    for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
      const verse = verses[verseIndex];
      const startWordIndex = verse.startWordIndex;
      const endWordIndex = verse.endWordIndexExclusive;
      if (startWordIndex === undefined || endWordIndex === undefined) continue;
      if (endWordIndex <= startWordIndex) continue;

      for (let i = startWordIndex; i < endWordIndex; i++) {
        const targetSum = cumsum[i] + targetAQ;
        const matches = cumsumMap.get(targetSum) || [];
        for (let j of matches) {
          if (j <= i) continue;
          if (j > endWordIndex) continue;
          if (j > i + maxWords) continue;

          const startIndex = i;
          const endIndex = j;
          const key = `${startIndex}-${endIndex}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const wordCount = endIndex - startIndex;
          const phraseText = getPhraseText(startIndex, endIndex);
          const startVerseIndex = words[startIndex].verseIndex;
          const endVerseIndex = words[endIndex - 1].verseIndex;
          results.push({
            startRef: verses[startVerseIndex].ref.fullRef,
            endRef: verses[endVerseIndex].ref.fullRef,
            startVerseIndex: startVerseIndex,
            endVerseIndex: endVerseIndex,
            text: phraseText,
            wordCount: wordCount,
            startIndex: startIndex,
            endIndex: endIndex,
          });
        }
      }
    }
  } else {
    for (let i = 0; i < words.length; i++) {
      const targetSum = cumsum[i] + targetAQ;
      const matches = cumsumMap.get(targetSum) || [];
      for (let j of matches) {
        if (j <= i) continue;
        if (j > i + maxWords) continue;
        if (j > words.length) continue;

        const startIndex = i;
        const endIndex = j;
        const key = `${startIndex}-${endIndex}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const wordCount = endIndex - startIndex;
        const phraseText = getPhraseText(startIndex, endIndex);
        const startVerseIndex = words[startIndex].verseIndex;
        const endVerseIndex = words[endIndex - 1].verseIndex;
        results.push({
          startRef: verses[startVerseIndex].ref.fullRef,
          endRef: verses[endVerseIndex].ref.fullRef,
          startVerseIndex: startVerseIndex,
          endVerseIndex: endVerseIndex,
          text: phraseText,
          wordCount: wordCount,
          startIndex: startIndex,
          endIndex: endIndex,
        });
      }
    }
  }
  return results;
}

function formatRefRange(refInfo) {
  if (!refInfo) return "";
  if (refInfo.startRef === refInfo.endRef) return refInfo.startRef;
  return `${refInfo.startRef} \u2013 ${refInfo.endRef}`;
}

function displayResults(results, inputText, inputAQ) {
  const statsDiv = document.getElementById("stats");
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.style.display = "block";

  const grouped = new Map();
  results.forEach((result) => {
    const phraseKey = result.text.toLowerCase();
    if (!grouped.has(phraseKey)) {
      grouped.set(phraseKey, {
        text: result.text,
        wordCount: result.wordCount,
        refs: [],
        startIndex: result.startIndex,
        endIndex: result.endIndex,
      });
    }
    grouped.get(phraseKey).refs.push({
      startRef: result.startRef,
      endRef: result.endRef,
      startVerseIndex: result.startVerseIndex,
      endVerseIndex: result.endVerseIndex,
    });
  });

  const groupedArray = Array.from(grouped.values());
  groupedArray.forEach((group) => {
    group.refs.sort((a, b) => {
      if (a.startVerseIndex !== b.startVerseIndex)
        return a.startVerseIndex - b.startVerseIndex;
      return a.endVerseIndex - b.endVerseIndex;
    });
  });

  const inputLower = inputText.toLowerCase();
  groupedArray.sort((a, b) => {
    const aExact = a.text.toLowerCase() === inputLower;
    const bExact = b.text.toLowerCase() === inputLower;
    if (aExact && !bExact) return -1;
    if (bExact && !aExact) return 1;
    if (b.wordCount !== a.wordCount) return b.wordCount - a.wordCount;
    return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
  });

  currentGroupedResults = groupedArray;
  currentInputText = inputText;
  currentInputAQ = inputAQ;
  currentPage = 1;

  const totalPhrases = groupedArray.length;
  const totalOccurrences = results.length;

  // Calculate CCRU Metadata
  const numogramDemon = getNumogramDemon(inputAQ);
  const hexagram = getHexagram(inputAQ);
  const xenotationStr = xenotate(inputAQ);
  const lexicalTwins = findLexicalTwins(inputAQ).join(", ");
  const root = digitalRoot(inputAQ);
  const syzygy = root === 0 || root === 9 ? (root === 0 ? 9 : 0) : 9 - root;
  const imps = Math.pow(2, root);

  const timeCircuit = [1, 2, 4, 8, 7, 5];
  const circuitIndex = timeCircuit.indexOf(root);
  let timeCircuitFlow;
  if (circuitIndex !== -1) {
    const nextNode = timeCircuit[(circuitIndex + 1) % timeCircuit.length];
    timeCircuitFlow = `${root} &rarr; ${nextNode}`;
  } else if (root === 3 || root === 6) {
    timeCircuitFlow = "Warp (vortical)";
  } else {
    timeCircuitFlow = "Plex (outer bound)";
  }

  const activeTab = document
    .querySelector(".tab-btn.active")
    ?.getAttribute("data-tab");
  const showVerses =
    activeTab === "text-search" || activeTab === "number-search";

  let foundText = "";
  if (showVerses) {
    foundText = `
        <div class="ccru-metadata" style="text-align: center; padding: 0.5rem; margin-top: 0;">
            <p style="margin: 0;">Found <strong>${totalPhrases}</strong> unique phrase${totalPhrases !== 1 ? "s" : ""} across <strong>${totalOccurrences}</strong> occurrence${totalOccurrences !== 1 ? "s" : ""}.</p>
        </div>`;
  }

  statsDiv.innerHTML = `
        <div class="ccru-metadata" style="margin-top: 0;">
            <p><strong>AQ Value:</strong> ${inputAQ} &middot; <strong>Digital Root:</strong> ${root}</p>
            <p><strong>Pandemonium:</strong> ${numogramDemon} &middot; <strong>${imps} Imps</strong></p>
            <p><strong>Syzygy Twin:</strong> ${syzygy} &middot; <strong>Time-Circuit Flow:</strong> ${timeCircuitFlow}</p>
            <p><strong>Mesh-Tag:</strong> ${getMeshTag(inputAQ)} &middot; <strong>Door:</strong> ${getDoor(inputAQ) || "None (Zone 0)"}</p>
            <p><strong>Tractor Current:</strong> ${getTractorCurrent(inputAQ) || "Non-tractor zone"}</p>
            
            <div style="position: relative; margin: 15px 0; min-height: 500px;">
                <div style="width: 100%; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; letter-spacing: 4px; color: var(--primary-color); font-family: 'Courier New', monospace; font-size: 1.1rem;">NUMOGRAM</p>
                    ${generateNumogramSVG(inputAQ)}
                </div>
                <div style="position: absolute; bottom: 10px; right: 10px; text-align: center; background: rgba(0,0,0,0.6); border: 1px solid var(--border-color); border-radius: 0; padding: 10px; min-width: 140px;">
                    <p style="margin: 0 0 5px 0; font-size: 0.85rem;"><strong>I Ching:</strong></p>
                    <p style="margin: 0 0 5px 0; font-size: 0.8rem; color: var(--text-muted);">${hexagram}</p>
                    ${generateHexagramSVG(inputAQ)}
                </div>
            </div>

            <p><strong>Xenotation:</strong> <span class="xenotation">${xenotationStr}</span></p>
            <p><strong>Lexical Twins:</strong> <span style="color: var(--text-muted);">${lexicalTwins || "None found"}</span></p>
        </div>
        ${foundText}
    `;

  renderCurrentPage();
}

function renderCurrentPage() {
  const resultsDiv = document.getElementById("results");
  const paginationTopDiv = document.getElementById("paginationTop");
  const paginationBottomDiv = document.getElementById("paginationBottom");

  const activeTab = document
    .querySelector(".tab-btn.active")
    ?.getAttribute("data-tab");
  const showVerses =
    activeTab === "text-search" || activeTab === "number-search";

  if (!showVerses) {
    paginationTopDiv.style.display = "none";
    paginationBottomDiv.style.display = "none";
    if (currentGroupedResults.length === 0) {
      resultsDiv.innerHTML =
        '<div class="result-item"><p style="text-align:center; color: var(--text-muted);">No phrases found with this value.</p></div>';
    } else {
      resultsDiv.innerHTML =
        '<div class="result-item"><p style="text-align:center; color: var(--text-muted);">Bible exposition is hidden in this esoteric mode.</p></div>';
    }
    return;
  }

  const totalPages = Math.ceil(currentGroupedResults.length / RESULTS_PER_PAGE);
  const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIdx = Math.min(
    startIdx + RESULTS_PER_PAGE,
    currentGroupedResults.length,
  );
  const pageResults = currentGroupedResults.slice(startIdx, endIdx);

  // Pagination Visibility
  if (totalPages > 1) {
    paginationTopDiv.style.display = "flex";
    paginationBottomDiv.style.display = "flex";
    document.getElementById("pageInfo").textContent =
      `Page ${currentPage} of ${totalPages}`;
    document.getElementById("pageInfoBottom").textContent =
      `Page ${currentPage} of ${totalPages}`;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
    document.getElementById("prevPageBottom").disabled = currentPage === 1;
    document.getElementById("nextPageBottom").disabled =
      currentPage === totalPages;
  } else {
    paginationTopDiv.style.display = "none";
    paginationBottomDiv.style.display = "none";
  }

  resultsDiv.innerHTML = "";

  if (currentGroupedResults.length === 0) {
    resultsDiv.innerHTML =
      '<div class="result-item"><p style="text-align:center; color: var(--text-muted);">No phrases found with this AQ value.</p></div>';
    return;
  }

  pageResults.forEach((group) => {
    const item = document.createElement("div");
    item.className = "result-item";

    const count = group.refs.length;
    const MAX_REFS_DISPLAY = 10;
    const displayedRefs = group.refs
      .slice(0, MAX_REFS_DISPLAY)
      .map((r) => formatRefRange(r));
    let refsText = displayedRefs.join(", ");
    if (count > MAX_REFS_DISPLAY) {
      refsText += `, and ${count - MAX_REFS_DISPLAY} more`;
    }

    const phraseAQ = cumsum[group.endIndex] - cumsum[group.startIndex];

    const header = document.createElement("div");
    header.className = "result-header";

    const phraseTitle = document.createElement("span");
    phraseTitle.className = "phrase-text";
    phraseTitle.textContent = `"${group.text}"`;
    phraseTitle.title = "Click to generate sigil";
    phraseTitle.addEventListener("click", (e) => {
      switchTab("sigil-generator");
      const aqInput = document.getElementById("aqSquareInput");
      if (aqInput) {
        aqInput.value = group.text;
        updateAqSquareSigil();
      }

      // Generate animated popup at cursor
      const popup = document.createElement("div");
      popup.className = "sigil-popup";
      popup.textContent = "sigil generated above";
      popup.style.left = e.clientX + "px";
      popup.style.top = e.clientY + "px";
      document.body.appendChild(popup);

      // Remove after animation completes
      setTimeout(() => popup.remove(), 1230);
    });

    const metaSpan = document.createElement("span");
    metaSpan.className = "phrase-meta";
    metaSpan.innerHTML = `AQ: <strong>${phraseAQ}</strong> &middot; Words: ${group.wordCount}`;

    header.appendChild(phraseTitle);
    header.appendChild(metaSpan);

    const refsDiv = document.createElement("div");
    refsDiv.className = "verse-references";
    refsDiv.innerHTML = `<strong>References:</strong> <span style="color:var(--text-muted);">${refsText}</span> (${count})`;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-verses-btn";
    toggleBtn.textContent = "View Context";
    refsDiv.appendChild(toggleBtn);

    const versesContainer = document.createElement("div");
    versesContainer.className = "verses-container";

    const seenVerses = new Set();
    group.refs.forEach((ref) => {
      for (let vi = ref.startVerseIndex; vi <= ref.endVerseIndex; vi++) {
        if (seenVerses.has(vi)) continue;
        seenVerses.add(vi);
        const verse = verses[vi];

        const verseBlock = document.createElement("div");
        verseBlock.className = "verse-block";
        verseBlock.innerHTML = `<span class="verse-ref">${verse.ref.fullRef}</span> ${verse.text}`;
        versesContainer.appendChild(verseBlock);
      }
    });

    toggleBtn.addEventListener("click", () => {
      if (versesContainer.style.display === "block") {
        versesContainer.style.display = "none";
        toggleBtn.textContent = "View Context";
      } else {
        versesContainer.style.display = "block";
        toggleBtn.textContent = "Hide Context";
      }
    });

    item.appendChild(header);
    item.appendChild(refsDiv);
    item.appendChild(versesContainer);
    resultsDiv.appendChild(item);
  });
}

function goToPage(page) {
  const totalPages = Math.ceil(currentGroupedResults.length / RESULTS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderCurrentPage();
  document
    .getElementById("resultsSection")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function execSearchQuery(inputAQ, inputText) {
  const maxWords = parseInt(document.getElementById("maxWords").value) || 10;
  const phraseScope = document.getElementById("phraseScope").value;

  let targetAQs = [inputAQ];
  const useHyperprime =
    document.getElementById("hyperprimeFilter") &&
    document.getElementById("hyperprimeFilter").checked;
  if (useHyperprime) {
    targetAQs = getHyperprimeResonances(inputAQ);
  }

  let allResults = [];
  targetAQs.forEach((tAQ) => {
    let res = searchAQ(tAQ, maxWords, phraseScope);
    allResults = allResults.concat(res);
  });

  displayResults(allResults, inputText, inputAQ);
}

function handleSearch() {
  if (!isLoaded) return alert("Bible text is still loading.");
  const inputText = document.getElementById("searchInput").value.trim();
  if (!inputText) return alert("Please enter text to search.");

  const inputAQ = calculateStringAQ(inputText);
  execSearchQuery(inputAQ, inputText);
}

function handleNumericSearch() {
  if (!isLoaded) return alert("Bible text is still loading.");
  const numericInput = document.getElementById("numericInput").value.trim();
  if (!numericInput || !/^\d+$/.test(numericInput))
    return alert("Please enter a valid positive number.");

  const inputAQ = parseInt(numericInput, 10);
  execSearchQuery(inputAQ, `AQ ${numericInput}`);
}

function handleChronomancy() {
  if (!isLoaded) return alert("Bible text is still loading.");
  const year = document.getElementById("chronoInput").value.trim();
  if (!year || !/^\d+$/.test(year)) return alert("Please enter a valid year.");

  const inputAQ = parseInt(year, 10);
  execSearchQuery(inputAQ, `Temporal Index ${year}`);
}

function handleXenotationSearch() {
  if (!isLoaded) return alert("Bible text is still loading.");
  const xenoInput = document.getElementById("xenoInput").value.trim();
  if (!xenoInput) return alert("Please enter a Xenotation string.");

  try {
    const inputAQ = unxenotate(xenoInput);
    if (inputAQ === null || isNaN(inputAQ) || inputAQ < 0)
      throw new Error("Invalid");

    execSearchQuery(inputAQ, `TX: ${xenoInput}`);
  } catch (e) {
    alert("Could not parse Xenotation. Ensure you use only •, :, (, and )");
  }
}

// Tabs
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  document
    .querySelector(`.tab-btn[data-tab="${tabId}"]`)
    .classList.add("active");
  document.getElementById(tabId).classList.add("active");

  if (tabId === "sigil-generator") {
    renderAqSquareSvgGrid();
    updateAqSquareSigil();
  }
}

if (typeof document !== "undefined") {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      switchTab(e.target.getAttribute("data-tab")),
    );
  });
}

// Sigil Generator
function buildAqSquareGrid() {
  if (typeof document === "undefined") return;
  const container = document.getElementById("aqSquareGrid");
  if (!container) return;
  const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  container.innerHTML = "";
  for (let i = 0; i < symbols.length; i++) {
    const cell = document.createElement("div");
    cell.textContent = symbols[i];
    container.appendChild(cell);
  }
}

function renderAqSquareSvgGrid() {
  if (typeof document === "undefined") return;
  const svg = document.getElementById("aqSquareSvg");
  if (!svg) return;
  const size = 240;
  const padding = 20;
  const cellSize = (size - 2 * padding) / 6;

  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.innerHTML = "";

  const ns = "http://www.w3.org/2000/svg";

  const border = document.createElementNS(ns, "rect");
  border.setAttribute("x", padding);
  border.setAttribute("y", padding);
  border.setAttribute("width", cellSize * 6);
  border.setAttribute("height", cellSize * 6);
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", "var(--border-color)");
  svg.appendChild(border);

  svg.dataset.size = size;
  svg.dataset.padding = padding;
  svg.dataset.cellSize = cellSize;
}

function updateAqSquareSigil() {
  if (typeof document === "undefined") return;
  const svg = document.getElementById("aqSquareSvg");
  const input = document.getElementById("aqSquareInput");
  if (!svg || !input) return;

  const ns = "http://www.w3.org/2000/svg";
  const padding = parseFloat(svg.dataset.padding || "20");
  const cellSize = parseFloat(svg.dataset.cellSize || "33.3333");

  const previousPath = svg.querySelector("#aqSquarePath");
  if (previousPath) previousPath.remove();
  svg.querySelector("#aqStartDot")?.remove();
  svg.querySelector("#aqEndDot")?.remove();

  const defs = svg.querySelector("defs");
  if (defs) defs.remove();

  const text = input.value || "";
  const points = [];
  const coords = [];

  for (let char of text) {
    const value = charToAqValue(char);
    if (value === null) continue;
    const row = Math.floor(value / 6);
    const col = value % 6;
    const x = padding + col * cellSize + cellSize / 2;
    const y = padding + row * cellSize + cellSize / 2;
    coords.push({ x, y, char });
    points.push(`${x},${y}`);
  }

  if (coords.length === 0) return;

  const startColor = "#00FF41";
  const endColor = "#ffffff";

  const newDefs = document.createElementNS(ns, "defs");
  svg.insertBefore(newDefs, svg.firstChild);

  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.setAttribute("id", "aqSigilGradient");
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");
  gradient.setAttribute("x1", coords[0].x);
  gradient.setAttribute("y1", coords[0].y);
  gradient.setAttribute("x2", coords[coords.length - 1].x);
  gradient.setAttribute("y2", coords[coords.length - 1].y);

  const stopStart = document.createElementNS(ns, "stop");
  stopStart.setAttribute("offset", "0%");
  stopStart.setAttribute("stop-color", startColor);
  gradient.appendChild(stopStart);

  const stopEnd = document.createElementNS(ns, "stop");
  stopEnd.setAttribute("offset", "100%");
  stopEnd.setAttribute("stop-color", endColor);
  gradient.appendChild(stopEnd);
  newDefs.appendChild(gradient);

  const polyline = document.createElementNS(ns, "polyline");
  polyline.setAttribute("id", "aqSquarePath");
  polyline.setAttribute("points", points.join(" "));
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "url(#aqSigilGradient)");
  polyline.setAttribute("stroke-width", "2.5");
  polyline.setAttribute("stroke-linejoin", "round");
  svg.appendChild(polyline);

  function drawDot(id, x, y, r, fillColor) {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("id", id);
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", r);
    dot.setAttribute("fill", fillColor);
    svg.appendChild(dot);
  }

  drawDot("aqStartDot", coords[0].x, coords[0].y, 5, startColor);
  drawDot(
    "aqEndDot",
    coords[coords.length - 1].x,
    coords[coords.length - 1].y,
    5,
    endColor,
  );
}

// Event Listeners
if (typeof document !== "undefined") {
  document
    .getElementById("searchButton")
    .addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  document
    .getElementById("numericSearchButton")
    .addEventListener("click", handleNumericSearch);
  document.getElementById("numericInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleNumericSearch();
  });

  document
    .getElementById("xenoSearchButton")
    .addEventListener("click", handleXenotationSearch);
  document.getElementById("xenoInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleXenotationSearch();
  });

  document.getElementById("oedipusFilter").addEventListener("change", () => {
    if (kjvText) parseBible();
  });

  ["prevPage", "prevPageBottom"].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener("click", () => goToPage(currentPage - 1));
  });
  ["nextPage", "nextPageBottom"].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener("click", () => goToPage(currentPage + 1));
  });

  document
    .getElementById("aqSquareInput")
    .addEventListener("input", updateAqSquareSigil);
}

// Init
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    loadBible();
    buildAqSquareGrid();
    renderAqSquareSvgGrid();
  });
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    charToAqValue,
    calculateAQ,
    calculateStringAQ,
    toBase36,
    digitalRoot,
    sumOfDivisors,
    isPerfectSquare,
    isTriangular,
    isPrime,
    getPrimeIndex,
    getNthPrime,
    primeFactorization,
    xenotate,
    unxenotate,
  };
}
