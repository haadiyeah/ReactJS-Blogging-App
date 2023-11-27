
export function formatTimestamp(inputTimestamp) {
    const date = new Date(inputTimestamp);

    //date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    //time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    //formatted string
    const formattedString = `${year}-${month}-${day}, ${hours}:${minutes}`;

    return formattedString;
}

export function formatNotifTimestamp(inputTimestamp) {
    let date = new Date(inputTimestamp);
    let now = new Date();
    let diffTime = Math.abs(now - date);
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Use Math.floor here
    let timestamp;

    if (diffDays < 1) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); // Use Math.floor here
        if (diffHours < 1) { //not catering for minutes sorry:(
            timestamp = 'just now';
        } else {
            timestamp = `${diffHours} hr ago`;
        }
    } else {
        timestamp = `${diffDays} d ago`;
    }
    return timestamp;
}