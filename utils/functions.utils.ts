export const formatDateTime = (date: string | Date) => {
    const formattedDate = new Date(date);

    return {
        date: formattedDate.toLocaleDateString("en-GB"),
        time: formattedDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};


export function getInitials(firstName: string, lastName: string) {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";
    return (first + last).toUpperCase() || "?";
}


interface FormatDistanceToNowOptions {
    addSuffix?: boolean;
}

export function formatDistanceToNow(
    date: Date | string | number,
    options: FormatDistanceToNowOptions = {}
): string {
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
        return "invalid date";
    }

    const now = Date.now();
    const diffInSeconds = Math.round((now - targetDate.getTime()) / 1000);
    const isPast = diffInSeconds >= 0;
    const seconds = Math.abs(diffInSeconds);

    let distanceText = "";

    if (seconds < 30) {
        distanceText = "less than a minute";
    } else if (seconds < 90) {
        distanceText = "1 minute";
    } else if (seconds < 45 * 60) {
        const minutes = Math.round(seconds / 60);
        distanceText = `${minutes} minutes`;
    } else if (seconds < 90 * 60) {
        distanceText = "about 1 hour";
    } else if (seconds < 24 * 3600) {
        const hours = Math.round(seconds / 3600);
        distanceText = `about ${hours} hours`;
    } else if (seconds < 42 * 3600) {
        distanceText = "1 day";
    } else if (seconds < 30 * 86400) {
        const days = Math.round(seconds / 86400);
        distanceText = `${days} days`;
    } else if (seconds < 45 * 86400) {
        distanceText = "about 1 month";
    } else if (seconds < 365 * 86400) {
        const months = Math.round(seconds / (30 * 86400));
        distanceText = `about ${months} months`;
    } else if (seconds < 547 * 86400) {
        distanceText = "about 1 year";
    } else {
        const years = Math.round(seconds / (365 * 86400));
        distanceText = `about ${years} years`;
    }

    if (options.addSuffix) {
        if (isPast) {
            return `${distanceText} ago`;
        } else {
            return `in ${distanceText}`;
        }
    }

    return distanceText;
}