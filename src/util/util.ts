export const timedDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetch = (mockData: any): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 1000); // Wait for 1 second
    });
};
