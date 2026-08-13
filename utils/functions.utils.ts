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