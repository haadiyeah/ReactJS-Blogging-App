
export function formatTimestamp(inputTimestamp:Date | string ) : string {
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

export function formatNotifTimestamp(inputTimestamp: Date): string {
    const date = new Date(inputTimestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let timestamp: string;

    if (diffDays < 1) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours < 1) {
            timestamp = 'just now';
        } else {
            timestamp = `${diffHours} hr ago`;
        }
    } else {
        timestamp = `${diffDays} d ago`;
    }
    return timestamp;
}