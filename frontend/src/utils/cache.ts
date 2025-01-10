export class CacheService {
    /**
     * Retrieves the value associated with the key.
     * If the TTL has expired, the value will be removed and null will be returned.
     *
     * @param key - The key to retrieve from storage.
     * @returns The value as a string or null if not found or expired.
     */
    public static get(key: string): string | null {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            const parsed = JSON.parse(item);
            if (parsed.expiry && new Date().getTime() > parsed.expiry) {
                CacheService.remove(key); // Remove expired key
                return null;
            }
            return parsed.value;
        } catch (e) {
            // In case the stored data is not in the expected format, return it as plain value.
            console.error(`Failed to parse cache for key: ${key}`);
            return item;
        }
    }

    /**
     * Retrieves a numerical value associated with the key.
     * If the TTL has expired, the value will be removed and undefined will be returned.
     *
     * @param key - The key to retrieve from storage.
     * @returns The value as a number or undefined if not parsable or expired.
     */
    public static getNumber(key: string): number | undefined {
        const value = CacheService.get(key);
        if (value === null) return undefined;

        try {
            return parseFloat(value as string);
        } catch (e) {
            CacheService.remove(key); // Remove invalid data
            console.error(`Failed to parse number from cache for key: ${key}`);
            return undefined;
        }
    }

    /**
     * Retrieves a boolean value associated with the key.
     * If the TTL has expired, the value will be removed and undefined will be returned.
     *
     * @param key - The key to retrieve from storage.
     * @returns The value as a boolean or undefined if not parsable or expired.
     */
    public static getBoolean(key: string): boolean | undefined {
        const value = CacheService.get(key);
        if (value === null) return undefined;

        if (value === "true") return true;
        if (value === "false") return false;

        CacheService.remove(key); // Remove invalid data
        console.error(`Failed to parse boolean from cache for key: ${key}`);
        return undefined;
    }

    /**
     * Stores a value with an optional expiration time.
     *
     * @param key - The key to be set in storage.
     * @param value - The value to be stored as a string.
     * @param ttlMilliseconds - Optional time-to-live in **milliseconds** after which the key will expire.
     */
    public static set(key: string, value: string, ttlMilliseconds?: number): void {
        const item = {
            value,
            expiry: ttlMilliseconds ? new Date().getTime() + ttlMilliseconds : undefined // Calculate expiry (current time + ttlMilliseconds)
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    /**
     * Removes a key and its associated value from storage.
     *
     * @param key - The key to be removed.
     */
    public static remove(key: string): void {
        localStorage.removeItem(key);
    }
}
