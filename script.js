// تعریف یک شیء برای استفاده از SpeechRecognition یا webkitSpeechRecognition
// Defining a SpeechRecognition object or its webkit alternative
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// انتخاب المان اصلی برای قرار دادن متن و تعریف پاراگراف و اسپن برای نمایش متن
// Selecting the main container element and defining a paragraph and span for displaying text
let container = document.querySelector(".container");
let p = document.createElement("p");
p.setAttribute("contenteditable", "true"); // قابلیت ویرایش پاراگراف
let span = document.createElement("span");

let pendingTranscript = ""; // بافر موقت برای متن تشخیص داده‌شده

// فقط یک دیو برای پیش‌نمایش ایجاد کن
let previewBox = document.createElement("div");
previewBox.id = "preview-box";
previewBox.style.position = "fixed";
previewBox.style.bottom = "30px";
previewBox.style.left = "50%";
previewBox.style.transform = "translateX(-50%)";
previewBox.style.background = "#fff";
previewBox.style.padding = "16px 32px";
previewBox.style.borderRadius = "16px";
previewBox.style.boxShadow = "0 2px 16px rgba(0,0,0,0.15)";
previewBox.style.color = "#333";
previewBox.style.fontSize = "1.2rem";
previewBox.style.zIndex = "9999";
document.body.appendChild(previewBox);

// حذف preview قبلی (اگر لازم است)
if (document.getElementById("preview")) {
  document.getElementById("preview").remove();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && pendingTranscript.trim() !== "") {
    let confirmedSpan = document.createElement("span");
    confirmedSpan.textContent = pendingTranscript + " ";
    p.appendChild(confirmedSpan);
    container.appendChild(p);

    // پاک کردن کامل previewBox و آماده‌سازی برای شنیدن بعدی
    previewBox.textContent = "";
    pendingTranscript = "";

    recognition.abort(); // متوقف کردن recognition فعلی
    setTimeout(() => recognition.start(), 100); // شروع مجدد recognition با تاخیر کوتاه

    e.preventDefault();
  }
});


// ایجاد نمونه‌ای از SpeechRecognition و تنظیم زبان به فارسی
// Creating an instance of SpeechRecognition and setting the language to Persian
// const recognition = new SpeechRecognitionAlternative();
recognition.lang = "fa-IR";
recognition.interimResults = true; // فعال کردن نتایج موقت

// شروع شنیدن گفتار
// Starting speech recognition
recognition.start();

// اجرای مجدد پس از پایان هر سیکل شنیدن
// Restarting recognition after each session ends
// recognition.addEventListener("end", recognition.start);

recognition.addEventListener("end", () => {
  console.log("🔁 Restarting recognition...");
  setTimeout(() => recognition.start(), 1); // تأخیر کوچک برای جلوگیری از خطا
});

// اضافه کردن لیسنر برای دریافت نتایج گفتار
// Adding an event listener to handle speech recognition results
recognition.addEventListener("result", (event) => {
  // افزودن پاراگراف به کانتینر
  // Adding the paragraph to the container
  container.appendChild(p);

  // پردازش نتایج گفتار به متن
  // Processing speech-to-text results
  let transcript = Array.from(event.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join(" ");

  // تبدیل کلمه "علامت سوال" به علامت سوال (؟)
  // Replacing the phrase "علامت سوال" with the actual question mark (?)
  if (transcript.includes("علامت سوال")) {
    transcript = transcript.replace("علامت سوال", "?");
  }

  // شناسایی فرمان "خط بعدی" و افزودن پاراگراف جدید
  // Handling the "خط بعدی" command to create a new paragraph
  if (transcript.includes("خط بعدی") && event.results[0].isFinal) {
    transcript = ""; // پاک کردن متن فعلی
    p.setAttribute("contenteditable", "true"); // قابل ویرایش کردن متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    container.appendChild(p); // افزودن به کانتینر
  }

  // شناسایی فرمان "صفحه پاک شود" و پاک کردن محتوا
  // Handling "صفحه پاک شود" command to clear the content
  if (transcript.includes("صفحه پاک شود") && event.results[0].isFinal) {
    container.innerHTML = ""; // پاک کردن کانتینر
    p.innerHTML = ""; // پاک کردن پاراگراف
  }

  // افزودن اسپن جدید پس از اتمام نتیجه نهایی
  // Adding a new span when the result is final
  if (event.results[0].isFinal) {
    span = document.createElement("span");
    p.appendChild(span);
  }



  // تغییر رنگ صفحه به نارنجی در صورت تشخیص فرمان "صفحه نارنجی"
  // Changing page color to orange on "صفحه نارنجی" command
  if (transcript.includes("صفحه نارنجی")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("orange"); // اضافه کردن کلاس نارنجی
  }

  // تغییر رنگ صفحه به آبی در صورت تشخیص فرمان "صفحه آبی"
  // Changing page color to blue on "صفحه آبی" command
  if (transcript.includes("صفحه آبی")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("blue"); // اضافه کردن کلاس آبی
  }

  // تغییر رنگ صفحه به خاکستری در صورت تشخیص فرمان "صفحه خاکستری"
  // Changing page color to gray on "صفحه خاکستری" command
  if (transcript.includes("صفحه خاکستری")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("gray"); // اضافه کردن کلاس خاکستری
  }

  // تغییر زبان به انگلیسی با فرمان "انگلیسی تایپ کن"
  // Switching to English language on "انگلیسی تایپ کن" command
  if (transcript.includes("انگلیسی تایپ کن") && event.results[0].isFinal) {
    recognition.stop(); // متوقف کردن تشخیص گفتار
    recognition.lang = "en-US"; // تغییر زبان به انگلیسی
    transcript = ""; // پاک کردن متن
    p.setAttribute("contenteditable", "true"); // قابلیت ویرایش متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    p.setAttribute("dir", "ltr"); // تنظیم جهت چپ به راست
    container.appendChild(p); // افزودن به کانتینر
  }

  // تغییر زبان به فارسی با فرمان "type in Persian"
  // Switching back to Persian language on "type in Persian" command
  if (transcript.includes("type in Persian") && event.results[0].isFinal) {
    recognition.stop(); // متوقف کردن تشخیص گفتار
    recognition.lang = "fa-IR"; // تغییر زبان به فارسی
    transcript = ""; // پاک کردن متن
    p.setAttribute("contenteditable", "true"); // قابلیت ویرایش متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    p.setAttribute("dir", "rtl"); // تنظیم جهت راست به چپ
    container.appendChild(p); // افزودن به کانتینر
  }

  // اضافه کردن متن به اسپن و پاراگراف
  // Adding the transcript to the span and paragraph

  pendingTranscript = transcript;
  previewBox.textContent = pendingTranscript; // فقط اینجا مقدار previewBox را به‌روزرسانی کن

  // نمایش متن در کنسول برای تست و دیباگ
  // Logging the transcript in the console for debugging
  // console.log(transcript);
});

// ایجاد دیو وضعیت پایین صفحه
let statusBox = document.createElement("div");
statusBox.id = "status-box";
statusBox.style.position = "fixed";
statusBox.style.bottom = "0";
statusBox.style.left = "0";
statusBox.style.width = "100%";
statusBox.style.background = "#222";
statusBox.style.color = "#fff";
statusBox.style.textAlign = "center";
statusBox.style.padding = "8px 0";
statusBox.style.fontSize = "1rem";
statusBox.style.zIndex = "10000";
statusBox.textContent = "🎤 در حال گوش دادن...";
document.body.appendChild(statusBox);

recognition.addEventListener("start", () => {
  statusBox.textContent = "🎤 در حال گوش دادن...";
});

recognition.addEventListener("result", (event) => {
  // ...existing code...
  if (event.results[0].isFinal) {
    statusBox.textContent = "✅ جمله ثبت شد. منتظر جمله جدید...";
  } else {
    statusBox.textContent = "📝 منتظر تایید شما (Enter) یا ادامه صحبت...";
  }
  // ...existing code...
});

recognition.addEventListener("end", () => {
  statusBox.textContent = "⏸️ شنیدن متوقف شد، آماده شروع مجدد...";
  setTimeout(() => recognition.start(), 1);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && pendingTranscript.trim() !== "") {
    // ...existing code...
    statusBox.textContent = "🎤 در حال گوش دادن...";
    // ...existing code...
  }
});

// ایجاد دکمه یا دیو برای خواندن متن
let speakBox = document.createElement("div");
speakBox.id = "speak-box";
speakBox.style.marginTop = "32px";
speakBox.style.textAlign = "center";

let speakBtn = document.createElement("button");
speakBtn.textContent = "🔊 خواندن متن";
speakBtn.style.padding = "10px 24px";
speakBtn.style.fontSize = "1.1rem";
speakBtn.style.borderRadius = "8px";
speakBtn.style.border = "none";
speakBtn.style.background = "#1976d2";
speakBtn.style.color = "#fff";
speakBtn.style.cursor = "pointer";

speakBox.appendChild(speakBtn);
container.parentNode.insertBefore(speakBox, container.nextSibling);


// تابع خواندن متن با مدیریت کامل صداها
function speakText() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  let text = Array.from(container.querySelectorAll('p'))
    .map(p => p.innerText || p.textContent)
    .join(' ');
  if (!text.trim()) return;

  let utter = new SpeechSynthesisUtterance(text);
  utter.lang = recognition.lang;

  // انتخاب صدای مناسب پس از بارگذاری صداها
  let setVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    if (recognition.lang === 'fa-IR') {
      let faVoice = voices.find(v => v.lang && v.lang.startsWith('fa'));
      if (faVoice) utter.voice = faVoice;
    } else if (recognition.lang === 'en-US') {
      let enVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
      if (enVoice) utter.voice = enVoice;
    }
    window.speechSynthesis.speak(utter);
  };

  // اگر صداها هنوز بارگذاری نشده‌اند
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
    window.speechSynthesis.getVoices(); // تریگر بارگذاری
  } else {
    setVoice();
  }
}

speakBtn.addEventListener("click", speakText);
