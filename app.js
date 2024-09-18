var map = L.map('map').setView([20, 0], 2);  // Centered at [lat, lng] with zoom level 2

// Add a tile layer to the map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

async function getNews(countryCode) {
    const apiKey = 'e9af0bbad4c2499180bd38fde03c8ec0';
    const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;

    
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

map.on('click', async function(e) {
    // Get the clicked location's latitude and longitude
    const latlng = e.latlng;
    // For now, let's use a static country code like 'us' for testing
    const countryCode = 'us';  // Replace with dynamic country code logic

    
    let newsArticles = await getNews(countryCode);
    displayNews(newsArticles);
});


function displayNews(articles) {
    // Clear existing news
    let newsDiv = document.getElementById('news');
    if (!newsDiv) {
        newsDiv = document.createElement('div');
        newsDiv.id = 'news';
        document.body.appendChild(newsDiv);
    }

    newsDiv.innerHTML = '';  // Clear previous news
    
    if (articles.length === 0) {
        newsDiv.innerHTML = '<p>No news available for this region.</p>';
        return;
    }

    articles.forEach(article => {
        let articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsDiv.appendChild(articleDiv);
    });
}
