import { SetStorage } from "@/data/protocols/cache";

export class LocalStorageAdapter implements SetStorage {
  private readonly localStoragePrefix = "4devs";
  set(key: string, value: Record<string, unknown>): void {
    localStorage.setItem(`${this.localStoragePrefix}-${key}`, JSON.stringify(value));
    return;
  }
}
