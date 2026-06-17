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

// 🔥 PERBAIKAN: Gunakan 'click' dan 'touchstart' untuk mobile
function handleSendClick(e) {
    e.preventDefault(); // Mencegah default behavior
    e.stopPropagation();
    
    console.log("Tombol Send diklik!"); // Debug di console
    
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
    
    sendPushNotification('AKHIRNYA KITA MAINN! 🐱', `${formattedDate} jam ${selectedTime} - Email: ${userEmail}`);
    
    try {
        emailjs.send("service_chjwzrw", "template_tc98zsw", {
            to_email: userEmail,
            date: formattedDate,
            time: selectedTime,
            message: `WULANN SPG GAS KITA MAIN ${formattedDate} jam ${selectedTime}. Jangan boong!! 🐱💖`
        }).then(() => {
            alert("Email undangan sudah terkirim YAAA! Cek inbox/spam YAA 😻");
        }).catch((error) => {
            console.error("Email error:", error);
            alert("Gagal kirim email real, tapi notifikasi push sudah muncul & data tersimpan. Cek koneksi atau setting EmailJS!");
        });
    } catch(error) {
        console.error("Email error:", error);
        alert("Gagal kirim email real, tapi notifikasi push sudah muncul & data tersimpan. Cek koneksi atau setting EmailJS!");
    }
    
    calendarCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    document.getElementById('successDetail').innerHTML = `Until we meet again darling tanggal ${formattedDate} jam ${selectedTime} <br> 🐾 Coba cek email, Biar keliatan formal Dee! 🐾`;
}

if (sendBtn) {
    sendBtn.addEventListener('click', handleSendClick);
    sendBtn.addEventListener('touchstart', handleSendClick, { passive: false });
    console.log("Event listener terpasang untuk tombol Send"); // Debug
} else {
    console.error("Tombol Send tidak ditemukan!");
}

document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('sendBtn');
    if (checkBtn) {
        console.log("Tombol Send ditemukan di DOM");
    } else {
        console.error("Tombol Send TIDAK ditemukan di DOM!");
    }
});

if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => {
        Notification.requestPermission();
    }, 1000);
}