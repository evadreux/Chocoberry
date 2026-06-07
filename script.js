const form = document.querySelector(".order-form");
const toast = document.querySelector(".toast");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});
