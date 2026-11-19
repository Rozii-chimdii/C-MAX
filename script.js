const SUPABASE_URL = "https://afayenqpkpxpfrqcpmqz.supabase.co";
const SUPABASE_KEY = "sb_publishable_kB84en7Ux2N6gX47mfkN4w_-xbCZn11";
const MY_WHATSAPP = "2348036811151";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  if (!form) {
    console.log("orderForm not found - check your HTML id");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    if (btn) btn.textContent = "Sending...";

    const full_name = document.getElementById("name")?.value || document.getElementById("name")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const address = document.getElementById("address")?.value || "";
    const delivery_date_raw = document.getElementById("date")?.value || document.getElementById("date")?.value || "";
    const delivery_date = delivery_date_raw ? delivery_date_raw : null;
    const message = document.getElementById("msg")?.value || "";
    
let checked = [];
let totalPrice = 0;

document.querySelectorAll("input[type='checkbox']:checked").forEach(c => {
  const itemName = c.getAttribute("data-name") || c.dataset.name || c.nextElementSibling?.textContent || "Item";
  const itemPrice = parseFloat(c.value) || 0;

  // Find the Qty box inside the same zobo-item
  const parent = c.closest(".zobo-item") || c.closest("div") || c.parentElement;
  const qtyInput = parent ? parent.querySelector('input[type="number"]') : null;
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  const total = itemPrice * qty;
  totalPrice += total;

  checked.push(itemName + " x " + qty + " - ₦" + total);
});
const items = checked.join(", ") || "No item selected";


   let receipt_url = "";
const receiptFile = document.getElementById("receipt")?.files[0];
if (receiptFile) {
  const fileName = Date.now() + "-" + receiptFile.name.replace(/\s+/g, "_");
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/receipts/${fileName}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": receiptFile.type
    },
    body: receiptFile
  });
  if (uploadRes.ok) {
    receipt_url = `${SUPABASE_URL}/storage/v1/object/public/receipts/${fileName}`;
  }
}

const orderData = { full_name, phone, address, delivery_date, items, total_price:totalPrice, message, receipt_url };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Supabase Error: " + errText);
        if (btn) btn.textContent = "Submit Order";
        return;
      }

      alert("Order sent! Thank you.");

      const waText = `Hello C-MAX BAKERY! New Order:%0AName: ${full_name}%0APhone: ${phone}%0AAddress: ${address}%0ADate: ${delivery_date}%0AItems: ${items}%0AMessage: ${message}`;
      window.open(`https://wa.me/${MY_WHATSAPP}?text=${waText}`, "_blank");

      form.reset();
      if (btn) btn.textContent = "Submit Order";

    } catch (err) {
      alert("Error: " + err.message);
      if (btn) btn.textContent = "Submit Order";
    }
  });
});

document.getElementById('decorForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('decorName').value;
  const phone = document.getElementById('decorPhone').value;
  const message = document.getElementById('decorMessage').value;

  const { error } = await supabase
    .from('room_decor_bookings')
    .insert([{ name: name, phone: phone, message: message }]);

   const btn = form.querySelector("button[type='message']");
    if (btn) btn.textContent = "Sending...";
  
  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Booking received! We will call you.');
    document.getElementById('decorForm').reset();
  }
});
