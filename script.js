const form = document.querySelector(".order-form");
const toast = document.querySelector(".toast");
const choices = document.querySelectorAll(".cake-choice");
const secondTopping = document.querySelector(".second-topping");
const cakeTotal = document.querySelector(".cake-total");
const cakeRecap = document.querySelector(".cake-recap");
const details = document.querySelector('textarea[name="details"]');
const product = document.querySelector('select[name="product"]');

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
  product.value = "Layer cake";
  details.value = `Layer cake : ${cakeRecap.textContent} · Total indicatif ${cakeTotal.textContent}`;
  document.querySelector("#commander").scrollIntoView({ behavior: "smooth" });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});
