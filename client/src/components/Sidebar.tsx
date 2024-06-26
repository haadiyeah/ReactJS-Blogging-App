import '../assets/styles/blogfeed.css';
import '../assets/styles/global.css';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface BlogType {
    _id: string;
    id: string;
    image?: string;
    createdAt: string;
    title: string;
    averageRating: number;
    blurb?: string;
    content: string;
    owner: string;
}

interface SidebarProps {
    setBlogs: React.Dispatch<React.SetStateAction<BlogType[]>>; // another way: (blogs: BlogType[]) => void;
    setLimit: (limit: number) => void;
    limit: number;
    setPage: (page: number) => void;
    setTotalPages: (totalPages: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setBlogs, setLimit, limit, setPage, setTotalPages }) => {
    const [searchKeywords, setSearchKeywords] = useState<string>('');
    const [keywordsArray, setKeywordsArray] = useState<string[]>([]);
    const [selectedSort, setSelectedSort] = useState<{ sortBy: string; sortOrder: string }>({ sortBy: 'createdAt', sortOrder: 'desc' });
    const [searchAuthor, setSearchAuthor] = useState<string>('');

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedSort({ sortBy: event.target.value, sortOrder: event.target.id });
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchKeywords(event.target.value);
        setKeywordsArray(event.target.value.split(' '));
    };

    const handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchAuthor(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        let fetchString = `http://localhost:3000/search/?`;

        const keywordParams = keywordsArray.map(keyword => `keywords[]=${keyword}`);
        fetchString += keywordParams.join('&');

        fetchString += `&sortBy=${selectedSort.sortBy}&sortOrder=${selectedSort.sortOrder}&limit=${limit}`;

        if (searchAuthor !== '') {
            fetchString += `&author=${searchAuthor}`;
        }

        fetch(fetchString)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                setBlogs(data.blogs);
                setPage(1);
                setTotalPages(data.totalPages);
            })
            .catch(error => {
                if (error.message.includes('404')) {
                    setBlogs([]);
                    setTotalPages(1);
                }
                console.error('Fetch error:', error);
            });
    };

    return (
        <div className="sidebar">
            <h5>Keywords</h5>
            <form onSubmit={handleSearchSubmit} className="searchbar">
                <input type="text" placeholder="Search..." value={searchKeywords} onChange={handleSearchChange} />
                <input type="submit" value="🔍" />
            </form>

            <h5>Author</h5>
            <form onSubmit={handleSearchSubmit} className="searchbar">
                <input type="text" placeholder="Search..." value={searchAuthor} onChange={handleAuthorChange} />
                <input type="submit" value="🔍" />
            </form>

            <h5>Sort by</h5>
            <form>
                {/* Radio buttons for sorting */}
            </form>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <p>Show 
                    <input type="number" id="limitPosts" className="sidebarTextfield" placeholder='10' min="1" max="15" value={limit.toString()} onChange={(event) => setLimit(parseInt(event.target.value)) } /> 
                posts per page </p>
            </div>

            <button id="goSearch" onClick={handleSearchSubmit}>Apply Settings</button>
        </div>
    );
}

export default Sidebar;