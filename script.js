const SUPABASE_URL = "https://afayenqpkpxpfrqcpmqz.supabase.co/rest/v1/";
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

    const full_name = document.getElementById("fullName")?.value || document.getElementById("name")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const address = document.getElementById("address")?.value || "";
    const delivery_date = document.getElementById("deliveryDate")?.value || document.getElementById("date")?.value || "";
    const message = document.getElementById("message")?.value || "";

    // Get checked items
    let checked = [];
    document.querySelectorAll("input[type='checkbox']:checked").forEach(c => {
      checked.push(c.value || c.nextElementSibling?.textContent || "Cake");
    });
    const items = checked.join(", ") || "1 Cake";
    const total_price = "To be confirmed";

    const orderData = { full_name, phone, address, delivery_date, items, total_price, message };

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

      alert("Order sent! We will confirm on WhatsApp.");

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
