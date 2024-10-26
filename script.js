document.addEventListener("DOMContentLoaded", () => {
    const apiEndpoint = "https://cds.thepublive.com/publisher/2741/latest-posts/article/?page=1&limit=50";
    const cardContainer = document.getElementById("cardContainer");
    const loadingIndicator = document.getElementById("loading");
    const searchInput = document.getElementById("searchInput");

    async function fetchData() {
        try {
            loadingIndicator.style.display = "block"; 
            const response = await fetch(apiEndpoint);
            const data = await response.json();

            if (data.status === "ok") {
                renderCards(data.data);
            } else {
                throw new Error("Data could not be retrieved.");
            }
        } catch (error) {
            cardContainer.innerHTML = `<p>Failed to load data. Please try again later.</p>`;
        } finally {
            loadingIndicator.style.display = "none"; 
        }
    }

    function renderCards(data) {
        cardContainer.innerHTML = ""; 
        data.forEach(item => {
            const card = createCard(item);
            cardContainer.appendChild(card);
        });
    }

    function createCard(item) {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.banner_url || 'https://via.placeholder.com/640x480'}" alt="${item.title || "No title available"}">
            <h2>${item.title || "No title available"}</h2>
            <p>${item.short_description || "No description available."}</p>
            <p class="date">${formatDate(item.formatted_first_published_at_datetime)}</p>
        `;
        
        return card;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Search functionality
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const cards = cardContainer.getElementsByClassName("card");
        
        Array.from(cards).forEach(card => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            const description = card.querySelector("p").textContent.toLowerCase();
            if (title.includes(query) || description.includes(query)) {
                card.style.display = ""; 
            } else {
                card.style.display = "none"; 
            }
        });
    });

    fetchData();
});
