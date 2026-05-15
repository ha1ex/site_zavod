const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });
}

const featureButtons = document.querySelectorAll(".feature-item");

featureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = button.classList.contains("is-open");

    featureButtons.forEach((item) => {
      item.classList.remove("is-open");
      const itemPanel = item.nextElementSibling;
      if (itemPanel) itemPanel.hidden = true;
    });

    if (!isOpen) {
      button.classList.add("is-open");
      if (panel) panel.hidden = false;
    }
  });
});
