document.addEventListener("DOMContentLoaded", () => {
  // Typing animation
  const typingText = document.querySelector(".typing-text");
  const words = ["Delicious Meals", "Fast Delivery", "Affordable Prices"];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    typingText.textContent = currentWord.substring(0, charIndex) + (charIndex % 2 === 0 ? "|" : "");
    if (isDeleting) {
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    } else {
      charIndex++;
      if (charIndex === currentWord.length) isDeleting = true;
    }
    setTimeout(type, 150);
  }
  type();

  // Menu rendering
  const menu = [
    { id: 1, name: "Chicken", price: 500, img: "https://via.placeholder.com/150" },
    { id: 2, name: "Beef", price: 600, img: "https://via.placeholder.com/150" },
    { id: 3, name: "Ugali & Fish", price: 450, img: "https://via.placeholder.com/150" }
  ];

  const menuContainer = document.querySelector("#menu");
  menu.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-item animate__animated animate__fadeInUp";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>KES ${item.price}</p>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    menuContainer.appendChild(card);
  });

  // Cart
  window.cart = [];
  window.addToCart = (id) => {
    const item = menu.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    updateCart();
  };

  function updateCart() {
    const cartContainer = document.querySelector("#cart");
    cartContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      cartContainer.innerHTML += `
        <div>
          ${item.name} x ${item.qty} = KES ${item.price * item.qty}
        </div>
      `;
    });
    document.querySelector("#total").textContent = `Total: KES ${total}`;
  }

  // Order submission
  const form = document.querySelector("#order-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const phone = form.phone.value;

    if (cart.length === 0) return alert("Your cart is empty!");

    const order = {
      name,
      phone,
      items: cart.map(i => ({
        name: i.name,
        quantity: i.qty,
        price: i.price
      })),
      total: cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order placed successfully!");
        form.reset();
        cart = [];
        updateCart();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error(err);
    }
  });

  // Scroll reveal animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("animate__fadeInUp");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.add("animate__animated");
    observer.observe(item);
  });
});
