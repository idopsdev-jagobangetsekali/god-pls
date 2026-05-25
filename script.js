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

let originalYesWidth, originalNoWidth, originalYesPad, originalNoPad;

function storeOriginalSizes() {
    const yesStyles = window.getComputedStyle(yesBtn);
    const noStyles = window.getComputedStyle(noBtn);
    originalYesWidth = parseFloat(yesStyles.width);
    originalNoWidth = parseFloat(noStyles.width);
    originalYesPad = parseFloat(yesStyles.paddingLeft) + parseFloat(yesStyles.paddingRight);
    originalNoPad = parseFloat(noStyles.paddingLeft) + parseFloat(noStyles.paddingRight);
}
storeOriginalSizes();

noBtn.addEventListener('click', () => {
    noClickCount++;
    if (noClickCount <= 5) {
        const shrinkFactor = 1 - (noClickCount * 0.16);
        const growFactor = 1 + (noClickCount * 0.28);
        let newNoWidth = originalNoWidth * shrinkFactor;
        let newYesWidth = originalYesWidth * growFactor;
        if (newNoWidth < 15) newNoWidth = 15;
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
    document.getElementById('catAnim').src = "https://media.tenor.com/Fm2CpsP7BrEAAAAj/cat-jump.gif";
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
    if(!datePicker.value) datePicker.value = today;
    if(!timePicker.value) timePicker.value = "15:00";
});

sendBtn.addEventListener('click', () => {
    const selectedDate = datePicker.value;
    const selectedTime = timePicker.value;
    const userEmail = emailInput.value.trim();
    if (!selectedDate || !selectedTime || !userEmail) {
        alert("Isi tanggal, jam, dan email dulu ya! 😽");
        return;
    }
    if (!userEmail.includes('@') || !userEmail.includes('.')) {
        alert("Email boong ni 😿 plsssss laaa!");
        return;
    }
    const dateObj = new Date(selectedDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    const detailText = `${formattedDate} ${selectedTime} dikirim ke ${userEmail}`;
    
    console.log(`DATA KENCAN: ${formattedDate} jam ${selectedTime} ke email ${userEmail}`);
    simulateSendEmail(userEmail, formattedDate, selectedTime);
    
    calendarCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    document.getElementById('successDetail').innerHTML = `Jalan-jalan tanggal ${formattedDate} jam ${selectedTime} <br> 🐾 Konfirmasi sudah dikirim ke email mu! 🐾`;
});

function simulateSendEmail(email, date, time) {
    alert(`Siap! Langsungggg kita gas ${email}\n${date} jam ${time}\nCek email (simulasi) dan kita mainn! 🐱✨`);
}