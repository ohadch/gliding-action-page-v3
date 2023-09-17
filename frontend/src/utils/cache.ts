export class CacheService {
    public static get(key: string): string | null {
        return localStorage.getItem(key);
    }

    public static set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }
}