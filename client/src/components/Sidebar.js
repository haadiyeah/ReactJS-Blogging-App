import '../assets/styles/blogfeed.css';
import React, { useState } from 'react';

function Sidebar({ setBlogs, setLimit, limit, setPage, setTotalPages}) {
    const [searchKeywords, setsearchKeywords] = useState('');
    const [keywordsArray, setKeywordsArray] = useState([]); //search results [blog
    const [selectedSort, setSelectedSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });

    const handleRadioChange = (event) => {
        setSelectedSort({ sortBy: event.target.value, sortOrder: event.target.id });
    };


    const handleSearchChange = (event) => {
        setsearchKeywords(event.target.value);
        setKeywordsArray(event.target.value.split(' ')); //split-> gives an array of words
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
    
        let fetchString = `http://localhost:3000/search/?`;

        // adding all the keywords
        let keywordParams = keywordsArray.map(keyword => `keywords[]=${keyword}`); // map keywords to query parameters
        fetchString += keywordParams.join('&'); // join query parameters with '&' as the separator

        fetchString += `&sortBy=${selectedSort.sortBy}&sortOrder=${selectedSort.sortOrder}&limit=${limit}`

        console.log("FETCHING: " + fetchString)

        fetch(fetchString)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                //error as json
                return response.json();
            })
            .then(data => { 
                setBlogs(data.blogs); 
                setPage(1); //start at first page!!
                setTotalPages(data.totalPages);  //total no of pages that will be required
            })
            .catch(error => {
                console.error('Fetch error:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
            });

            console.log(keywordsArray);
    };

    return (
        <div className="sidebar">
            <form id="searchSidebar" onSubmit={handleSearchSubmit}>
                <input type="text" placeholder="Search..." value={searchKeywords} onChange={handleSearchChange} />
                <input type="submit" value="🔍" />
            </form>

            <h1>Sort by</h1>
            <form>
                <input type="radio" id="desc" name="sort" value="createdAt" checked={selectedSort.sortBy === 'createdAt' && selectedSort.sortOrder === 'desc'} onChange={handleRadioChange} defaultChecked />
                <label htmlFor="newest">Newest First</label><br />

                <input type="radio" id="asc" name="sort" value="createdAt" checked={selectedSort.sortBy === 'createdAt' && selectedSort.sortOrder === 'asc'} onChange={handleRadioChange} />
                <label htmlFor="oldest">Oldest First</label><br />

                <input type="radio" id="desc" name="sort" value="rating" checked={selectedSort.sortBy === 'rating' && selectedSort.sortOrder === 'desc'} onChange={handleRadioChange} />
                <label htmlFor="highest">Highest Rated</label><br />

                <input type="radio" id="asc" name="sort" value="rating" checked={selectedSort.sortBy === 'rating' && selectedSort.sortOrder === 'asc'} onChange={handleRadioChange} />
                <label htmlFor="lowest">Lowest Rated</label><br />

                <input type="radio" id="asc" name="sort" value="title" checked={selectedSort.sortBy === 'title' && selectedSort.sortOrder === 'asc'} onChange={handleRadioChange} />
                <label htmlFor="alphabetical">Title A-Z</label><br />

                <input type="radio" id="desc" name="sort" value="title" checked={selectedSort.sortBy === 'title' && selectedSort.sortOrder === 'desc'} onChange={handleRadioChange} />
                <label htmlFor="reverseAlphabetical">Title Z-A</label><br />
            </form>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <p>Show 
                    <input type="number" id="limitPosts" placeholder='10' min="1" max="15" value={limit} onChange={(event) => setLimit(event.target.value) } /> 
                posts per page </p>
            </div>
        </div>
    );
}

export default Sidebar;