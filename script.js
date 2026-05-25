let noClickCount = 0;
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainCard = document.getElementById('mainCard');
const calendarCard = document.getElementById('calendarCard');
const successCard = document.getElementById('successCard');
const sendBtn = document.getElementById('sendBtn');
const datePicker = document.getElementById('datePicker');
const timePicker = document.getElementById('timePicker');
const emailInput = document.getElementById('emailInput');

let originalYesWidth, originalNoWidth;

function storeOriginalSizes() {
    const yesStyles = window.getComputedStyle(yesBtn);
    const noStyles = window.getComputedStyle(noBtn);
    originalYesWidth = parseFloat(yesStyles.width);
    originalNoWidth = parseFloat(noStyles.width);
}
storeOriginalSizes();

noBtn.addEventListener('click', () => {
    noClickCount++;
    if (noClickCount <= 5) {
        const shrinkFactor = 1 - (noClickCount * 0.16);
        const growFactor = 1 + (noClickCount * 0.28);
        noBtn.style.transform = `scale(${Math.max(0.2, shrinkFactor)})`;
        yesBtn.style.transform = `scale(${growFactor})`;
        yesBtn.style.fontSize = `${1.4 + noClickCount * 0.2}rem`;
        if (noClickCount === 5) {
            noBtn.style.display = 'none';
            yesBtn.style.transform = `scale(2.2)`;
            yesBtn.style.fontSize = '2.2rem';
        }
    }
});

yesBtn.addEventListener('click', () => {
    mainCard.classList.add('hidden');
    calendarCard.classList.remove('hidden');
    document.getElementById('catAnim').src = "https://media.tenor.com/Qk6C4KsB6FkAAAAj/cat-happy.gif";
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
    if(!datePicker.value) datePicker.value = today;
    if(!timePicker.value) timePicker.value = "15:00";
});

async function sendPushNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998628.png', requireInteraction: true });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998628.png' });
        }
    }
}

sendBtn.addEventListener('click', async () => {
    const selectedDate = datePicker.value;
    const selectedTime = timePicker.value;
    const userEmail = emailInput.value.trim();
    
    if (!selectedDate || !selectedTime || !userEmail) {
        alert("Isi tanggal, jam, dan email dulu ya! 😽");
        return;
    }
    
    if (!userEmail.includes('@') || !userEmail.includes('.')) {
        alert("Email salah nih😿 cek lagi ya!");
        return;
    }
    
    const dateObj = new Date(selectedDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    
    await sendPushNotification('AKHIRNYA KITA HARUS MAINN! 🐱', `${formattedDate} jam ${selectedTime} - Email: ${userEmail}`);
    
    try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            to_email: userEmail,
            date: formattedDate,
            time: selectedTime,
            message: `WULANN GAS KITA MAIN ${formattedDate} jam ${selectedTime}. Siap-siap ya! 🐱💖`
        });
        alert("Email undangan sudah terkirim YAAA! Cek inbox/spam YAA 😻");
    } catch(error) {
        console.error("Email error:", error);
        alert("Gagal kirim email real, tapi notifikasi push sudah muncul & data tersimpan. Cek koneksi atau setting EmailJS!");
    }
    
    calendarCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    document.getElementById('successDetail').innerHTML = `Jalan-jalan tanggal ${formattedDate} jam ${selectedTime} <br> 🐾 Notifikasi push sudah muncul & email ${userEmail} sedang diproses! 🐾`;
});

if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => {
        Notification.requestPermission();
    }, 1000);
}