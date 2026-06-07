const stories = document.querySelectorAll(".story");
const creations = document.querySelectorAll(".creation");
const productSelect = document.querySelector('select[name="product"]');
const orderForm = document.querySelector(".order-form");
const toast = document.querySelector(".toast");

stories.forEach((story) => {
  story.addEventListener("click", () => {
    stories.forEach((item) => item.classList.remove("active"));
    story.classList.add("active");

    creations.forEach((creation) => {
      const show = story.dataset.filter === "all" || creation.dataset.category === story.dataset.filter;
      creation.classList.toggle("hidden", !show);
    });

    document.querySelector("#creations").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    productSelect.value = button.dataset.product;
    document.querySelector("#commander").scrollIntoView({ behavior: "smooth" });
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});
