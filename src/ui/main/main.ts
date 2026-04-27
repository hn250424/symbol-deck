import "./main.scss";
import { ranges } from "../../unicode/constants";
import { getUnicodes } from "../../unicode/utils";
import { AeroToast } from "@hn250424/aero";

export function init() {
	const selected = getSelectedFromURL();

	// Build select options
	const options = Object.keys(ranges)
		.map(
			(key) =>
				`<option value="${key}"${key === selected ? " selected" : ""}>${key}</option>`
		)
		.join("");

	renderGrid(selected);

	// Select change → update URL + re-render grid
	const select = document.getElementById("unicode-select") as HTMLSelectElement;
	select.innerHTML = options
	select.addEventListener("change", () => {
		const value = select.value as keyof typeof ranges;
		updateURL(value);
		renderGrid(value);
	});

	// Grid click → copy to clipboard
	const grid = document.getElementById("grid-container")!;
	grid.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains("unicode-item")) {
			const char = target.dataset.char;
			if (char) {
				navigator.clipboard.writeText(char);
				AeroToast.show("Copied!");
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

function getSelectedFromURL(): keyof typeof ranges {
	const params = new URLSearchParams(window.location.search);
	const value = params.get("unicode_type");
	if (value && value in ranges) return value as keyof typeof ranges;
	return "arrows";
}

function updateURL(value: string) {
	const url = new URL(window.location.href);
	url.searchParams.set("unicode_type", value);
	window.history.pushState({}, "", url.toString());
}

function renderGrid(selected: keyof typeof ranges) {
	const grid = document.getElementById("grid-container")!;
	const unicodes = getUnicodes(...ranges[selected]);

	grid.innerHTML = unicodes
		.map(
			(item) =>
				`<button class="unicode-item" title="${item.code}" data-char="${item.char}">${item.char}</button>`
		)
		.join("");
}

