const cart = [];
const cartPanel = document.querySelector(".cart-panel");
const overlay = document.querySelector(".overlay");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const toast = document.querySelector(".toast");

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);

function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
  overlay.classList.toggle("open", open);
  cartPanel.setAttribute("aria-hidden", String(!open));
}

function renderCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = formatPrice(cart.reduce((total, item) => total + item.price, 0));

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Ton panier attend sa dose de bonheur.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div><strong>${item.name}</strong><br><small>${formatPrice(item.price)}</small></div>
      <button data-remove="${index}" aria-label="Retirer ${item.name}">Retirer</button>
    </div>
  `).join("");
}

document.querySelector(".cart-button").addEventListener("click", () => toggleCart(true));
document.querySelector(".cart-close").addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
    renderCart();
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1400);
  });
});

cartItems.addEventListener("click", (event) => {
  const index = event.target.dataset.remove;
  if (index !== undefined) {
    cart.splice(Number(index), 1);
    renderCart();
  }
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter);
    });
  });
});

document.querySelector(".newsletter form").addEventListener("submit", (event) => {
  event.preventDefault();
  toast.textContent = "Bienvenue dans le club !";
  toast.classList.add("show");
  event.target.reset();
  setTimeout(() => {
    toast.classList.remove("show");
    toast.textContent = "Ajouté au panier";
  }, 1800);
});
