import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/store'; //zustand 
import '../assets/styles/notification.css'

function NotificationMenu({ isNotificationsOpen, setIsNotificationsOpen }) {
    const { token, setToken } = useStore(); //getting token
    const [notifications, setNotifications] = useState([]); //notifications array
    const [showAll, setShowAll] = useState(false); 
    const menuRef = useRef(); // Create a ref
    let id;

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const id = decodedToken._id;

            fetch('http://localhost:3000/interaction/notifications', {
                headers: {
                    'Authorization': `${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    const formattedNotifications = data.map(notification => {
                        let date = new Date(notification.createdAt);
                        let now = new Date();
                        let diffTime = Math.abs(now - date);
                        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        let timestamp;

                        if (diffDays < 1) {
                            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                            if (diffHours < 1) { //not catering for minutes sorry:(
                                timestamp = 'just now';
                            } else {
                                timestamp = `${diffHours} hr ago`;
                            }
                        } else {
                            timestamp = `${diffDays} d ago`;
                        }
                        return {
                            type: notification.type,
                            notifText: notification.notifText,
                            date: timestamp
                        };
                    });

                    setNotifications(formattedNotifications);
                })
                .catch(error => console.error(error));
        }
    }, [token]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, setIsNotificationsOpen]);

    return (
        <div ref={menuRef} className={`notifications-menu ${isNotificationsOpen ? 'open' : ''}`}>
            {/* <ul>
            {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                    <li key={index} className='notificationBrief'>
                        {notification.type === 'comment' && '💬'}
                        {notification.type === 'follower' && '👥'}
                        {notification.type === 'rating' && '⭐'}
                        {notification.notifText} - <b className='notificationBriefDate'>{notification.date}</b>
                        <hr></hr>
                    </li>
                ))
            ) : (
                <li className='notificationBrief'>No notifs yet. Interact with some users to get rolling!</li>
            )}
            <li><button className='notifShowAll'>Show all</button> </li>
        </ul> */}

            <ul>
                {notifications.length > 0 ? (
                    (showAll ? notifications : notifications.slice(0, 5)).map((notification, index) => (
                        <li key={index} className='notificationBrief'>
                            {notification.type === 'comment' && '💬'}
                            {notification.type === 'follower' && '👥'}
                            {notification.type === 'rating' && '⭐'}
                            {notification.notifText} - <b className='notificationBriefDate'>{notification.date}</b>
                            <hr></hr>
                        </li>
                    ))
                ) : (
                    <li className='notificationBrief'>No notifs yet. Interact with some users to get rolling!</li>
                )}
                <li><button className='notifShowAll' onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show less' : 'Show all' }
                </button></li>
            </ul>
        </div>
    )
}
export default NotificationMenu;