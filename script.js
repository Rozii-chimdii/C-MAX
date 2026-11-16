const SUPABASE_KEY = "sb_publishable_kB84en7Ux2N6gX47mfkN4w_-xbCZn11";
const SUPABASE_URL = "https://afayenqpkpxpfrqcpmqz.supabase.co/rest/v1/";
const MY_WHATSAPP = "2348036811151";
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("orderBtn").onclick = function() {
        alert("Please select your items and upload your receipt to place an order.");
        window.location.href = "#order.html";

    }
});

const modal = document.getElementById("orderModal");
const btn = document.querySelector("#orderBtn");
const span = document.querySelector(".close");
btn.onclick = () => modal.style.display = "block";
span.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Calculate Total
const checks = document.querySelectorAll('.items-list input');
const totalEl = document.getElementById('totalPrice');
checks.forEach(c => c.addEventListener('change', () => {
    let total = 0;
    checks.forEach(ch => { if (ch.checked) total += parseInt(ch.value); });
    totalEl.textContent = "₦" + total.toLocaleString();
}));

// Submit
document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if (document.getElementById("receipt").files.length == 0) { alert("Please upload receipt"); return; }
    document.getElementById("finalTotal").textContent = totalEl.textContent;
    this.style.display = "none";
    document.getElementById("thankYou").style.display = "block";
    setTimeout(() => {
        modal.style.display = "none";
        this.reset();
        this.style.display = "block";
        document.getElementById("thankYou").style.display = "none";
        totalEl.textContent = "₦0";
    }, 4000);
});
