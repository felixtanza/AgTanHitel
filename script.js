// frontend/js/script.js

const gallery = document.getElementById('gallery');
const cartSection = document.getElementById('cart-section');
const cartItemsDiv = document.getElementById('cart-items');
const viewCartBtn = document.getElementById('view-cart-btn');
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const loader = document.getElementById('loader');
const paymentMessage = document.getElementById('payment-message');
const closeCartBtn = document.getElementById('close-cart-btn');

let cart = [];

// Sample food data with images and prices
const foodData = [
  { id: 1, name: "Chicken Curry", price: 500, image: "https://i.imgur.com/U4GmzZL.jpg" },
  { id: 2, name: "Beef Steak", price: 700, image: "https://i.imgur.com/WmsqKjA.jpg" },
  { id: 3, name: "Vegetable Salad", price: 300, image: "https://i.imgur.com/T7zB0vT.jpg" },
  { id: 4, name: "Fried Fish", price: 600, image: "https://i.imgur.com/KNtAOHL.jpg" },
  { id: 5, name: "Rice and Beans", price: 400, image: "https://i.imgur.com/6Te8Ktt.jpg" }
];

// Render food gallery
function renderGallery() {
  gallery.innerHTML = '';
  foodData.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('food-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>${item.name}</div>
      <div class="price-tag">KES ${item.price}</div>
    `;
    div.addEventListener('click', () => addToCart(item));
    gallery.appendChild(div);
  });
}

// Add item to cart
function addToCart(item) {
  cart.push(item);
  alert(`${item.name} added to cart.`);
}

// Show cart
viewCartBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  renderCart();
  cartSection.classList.remove('hidden');
});

// Close cart
closeCartBtn.addEventListener('click', () => {
  cartSection.classList.add('hidden');
});

// Render cart items
function renderCart() {
  cartItemsDiv.innerHTML = '';
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.textContent = `${item.name} - KES ${item.price}`;
    cartItemsDiv.appendChild(div);
  });
}

// Checkout button click
document.getElementById('checkout-btn').addEventListener('click', () => {
  cartSection.classList.add('hidden');
  checkoutSection.classList.remove('hidden');
});

// Handle checkout form submission
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  loader.classList.remove('hidden');
  paymentMessage.textContent = '';

  try {
    const response = await fetch('http://localhost:5000/api/order/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, cart })
    });

    const data = await response.json();
    loader.classList.add('hidden');

    if (data.success) {
      paymentMessage.textContent = data.message;
      cart = [];
      checkoutForm.reset();
      checkoutSection.classList.add('hidden');
    } else {
      paymentMessage.textContent = 'Payment failed: ' + data.message;
    }
  } catch (error) {
    loader.classList.add('hidden');
    paymentMessage.textContent = 'Error occurred. Try again later.';
    console.error('Checkout error:', error);
  }
});

// Initialize gallery on page load
renderGallery();
