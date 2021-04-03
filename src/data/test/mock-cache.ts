import { SetStorage } from "@/data/protocols/cache";

export class SetStorageSpy implements SetStorage {
  key: string;
  value: any;
  set(key: string, value: any): void {
    this.key = key;
    this.value = value;
    return;
  }
}
