const appGrid = document.querySelector(".app-grid");

const apps =
[
    {"name":"Spanish revision", "link":"Spanish/spanish.html", "image":"Spanish/spanish.png"}
]


document.addEventListener("DOMContentLoaded", () =>
{
    apps.forEach((app) =>
    {
        appGrid.appendChild(CreateAppElement(app["name"], app["link"], app["image"]));
    });
});

//<div class="app-item">
//                <div class="image-wrapper">
//                    <img src="Spanish\spanish.png">
//                </div>
//                <h2>Spanish Revision</h2>
//            </div>

function CreateAppElement(name, link, image)
{
    const appDiv = document.createElement("div");
    appDiv.classList.add("app-item");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image-wrapper");

    appDiv.appendChild(imageDiv);

    const imageElement = document.createElement("img");
    imageElement.src = image;

    imageDiv.appendChild(imageElement);

    const text = document.createElement("h2");
    text.innerHTML = name;

    appDiv.appendChild(text);

    appDiv.addEventListener("click", () =>
    {
        document.location.href = link;
    });

    return appDiv;
}