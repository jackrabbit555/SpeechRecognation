# 🎤 Speech-to-Text & Voice Command Web App

یک پروژه جاوااسکریپتی برای تبدیل گفتار به متن و کنترل صفحه با دستورات صوتی (پشتیبانی از فارسی و انگلیسی)

---

## ✨ ویژگی‌ها

- **تبدیل گفتار به متن:** تشخیص گفتار به زبان فارسی (یا انگلیسی) و نمایش آن در صفحه.
- **تعامل با صفحه:** تغییر رنگ، افزودن پاراگراف جدید، پاک کردن محتوا و ... با دستورات صوتی.
- **پشتیبانی از تغییر زبان:** امکان تغییر زبان تایپ بین فارسی و انگلیسی با فرمان صوتی.
- **قابلیت ویرایش متن:** متنی که در صفحه تایپ می‌شود قابل ویرایش است.
- **تبدیل متن به گفتار:** خواندن متن تایپ‌شده با صدای فارسی (ResponsiveVoice) یا انگلیسی (Web Speech API).

---

## 🚀 نصب و اجرا

### پیش‌نیازها
- مرورگر مدرن (ترجیحاً Google Chrome)
- اتصال اینترنت برای استفاده از صدای فارسی (ResponsiveVoice)

### مراحل نصب

```bash
# کلون کردن پروژه
$ git clone https://github.com/username/speech-to-text-control.git
$ cd speech-to-text-control
```

سپس فایل `index.html` را در مرورگر باز کنید.

> **نکته:** برای فعال شدن صدای فارسی، این خط را به ابتدای `<head>` فایل HTML اضافه کنید:
> ```html
> <script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_KEY"></script>
> ```
> (برای تست می‌توانید بدون کلید هم استفاده کنید.)

---

## 📝 نحوه استفاده

1. پس از باز کردن برنامه، میکروفون فعال می‌شود.
2. دستورات صوتی خود را به زبان فارسی یا انگلیسی بگویید.
3. متن در صفحه نمایش داده می‌شود و می‌توانید با دکمه Enter آن را تایید کنید.
4. با دکمه "🔊 خواندن متن"، متن تایپ‌شده را با صدای فارسی یا انگلیسی بشنوید.

### دستورات صوتی پشتیبانی‌شده:
- `خط بعدی` : ایجاد پاراگراف جدید
- `علامت سوال` : تبدیل به علامت "؟"
- `صفحه پاک شود` : پاک کردن کل محتوا
- `صفحه نارنجی/آبی/خاکستری` : تغییر رنگ پس‌زمینه
- `انگلیسی تایپ کن` : تغییر زبان به انگلیسی
- `type in Persian` : بازگشت به زبان فارسی

---

## 🧩 ساختار و فلو کد

1. **تعریف و تنظیمات اولیه:**
   - استفاده از Web Speech API و ResponsiveVoice
   - زبان پیش‌فرض فارسی و نتایج موقت فعال
2. **تشخیص گفتار:**
   - میکروفون فعال و گفتار کاربر ضبط می‌شود
   - متن به صورت زنده پردازش و نمایش داده می‌شود
3. **تشخیص دستورات صوتی:**
   - بررسی متن برای شناسایی دستورات خاص و اجرای عملکرد مربوطه
4. **نمایش خروجی:**
   - متن تبدیل‌شده در پاراگراف قابل ویرایش نمایش داده می‌شود
   - امکان خواندن متن تایپ‌شده با دکمه مخصوص

---

## 🤝 همکاری

خوشحال می‌شویم اگر پروژه را فورک کنید و Pull Request بفرستید!

---

## 📄 لایسنس

MIT
