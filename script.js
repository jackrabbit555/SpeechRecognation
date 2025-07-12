// -------------------- Speech Recognition Setup --------------------
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "fa-IR";
recognition.interimResults = true;

// -------------------- DOM Elements & UI Setup --------------------
const container = document.querySelector(".container");
let p = createEditableParagraph();
let span = document.createElement("span");
let pendingTranscript = "";

// Preview Box
const previewBox = createPreviewBox();
document.body.appendChild(previewBox);

// Status Bar
const statusBox = createStatusBar();
document.body.appendChild(statusBox);

// Speak Button
const speakBox = createSpeakBox();
container.parentNode.insertBefore(speakBox, container.nextSibling);

// Audio Visualizer
const audioCanvas = createAudioVisualizerCanvas();
document.body.insertBefore(audioCanvas, previewBox);
startVisualizer(audioCanvas);

// -------------------- Event Listeners --------------------
document.addEventListener("keydown", handleEnterKey);
recognition.addEventListener("start", () => setStatus("🎤 در حال گوش دادن..."));
recognition.addEventListener("end", handleRecognitionEnd);
recognition.addEventListener("result", handleRecognitionResult);
speakBox.querySelector("button").addEventListener("click", speakText);

// -------------------- Function Definitions --------------------
function createEditableParagraph() {
  const para = document.createElement("p");
  para.setAttribute("contenteditable", "true");
  return para;
}

function createPreviewBox() {
  const box = document.createElement("div");
  box.id = "preview-box";
  Object.assign(box.style, {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    padding: "16px 32px",
    borderRadius: "16px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
    color: "#333",
    fontSize: "1.2rem",
    zIndex: 9999,
  });
  return box;
}

function createStatusBar() {
  const bar = document.createElement("div");
  bar.id = "status-box";
  Object.assign(bar.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    background: "#222",
    color: "#fff",
    textAlign: "center",
    padding: "8px 0",
    fontSize: "1rem",
    zIndex: 10000,
  });
  bar.textContent = "🎤 در حال گوش دادن...";
  return bar;
}

function createSpeakBox() {
  const box = document.createElement("div");
  box.id = "speak-box";
  box.style.marginTop = "32px";
  box.style.textAlign = "center";
  const btn = document.createElement("button");
  btn.textContent = "🔊 خواندن متن";
  Object.assign(btn.style, {
    padding: "10px 24px",
    fontSize: "1.1rem",
    borderRadius: "8px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    cursor: "pointer",
  });
  box.appendChild(btn);
  return box;
}

function createAudioVisualizerCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "audio-visualizer";
  canvas.width = 600;
  canvas.height = 60;
  Object.assign(canvas.style, {
    display: "block",
    margin: "24px auto 0 auto",
    background: "#222",
    borderRadius: "8px",
  });
  return canvas;
}

function setStatus(text) {
  statusBox.textContent = text;
}

function handleEnterKey(e) {
  if (e.key === "Enter" && pendingTranscript.trim() !== "") {
    const confirmedSpan = document.createElement("span");
    confirmedSpan.textContent = pendingTranscript + " ";
    p.appendChild(confirmedSpan);
    container.appendChild(p);
    previewBox.textContent = "";
    pendingTranscript = "";
    setStatus("🎤 در حال گوش دادن...");
    recognition.abort();
    setTimeout(() => recognition.start(), 100);
    e.preventDefault();
  }
}

function handleRecognitionEnd() {
  setStatus("⏸️ شنیدن متوقف شد، آماده شروع مجدد...");
  setTimeout(() => recognition.start(), 1);
}

function handleRecognitionResult(event) {
  container.appendChild(p);
  let transcript = Array.from(event.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join(" ");
  if (transcript.includes("علامت سوال"))
    transcript = transcript.replace("علامت سوال", "?");
  if (transcript.includes("خط بعدی") && event.results[0].isFinal) {
    transcript = "";
    p = createEditableParagraph();
    container.appendChild(p);
  }
  if (transcript.includes("صفحه پاک شود") && event.results[0].isFinal) {
    container.innerHTML = "";
    p.innerHTML = "";
  }
  if (event.results[0].isFinal) {
    span = document.createElement("span");
    p.appendChild(span);
    setStatus("✅ جمله ثبت شد. منتظر جمله جدید...");
  } else {
    setStatus("📝 منتظر تایید شما (Enter) یا ادامه صحبت...");
  }
  if (transcript.includes("صفحه نارنجی")) {
    transcript = "";
    document.body.classList.add("orange");
  }
  if (transcript.includes("صفحه آبی")) {
    transcript = "";
    document.body.classList.add("blue");
  }
  if (transcript.includes("صفحه خاکستری")) {
    transcript = "";
    document.body.classList.add("gray");
  }
  if (transcript.includes("انگلیسی تایپ کن") && event.results[0].isFinal) {
    recognition.stop();
    recognition.lang = "en-US";
    transcript = "";
    p = createEditableParagraph();
    p.setAttribute("dir", "ltr");
    container.appendChild(p);
  }
  if (transcript.includes("type in Persian") && event.results[0].isFinal) {
    recognition.stop();
    recognition.lang = "fa-IR";
    transcript = "";
    p = createEditableParagraph();
    p.setAttribute("dir", "rtl");
    container.appendChild(p);
  }
  pendingTranscript = transcript;
  previewBox.textContent = pendingTranscript;
}

function speakText() {
  let text = Array.from(container.querySelectorAll("p"))
    .map((p) => p.innerText || p.textContent)
    .join(" ");
  if (!text.trim()) return;
  let utter = new SpeechSynthesisUtterance(text);
  utter.lang = recognition.lang;
  let setVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    if (recognition.lang === "fa-IR") {
      let faVoice = voices.find((v) => v.lang && v.lang.startsWith("fa"));
      if (faVoice) utter.voice = faVoice;
    } else if (recognition.lang === "en-US") {
      let enVoice = voices.find((v) => v.lang && v.lang.startsWith("en"));
      if (enVoice) utter.voice = enVoice;
    }
    window.speechSynthesis.speak(utter);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", setVoice, {
      once: true,
    });
    window.speechSynthesis.getVoices();
  } else {
    setVoice();
  }
}

function startVisualizer(audioCanvas) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let lastDataArray = new Float32Array(bufferLength);
      const smoothFactor = 0.85;
      function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        const ctx = audioCanvas.getContext("2d");
        ctx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00e676";
        ctx.beginPath();
        let sliceWidth = (audioCanvas.width * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * audioCanvas.height) / 2;
          y = lastDataArray[i] * smoothFactor + y * (1 - smoothFactor);
          lastDataArray[i] = y;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(audioCanvas.width, audioCanvas.height / 2);
        ctx.stroke();
      }
      draw();
    })
    .catch(() => {
      audioCanvas.style.display = "none";
    });
}

// -------------------- Start Recognition --------------------
recognition.start();
