declare module global {
    interface String {
        replaceArray(find: Array<string>, replace: Array<string>): string;
    }
}