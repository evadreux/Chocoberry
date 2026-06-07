const form = document.querySelector(".order-form");
const toast = document.querySelector(".toast");
const choices = document.querySelectorAll(".cake-choice");
const secondTopping = document.querySelector(".second-topping");
const cakeTotal = document.querySelector(".cake-total");
const cakeRecap = document.querySelector(".cake-recap");
const orderSummary = document.querySelector('input[name="orderSummary"]');
const orderItems = document.querySelector(".order-items");
const orderCount = document.querySelector(".order-count");
const brownieChoices = document.querySelectorAll(".brownie-choice");
const brownieCounts = document.querySelectorAll(".brownie-count");
const brownieTotal = document.querySelector(".brownie-total");
const brownieRecap = document.querySelector(".brownie-recap");
const cookieOptions = document.querySelectorAll(".cookie-option");
const cookieTotal = document.querySelector(".cookie-total");
const cookieRecap = document.querySelector(".cookie-recap");
const cookieOrder = document.querySelector(".cookie-order");
const miniBoxChoices = document.querySelectorAll(".mini-box-choice");
const miniMixChoices = document.querySelectorAll(".mini-mix");
const miniSauces = document.querySelectorAll(".mini-sauce");
const minisTotal = document.querySelector(".minis-total");
const minisRecap = document.querySelector(".minis-recap");
const requestItems = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderRequest() {
  orderItems.replaceChildren();
  if (!requestItems.length) {
    const empty = document.createElement("p");
    empty.className = "order-empty";
    empty.textContent = "Ajoute des cookies, minis, brownies ou un layer cake depuis leur menu.";
    orderItems.append(empty);
  }

  requestItems.forEach((item, index) => {
    const article = document.createElement("article");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const recap = document.createElement("p");
    const remove = document.createElement("button");

    title.textContent = item.type;
    recap.textContent = item.recap;
    remove.type = "button";
    remove.textContent = "Retirer";
    remove.addEventListener("click", () => {
      requestItems.splice(index, 1);
      renderRequest();
    });
    copy.append(title, recap);
    article.append(copy, remove);
    orderItems.append(article);
  });

  orderCount.textContent = `${requestItems.length} article${requestItems.length > 1 ? "s" : ""}`;
  orderSummary.value = requestItems.map((item, index) => `${index + 1}. ${item.type} : ${item.recap}`).join("\n");
}

function addToRequest(type, recap) {
  requestItems.push({ type, recap });
  renderRequest();
  showToast(`${type} ajouté à ta demande.`);
  document.querySelector("#commander").scrollIntoView({ behavior: "smooth" });
}

function updateMinisSummary() {
  const box = document.querySelector(".mini-box-choice.selected");
  const mixes = [...document.querySelectorAll(".mini-mix.selected")].map((item) => item.dataset.value);
  const sauces = [...document.querySelectorAll(".mini-sauce.selected")];
  const premiumCount = sauces.filter((item) => item.dataset.premium === "true").length;
  const classicCount = sauces.length - premiumCount;
  const sauceExtra = premiumCount * 0.5 + Math.max(0, classicCount - (premiumCount ? 0 : 1)) * 0.5;
  minisTotal.textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(box.dataset.price) + sauceExtra);
  minisRecap.textContent = `${box.dataset.size} · ${mixes.join(", ")} · ${sauces.length ? sauces.map((item) => item.dataset.value).join(", ") : "sans sauce"}`;
}

miniBoxChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    miniBoxChoices.forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
    updateMinisSummary();
  });
});

miniMixChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (choice.classList.contains("selected") && document.querySelectorAll(".mini-mix.selected").length === 1) return;
    choice.classList.toggle("selected");
    updateMinisSummary();
  });
});

miniSauces.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (!choice.classList.contains("selected") && document.querySelectorAll(".mini-sauce.selected").length >= 3) return;
    choice.classList.toggle("selected");
    updateMinisSummary();
  });
});

document.querySelector(".minis-order").addEventListener("click", () => {
  addToRequest("Les minis", `${minisRecap.textContent} · Total ${minisTotal.textContent}`);
});

function updateCookieSummary() {
  let count = 0;
  let total = 0;
  const selection = [];
  cookieOptions.forEach((option) => {
    const quantity = Number(option.querySelector(".qty b").textContent);
    if (quantity) selection.push(`${quantity} × ${option.dataset.name}`);
    count += quantity;
    total += quantity * Number(option.dataset.price);
  });
  cookieTotal.textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(total);
  cookieRecap.textContent = count < 6 ? `${count} cookie${count > 1 ? "s" : ""} · minimum 6` : `${count} cookies · ${selection.join(", ")}`;
  cookieOrder.disabled = count < 6;
}

cookieOptions.forEach((option) => {
  option.querySelector(".plus").addEventListener("click", () => {
    const quantity = option.querySelector(".qty b");
    quantity.textContent = Number(quantity.textContent) + 1;
    option.classList.add("selected");
    updateCookieSummary();
  });
  option.querySelector(".minus").addEventListener("click", () => {
    const quantity = option.querySelector(".qty b");
    quantity.textContent = Math.max(0, Number(quantity.textContent) - 1);
    option.classList.toggle("selected", Number(quantity.textContent) > 0);
    updateCookieSummary();
  });
});

cookieOrder.addEventListener("click", () => {
  addToRequest("Cookies", `${cookieRecap.textContent} · Total ${cookieTotal.textContent}`);
});

function updateBrownieSummary() {
  const flavours = [...document.querySelectorAll(".brownie-choice.selected")].map((choice) => choice.dataset.value);
  const count = document.querySelector(".brownie-count.selected");
  brownieTotal.textContent = `${count.dataset.price} €`;
  brownieRecap.textContent = `${count.dataset.count} · ${flavours.join(", ")}`;
}

brownieChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (choice.classList.contains("selected") && document.querySelectorAll(".brownie-choice.selected").length === 1) return;
    choice.classList.toggle("selected");
    updateBrownieSummary();
  });
});

brownieCounts.forEach((count) => {
  count.addEventListener("click", () => {
    brownieCounts.forEach((item) => item.classList.remove("selected"));
    count.classList.add("selected");
    updateBrownieSummary();
  });
});

document.querySelector(".brownie-order").addEventListener("click", () => {
  addToRequest("Brownies", `${brownieRecap.textContent} · Total ${brownieTotal.textContent}`);
});

function updateCakeSummary() {
  const selected = {};
  document.querySelectorAll(".cake-choice.selected").forEach((choice) => {
    selected[choice.dataset.group] = choice.dataset.value;
  });
  const partsChoice = document.querySelector('[data-group="parts"].selected');
  const extra = secondTopping.checked ? Number(partsChoice.dataset.price) <= 60 ? 5 : 8 : 0;
  cakeTotal.textContent = `${Number(partsChoice.dataset.price) + extra} €`;
  document.querySelector(".topping-extra").textContent = Number(partsChoice.dataset.price) <= 60 ? "+ 5 €" : "+ 8 €";
  cakeRecap.textContent = `${selected.parts} · ${selected.base} · ${selected.cream} · ${selected.topping}${secondTopping.checked ? " · second topping" : ""}`;
}

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    document.querySelectorAll(`[data-group="${choice.dataset.group}"]`).forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
    updateCakeSummary();
  });
});

secondTopping.addEventListener("change", updateCakeSummary);

document.querySelector(".build-order").addEventListener("click", () => {
  addToRequest("Layer cake", `${cakeRecap.textContent} · Total indicatif ${cakeTotal.textContent}`);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requestItems.length) {
    showToast("Ajoute au moins un article à ta demande.");
    return;
  }
  showToast("Ta demande composée est prête.");
});
