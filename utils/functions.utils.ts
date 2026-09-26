

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


export function formatCurrency(amount?: number | null): string {
    if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
}


export function formatBytes(bytes?: number | null): string {
    if (!bytes || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function calculateNetAmount(bidAmount: number, feeRate = 0.1): number {
    return Math.round(bidAmount * (1 - feeRate) * 100) / 100;
}

export function toRichTextContent(text?: string | null): string {
    const HTML_PATTERN = /<\/?[a-z][\s\S]*>/i;
    if (!text) return "<p></p>";
    if (HTML_PATTERN.test(text)) return text;
    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
}

