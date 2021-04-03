import { SetStorage } from "@/data/protocols/cache/set-storage";

export class LocalStorageAdapter implements SetStorage {
  private readonly localStoragePrefix = "4devs";
  set(key: string, value: any): void {
    localStorage.setItem(`${this.localStoragePrefix}-${key}`, JSON.stringify(value));
    return;
  }
}
