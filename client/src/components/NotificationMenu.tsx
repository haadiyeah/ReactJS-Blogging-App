import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/store'; //zustand 
import '../assets/styles/notification.css'
import { formatNotifTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js

interface NotifMenuProps {
    isNotificationsOpen: boolean;
    setIsNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>> //dispatch function
}

interface FormattedNotifs {
    type: string;
    notifText: string;
    date: string; 
}

interface CustomPayloadToken {
    username: string;
    _id: string;
}

interface Notification {
    type: string;
    notifText: string;
    user: string;
    createdAt: Date;
}


const NotificationMenu: React.FC<NotifMenuProps> = ({ isNotificationsOpen, setIsNotificationsOpen }) => {
    const { token, setToken } = useStore(); //getting token
    const [notifications, setNotifications] = useState <FormattedNotifs[]> ([]); //notifications array
    const [showAll, setShowAll] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    let id;

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode <CustomPayloadToken> (token);
            const id = decodedToken._id;

            fetch('http://localhost:3000/interaction/notifications', {
                headers: {
                    'Authorization': `${token}`
                }
            })
                .then(response => response.json())
                .then((data: Notification[]) => {
                    const formattedNotifications = data.map(notification => {
                       const timeStamp =formatNotifTimestamp(notification.createdAt);
                        return {
                            type: notification.type,
                            notifText: notification.notifText,
                            date: timeStamp,
                        };
                    });

                    setNotifications(formattedNotifications);
                })
                .catch(error => console.error(error));
        }
    }, [token]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
            <ul>
                {notifications.length > 0 ? (

                    (showAll ? notifications : notifications.slice(0, 5)).map((notification, index) => (
                        <li key={index} className='notificationBrief'>
                            {notification.type === 'comment' && '💬 '}
                            {notification.type === 'follower' && '👥 '}
                            {notification.type === 'rating' && '⭐ '}
                            {notification.notifText} - <b className='notificationBriefDate'>{notification.date}</b>
                            <hr></hr>
                        </li>
                        ))
                ) : (
                    <li className='notificationBrief'>No notifs yet. Interact with some users to get rolling!</li>
                )}

                {notifications.length > 5 ? ( <li><button className='notifShowAll' onClick={() => setShowAll(!showAll)}>
                            {showAll ? 'Show less' : 'Show all'}
                        </button></li>) : null}

            </ul>
        </div>
    )
}
export default NotificationMenu;