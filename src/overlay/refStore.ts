// refStore.ts

type RefStore = {
    [key: string]: React.RefObject<HTMLElement>;
};

const refStore: RefStore = {};

// Function to set a ref
export const setRef = (key: string, ref: React.RefObject<HTMLElement>) => {
    refStore[key] = ref;
};

// Function to get a ref
export const getRef = (key: string): React.RefObject<HTMLElement> | undefined => {
    return refStore[key];
};

export const getAllRefs = () => {
    return refStore;
};

// Optional: Function to clear a ref (not strictly necessary but useful)
export const clearRef = (key: string) => {
    delete refStore[key];
};
