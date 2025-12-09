const submitbtn = document.querySelector("form button");
const cards = document.querySelector(".cards");
let list = JSON.parse(localStorage.getItem("cardObj")) || [];

renderReceipe();

let recentlyCooked = JSON.parse(localStorage.getItem("recentlyCook")) || [];
submitbtn.addEventListener("click", (e) => {
	e.preventDefault();
	const category = document.querySelectorAll("[type=checkbox]:checked");
	const difficulty = document.querySelector("[type=radio]:checked");
	const time = document.querySelector("#cooking-time");
	const ing = document.querySelector("#ing");
	const recName = document.querySelector("#rec-name");

	if (!difficulty || !time || !ing || !recName || category.length == 0) {
		alert("all fields are required");
		return;
	}
	const obj = {};
	obj.category = [...category].map((ele) => ele.value);
	obj.difficulty = difficulty?.value;
	obj.recName = recName.value;
	obj.time = time.value;
	obj.ingredients = ing.value;
	obj.id = list.length + 1;
	obj.favourite = false;
	list.push(obj);
	localStorage.setItem("cardObj", JSON.stringify(list));
	renderReceipe();
	time.value = "";
	recName.value = "";
	time.value = "";
	ing.value = "";
});

function renderReceipe(showFav = false) {
	cards.innerHTML = "";
	list.filter((ele) => (showFav && ele.favourite) || (!showFav && true)).forEach(
		(temp) => {
			const card = document.createElement("div");
			card.className = "card";
			card.dataset.id = temp.id;
			card.innerHTML = `<h3>Name: ${temp.recName}</h3>
                <p>Time : ${temp.time} min</p>
                <p>Difficulty : ${temp.difficulty}</p>
                <p>Category : [${temp.category}]</p>
                <div class="buttons">
                    <button class="cook">Cook This</button>
                    <button class="fav">Favourite</button>
                    <button class="del">Delete</button>
                </div>`;
			if (temp.favourite) {
				card.querySelector(".fav").textContent = "Remove Fav";
				card.querySelector(".fav").style.backgroundColor = "red";
			}

			cards.appendChild(card);
		}
	);
}

cards.addEventListener("click", (e) => {
	const card = e.target.closest(".card");

	if (e.target.textContent == "Favourite") {
		const eleId = card.dataset.id;
		for (let ele of list) {
			if (ele.id == eleId) {
				ele.favourite = true;
				e.target.style.backgroundColor = "red";
				e.target.textContent = "Remove Fav";
				break;
			}
		}

		localStorage.setItem("cardObj", JSON.stringify(list));
	} else if (e.target.textContent == "Delete") {
		const eleId = card.dataset.id;
		list = list.filter((ele) => ele.id != eleId);
		renderReceipe();
		localStorage.setItem("cardObj", JSON.stringify(list));
	} else if (e.target.textContent == "Cook This") {
		const eleId = card.dataset.id;
		const cookElement = list.find((ele) => ele.id == eleId);
		if (recentlyCooked.length >= 5) {
			recentlyCooked.shift();
		}
		if (!recentlyCooked.some((ele) => ele.id == eleId)) {
			recentlyCooked.push(cookElement);
		}

		localStorage.setItem("recentlyCook", JSON.stringify(recentlyCooked));
	} else if (e.target.textContent == "Remove Fav") {
		const eleId = card.dataset.id;
		for (let ele of list) {
			if (ele.id == eleId) {
				ele.favourite = false;
				break;
			}
		}
		localStorage.setItem("cardObj", JSON.stringify(list));
		if (cards.children.length !== list.length) {
			renderReceipe(true);
		} else {
			e.target.style.backgroundColor = "rebeccapurple";
			e.target.textContent = "Favourite";
		}
		e.target.style.backgroundColor = "rebeccapurple";
		e.target.textContent = "Favourite";
	}
});

const allBtn = document.querySelector("section button");
const favBtn = document.querySelectorAll("section button")[1];
const recCookedBtn = document.querySelectorAll("section button")[2];
const spinBtn = document.querySelectorAll("section button")[3];

spinBtn.addEventListener("click", () => {
	for (let i of cards.children) {
		i.style.backgroundColor = "";
		i.style.transform = "scale(1)";
	}
	const num = Math.floor(Math.random() * cards.children.length);
	const ele = cards.children[num];
	ele.style.backgroundColor = "gold";
	ele.style.transform = "scale(1.1)";
	ele.style.transition = "0.3s";
});

favBtn.addEventListener("click", () => {
	renderReceipe(true);
});

allBtn.addEventListener("click", () => {
	renderReceipe();
});
recCookedBtn.addEventListener("click", () => {
	cards.innerHTML = "";
	for (let temp of recentlyCooked) {
		const card = document.createElement("div");
		card.className = "card";
		card.dataset.id = temp.id;
		card.innerHTML = `<h3>Name: ${temp.recName}</h3>
                <p>Time : ${temp.time} min</p>
                <p>Difficulty : ${temp.difficulty}</p>
                <p>Category : [${temp.category}]</p>
                `;

		cards.appendChild(card);
	}
});
