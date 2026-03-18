const input = document.getElementById("uppgift-input");
const knapp = document.getElementById("lagg-till-knapp");
const lista = document.getElementById("todo-lista");

knapp.addEventListener("click", laggTill);

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") laggTill();
});

function laggTill() {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    span.addEventListener("click", function () {
        li.classList.toggle("klar");
    });

    const taBortKnapp = document.createElement("button");
    taBortKnapp.type = "button";
    taBortKnapp.textContent = "Ta bort";
    taBortKnapp.classList.add("ta-bort");
    taBortKnapp.addEventListener("click", function () {
        lista.removeChild(li);
    });

    li.appendChild(span);
    li.appendChild(taBortKnapp);
    lista.appendChild(li);

    input.value = "";
}
