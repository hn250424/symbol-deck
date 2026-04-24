import "./main.scss";
import { ranges } from "./unicode/constants";
import { getUnicodes } from "./unicode/utils";

function getSelectedFromURL(): keyof typeof ranges {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("unicode_type");
  if (value && value in ranges) {
    return value as keyof typeof ranges;
  }
  return "arrows";
}

function updateURL(value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("unicode_type", value);
  window.history.pushState({}, "", url.toString());
}

function renderGrid(selected: keyof typeof ranges) {
  const grid = document.getElementById("unicode_grid")!;
  const unicodes = getUnicodes(...ranges[selected]);

  grid.innerHTML = unicodes
    .map(
      (item) =>
        `<button class="unicode-grid__item" title="${item.code}" data-char="${item.char}">${item.char}</button>`
    )
    .join("");
}

function init() {
  const app = document.getElementById("root")!;
  const selected = getSelectedFromURL();

  // Build select options
  const options = Object.keys(ranges)
    .map((key) => `<option value="${key}"${key === selected ? " selected" : ""}>${key}</option>`)
    .join("");

  app.innerHTML = `
    <div id="app_container">
      <header>헤더</header>
      <main>
        <div class="home">
          <h2 class="home__title">Unicode</h2>
          <select id="unicode_select" class="home__select">${options}</select>
          <div id="unicode_grid" class="unicode-grid"></div>
        </div>
      </main>
      <footer>푸터</footer>
    </div>
  `;

  renderGrid(selected);

  // Select change → update URL + re-render grid
  const select = document.getElementById("unicode_select") as HTMLSelectElement;
  select.addEventListener("change", () => {
    const value = select.value as keyof typeof ranges;
    updateURL(value);
    renderGrid(value);
  });

  // Grid click → copy to clipboard
  const grid = document.getElementById("unicode_grid")!;
  grid.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("unicode-grid__item")) {
      const char = target.dataset.char;
      if (char) {
        navigator.clipboard.writeText(char);
      }
    }
  });

  // Handle browser back/forward
  window.addEventListener("popstate", () => {
    const newSelected = getSelectedFromURL();
    select.value = newSelected;
    renderGrid(newSelected);
  });
}

document.addEventListener("DOMContentLoaded", init);
