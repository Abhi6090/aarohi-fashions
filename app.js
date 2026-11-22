// Sample storefront content. Replace products and prices with Aarohi's real catalogue before launch.
const WHATSAPP_NUMBER = ""; // Add the store's country code and number, digits only, e.g. 919876543210.

const products = [
  { id: "ruhanii", name: "Ruhani Embroidered Kurta Set", category: "Kurta sets", price: 3490, tile: "tile-ivory", badge: "Bestseller", fabric: "Cotton blend · Set of 3", description: "An easy, polished kurta set with delicate threadwork and a soft, flowing dupatta. A lovely pick for family lunches and festive mornings." },
  { id: "noor", name: "Noor Everyday Kurta Set", category: "Kurta sets", price: 2790, tile: "tile-ivory", badge: "Everyday edit", fabric: "Cotton · Set of 3", description: "A comfortable silhouette with thoughtful embroidery, made for long days that still deserve a little detail." },
  { id: "sunehri", name: "Sunehri Co-ord Set", category: "Co-ord sets", price: 3190, tile: "tile-terracotta", badge: "New arrival", fabric: "Viscose blend · Set of 2", description: "A coordinated look with a relaxed fit and a touch of hand-inspired embroidery. Put it on and feel ready in moments." },
  { id: "gul", name: "Gul Relaxed Co-ord", category: "Co-ord sets", price: 2890, tile: "tile-terracotta", badge: "Easy favourite", fabric: "Cotton blend · Set of 2", description: "A soft, easy-to-style co-ord for travel, brunch and everything in between." },
  { id: "meher", name: "Meher Festive Suit Set", category: "Embroidered suits", price: 5490, tile: "tile-plum", badge: "For celebrations", fabric: "Silk blend · Set of 3", description: "A rich festive suit with intricate gold-tone embroidery and an elegant dupatta for celebrations and special evenings." },
  { id: "zari", name: "Zari Embroidered Suit", category: "Embroidered suits", price: 6290, tile: "tile-plum", badge: "Statement piece", fabric: "Chanderi blend · Set of 3", description: "A graceful occasion set with delicate zari-inspired detail, thoughtfully finished for moments worth dressing up for." },
  { id: "gulabi", name: "Gulabi Little Celebration Set", category: "Kidswear", price: 1890, tile: "tile-rose", badge: "Little ones", fabric: "Soft cotton blend · Set of 2", description: "A joyful, comfortable festive outfit for little celebrations. Gentle details meet an easy-to-wear silhouette." },
  { id: "choti-noor", name: "Choti Noor Kids Kurta Set", category: "Kidswear", price: 1490, tile: "tile-rose", badge: "Little ones", fabric: "Cotton blend · Set of 2", description: "A sweet, lightweight kurta set made for twirling, playing and joining in the family festivities." }
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const productGrid = document.querySelector("#product-grid");
const bagCount = document.querySelector(".bag-count");
const drawerCount = document.querySelector(".drawer-count");
const cartDrawer = document.querySelector(".cart-drawer");
const overlay = document.querySelector(".overlay");
const toast = document.querySelector(".toast");
const productDialog = document.querySelector(".product-dialog");
const checkoutDialog = document.querySelector(".checkout-dialog");
const cartContent = document.querySelector(".cart-content");
const drawerFooter = document.querySelector(".drawer-footer");
const searchBar = document.querySelector(".search-bar");
const searchInput = document.querySelector("#search-input");

let activeFilter = "All";
let searchTerm = "";
let toastTimer;
let cart = readCart();

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem("aarohi-cart") || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => products.some(product => product.id === item.id) && sizes.includes(item.size) && Number.isInteger(item.qty) && item.qty > 0) : [];
  } catch {
    return [];
  }
}

function persistCart() {
  localStorage.setItem("aarohi-cart", JSON.stringify(cart));
  renderCart();
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function visibleProducts() {
  return products.filter(product => {
    const matchesCategory = activeFilter === "All" || product.category === activeFilter;
    const matchesSearch = !searchTerm || `${product.name} ${product.category} ${product.fabric}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const items = visibleProducts();
  document.querySelector(".results-count").textContent = `${String(items.length).padStart(2, "0")} STYLES`;
  if (!items.length) {
    productGrid.innerHTML = '<div class="empty-products">No styles found. Try another search.</div>';
    return;
  }
  productGrid.innerHTML = items.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <div class="product-image ${product.tile}" role="img" aria-label="${product.name}"></div>
        <span class="product-badge">${product.badge}</span>
        <button class="quick-view" data-product="${product.id}" type="button">Quick view</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="add-to-bag" data-product="${product.id}" type="button">Choose size <span aria-hidden="true">＋</span></button>
      </div>
    </article>`).join("");
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + products.find(product => product.id === item.id).price * item.qty, 0);
}

function renderCart() {
  const quantity = cartQuantity();
  bagCount.textContent = quantity;
  drawerCount.textContent = `(${quantity})`;
  drawerFooter.hidden = cart.length === 0;

  if (!cart.length) {
    cartContent.innerHTML = `<div class="cart-empty"><span class="flower" aria-hidden="true">✿</span><h3>Your bag is waiting.</h3><p>Find something lovely to make it yours.</p><button class="text-link browse-from-bag" type="button">Explore the collection <span aria-hidden="true">↗</span></button></div>`;
    return;
  }

  cartContent.innerHTML = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `<article class="cart-item">
      <div class="cart-thumb ${product.tile}" role="img" aria-label="${product.name}"></div>
      <div><h3>${product.name}</h3><p>Size ${item.size}</p>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" data-quantity="-1" data-key="${item.id}|${item.size}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-quantity="1" data-key="${item.id}|${item.size}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div><div class="cart-item-price">${formatPrice(product.price * item.qty)}</div><button class="remove-item" type="button" data-remove="${item.id}|${item.size}">Remove</button></div>
    </article>`;
  }).join("");
  document.querySelector(".cart-subtotal strong").textContent = formatPrice(cartTotal());
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function openBag() {
  overlay.hidden = false;
  cartDrawer.inert = false;
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-overlay");
  requestAnimationFrame(() => {
    overlay.classList.add("is-visible");
    cartDrawer.classList.add("is-open");
  });
  document.querySelector(".close-cart").focus();
}

function closeBag() {
  overlay.classList.remove("is-visible");
  cartDrawer.classList.remove("is-open");
  cartDrawer.inert = true;
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-overlay");
  setTimeout(() => { if (!cartDrawer.classList.contains("is-open")) overlay.hidden = true; }, 260);
}

function openProduct(productId) {
  const product = products.find(entry => entry.id === productId);
  if (!product) return;
  const image = `<div class="dialog-product-image ${product.tile}" role="img" aria-label="${product.name}"></div>`;
  const details = `<div class="dialog-product-copy">
    <p class="eyebrow">${product.category.toUpperCase()} · ${product.badge.toUpperCase()}</p>
    <h2 id="product-dialog-title">${product.name}</h2>
    <p class="dialog-product-price">${formatPrice(product.price)}</p>
    <p class="dialog-product-description">${product.description}</p>
    <p class="dialog-product-description"><strong>${product.fabric}</strong><br>Sample product details — final fabric, fit and care information can be added later.</p>
    <label class="field-label" for="product-size">Choose a size</label>
    <select id="product-size">${sizes.map(size => `<option value="${size}" ${size === "M" ? "selected" : ""}>${size}</option>`).join("")}</select>
    <button class="button button-dark modal-add" type="button" data-product="${product.id}">Add to bag <span aria-hidden="true">→</span></button>
    <button class="text-link modal-whatsapp" type="button">Ask about this style on WhatsApp <span aria-hidden="true">↗</span></button>
  </div>`;
  document.querySelector(".product-dialog-content").innerHTML = image + details;
  productDialog.showModal();
}

function addToBag(productId, size) {
  const found = cart.find(item => item.id === productId && item.size === size);
  if (found) found.qty += 1;
  else cart.push({ id: productId, size, qty: 1 });
  persistCart();
  showToast("Added to your bag");
}

function changeQuantity(key, amount) {
  const [id, size] = key.split("|");
  const item = cart.find(entry => entry.id === id && entry.size === size);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(entry => entry !== item);
  persistCart();
}

function whatsappMessage() {
  if (!WHATSAPP_NUMBER) {
    showToast("WhatsApp ordering is ready to connect. Add Aarohi's business number before launch.");
    return;
  }
  const lines = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `• ${product.name} — size ${item.size} × ${item.qty}`;
  });
  const message = cart.length ? `Hello Aarohi! I'd like to order:\n${lines.join("\n")}\n\nSample total: ${formatPrice(cartTotal())}` : "Hello Aarohi! I'd love help choosing a style from your collection.";
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function renderCheckout() {
  const content = document.querySelector(".checkout-content");
  content.innerHTML = `<p class="eyebrow">A FEW DETAILS</p><h2 id="checkout-title">Your checkout</h2>
    <p class="checkout-intro">This is a local preview. Your details are not sent or saved, and no payment will be taken.</p>
    <div class="checkout-summary"><span>${cartQuantity()} item${cartQuantity() === 1 ? "" : "s"} · Sample total</span><strong>${formatPrice(cartTotal())}</strong></div>
    <form class="checkout-form" id="demo-checkout-form">
      <div class="form-field"><label for="customer-name">Your name</label><input id="customer-name" name="name" autocomplete="name" required></div>
      <div class="form-field"><label for="customer-phone">Phone number</label><input id="customer-phone" name="phone" autocomplete="tel" inputmode="tel" required></div>
      <div class="form-field full"><label for="customer-email">Email address</label><input id="customer-email" name="email" type="email" autocomplete="email" required></div>
      <div class="form-field full"><label for="customer-address">Delivery address</label><textarea id="customer-address" name="address" autocomplete="street-address" required></textarea></div>
      <div class="form-field"><label for="customer-city">City</label><input id="customer-city" name="city" autocomplete="address-level2" required></div>
      <div class="form-field"><label for="customer-pincode">PIN code</label><input id="customer-pincode" name="pincode" inputmode="numeric" autocomplete="postal-code" required></div>
      <label class="payment-choice form-field full"><input type="radio" checked disabled><span><strong>Online payment preview</strong><small>No payment is processed in this local demo. A payment provider will be connected for launch.</small></span></label>
      <button class="button button-dark" type="submit">Place demo order <span aria-hidden="true">→</span></button>
      <p class="demo-disclaimer">This button only previews the confirmation screen. It does not place a real order.</p>
    </form>`;
}

function openWhatsAppFromProduct() {
  const productId = document.querySelector(".modal-add")?.dataset.product;
  if (!WHATSAPP_NUMBER) {
    showToast("WhatsApp ordering is ready to connect. Add Aarohi's business number before launch.");
    return;
  }
  const product = products.find(entry => entry.id === productId);
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  const message = `Hello Aarohi! I have a question about ${product?.name || "a style"}.`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

renderProducts();
renderCart();
document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach(filter => filter.classList.toggle("is-active", filter === button));
  renderProducts();
}));

document.querySelectorAll(".category-card").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.category;
  searchTerm = "";
  searchInput.value = "";
  document.querySelectorAll(".filter-button").forEach(filter => filter.classList.toggle("is-active", filter.dataset.filter === activeFilter));
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
}));

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-product]");
  if (button) openProduct(button.dataset.product);
});

document.querySelector(".product-dialog-content").addEventListener("click", event => {
  if (event.target.closest(".modal-add")) {
    const productId = event.target.closest(".modal-add").dataset.product;
    const selectedSize = document.querySelector("#product-size").value;
    addToBag(productId, selectedSize);
    productDialog.close();
  }
  if (event.target.closest(".modal-whatsapp")) openWhatsAppFromProduct();
});

document.querySelector(".bag-button").addEventListener("click", openBag);
document.querySelector(".close-cart").addEventListener("click", closeBag);
overlay.addEventListener("click", closeBag);
cartContent.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(quantityButton.dataset.key, Number(quantityButton.dataset.quantity));
  if (removeButton) {
    const [id, size] = removeButton.dataset.remove.split("|");
    cart = cart.filter(item => !(item.id === id && item.size === size));
    persistCart();
  }
  if (event.target.closest(".browse-from-bag")) { closeBag(); document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }); }
});

document.querySelectorAll(".whatsapp-trigger").forEach(button => button.addEventListener("click", whatsappMessage));
document.querySelector(".checkout-open").addEventListener("click", () => {
  closeBag();
  renderCheckout();
  checkoutDialog.showModal();
});
document.querySelector(".checkout-content").addEventListener("submit", event => {
  if (event.target.id !== "demo-checkout-form") return;
  event.preventDefault();
  const firstName = new FormData(event.target).get("name").trim().split(/\s+/)[0];
  cart = [];
  persistCart();
  document.querySelector(".checkout-content").innerHTML = `<div class="success-state"><span class="success-mark" aria-hidden="true">✿</span><p class="eyebrow">PREVIEW COMPLETE</p><h2 id="checkout-title">Thank you, ${firstName}.</h2><p>This was a sample checkout only. No order or payment was sent. Your real store will be connected to delivery and payments before launch.</p><button class="button button-dark checkout-done" type="button">Back to Aarohi <span aria-hidden="true">↗</span></button></div>`;
});
document.querySelector(".checkout-content").addEventListener("click", event => {
  if (event.target.closest(".checkout-done")) checkoutDialog.close();
});

document.querySelector(".search-toggle").addEventListener("click", () => {
  searchBar.hidden = !searchBar.hidden;
  if (!searchBar.hidden) searchInput.focus();
  else { searchTerm = ""; searchInput.value = ""; renderProducts(); }
});
document.querySelector(".search-close").addEventListener("click", () => {
  searchBar.hidden = true;
  searchTerm = "";
  searchInput.value = "";
  renderProducts();
});
searchInput.addEventListener("input", () => { searchTerm = searchInput.value.trim(); renderProducts(); });

document.querySelector(".menu-toggle").addEventListener("click", event => {
  const menu = document.querySelector(".primary-nav");
  const isOpen = menu.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".primary-nav").classList.remove("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}));

document.querySelector("#newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  showToast("Email sign-up will be connected before launch. Thank you for your interest.");
  event.currentTarget.reset();
});

document.querySelectorAll(".dialog-close").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
for (const dialog of [productDialog, checkoutDialog]) {
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
}
document.addEventListener("keydown", event => { if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeBag(); });
