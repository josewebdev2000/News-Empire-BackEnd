// Import required packages to build up node server
const express = require("express");
const nodeFetch = require("node-fetch");

// Environment variables
const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;

const app = express();

// Configure the server appropiately
app.use(express.urlencoded({extended: true}));
app.use(express.json());

function makeAPIRequest(url, res)
{
    const newsDataRes = [];

    nodeFetch.fetch(url)
        .then(response => response.json())
        .then(news => {
            const newsData = news.data;

            newsData.map(newData => {
                newsDataRes.push({
                    newsTitle: newData.title,
                    imgLink: newData.image_url,
                    summary: newData.description,
                    newsLink: newData.url
                })
            });

            res.send(JSON.stringify({
                newsData: newsDataRes
            }));


        })
        .catch(err => console.log(err));

}

// Configure GET request of all news
app.get("/", (req, res) => 
{
    const urlToFetch = `https://api.thenewsapi.com/v1/news/top?api_token=${APIKEY}&language=en&exclude_domains=worldmags.net`;
    makeAPIRequest(urlToFetch, res);
});

// Configure POST request for specific searches
app.post("/search", (req, res) => {

    const {newsToSearch} = req.body;

    const urlToFetch = `https://api.thenewsapi.com/v1/news/top?api_token=${APIKEY}&language=en&exclude_domains=worldmags.net&search=${newsToSearch}`;

    makeAPIRequest(urlToFetch, res);

});


// Start the server out
app.listen(PORT, () => {
    console.log(`Server started running on port ${PORT}`);
});

