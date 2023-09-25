export class CacheService {
    public static get(key: string): string | null {
        return localStorage.getItem(key);
    }

    public static getNumber(key: string): number | undefined {
        try {
            return parseFloat(localStorage.getItem(key) as string);
        } catch (e) {
            CacheService.remove(key)
            return undefined;
        }
    }

    public static set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }
}
