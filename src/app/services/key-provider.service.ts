import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyProviderService {

  private readonly keys: KeyInfo[] = [{key: "516499c256cbdf600f3adacb3105be04", isValid: true},
    {key: "b8759137ab1467a92444b104a8e33ad3", isValid: true}];

  /**
   * Gets first valid key or, if all are invalid, first one because most probably rate limit has expired for that one
   */
  getValidKey(): KeyInfo {
    const validKey: KeyInfo | undefined = this.keys.find(k => k.isValid);
    if (!validKey) {
      // mark all keys as valid to avoid marking key as invalid even though rate limit expired (especially for minute)
      this.keys.forEach(k => k.isValid = true);
      return this.keys.at(0) as KeyInfo;
    }
    return validKey;
  }

  updateKey(keyInfo: KeyInfo) {
    const keyIndex = this.keys.findIndex(k => k.key === keyInfo.key);
    this.keys[keyIndex] = keyInfo;
    console.log("updated key to " + keyInfo.isValid);
  }
}

export class KeyInfo {

  key!: string;
  isValid!: boolean;

  constructor(key: string, isValid: boolean) {
    this.key = key;
    this.isValid = isValid;
  }
}
