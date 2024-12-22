export const convertTimeToDaysAgo = (createdAt: string) => {
    const timestampDate = new Date(createdAt);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - timestampDate.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

    const result = daysAgo === 0 ? "Today" : `${daysAgo} day(s) ago`;
    return result;
};