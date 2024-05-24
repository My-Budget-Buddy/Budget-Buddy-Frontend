export const timedDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetch = (mockData: any): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 1000); // Wait for 1 second
    });
};

export function getCurrentMonthYear(): string {
    const currentDate = new Date();
    const selectedMonth = currentDate.getMonth();
    const selectedYear = currentDate.getFullYear();

    // Create monthYear string from selectedMonth and selectedYear
    const month =
        (selectedMonth + 1).toString().length === 2
            ? (selectedMonth + 1).toString()
            : "0" + (selectedMonth + 1).toString();
    const year = selectedYear.toString();
    const monthYear = year + "-" + month;
    console.log("default monthyear", monthYear);

    return monthYear;
}
