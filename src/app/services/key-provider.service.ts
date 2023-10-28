import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyProviderService {

  // invalid keys: 2b1404d1ca10c9f47715c89318432cad 0700862f2c8329dd671a20b8c96e58bb a0efa8d3ccc54bd4d678b69fd4e67480
  //
  private readonly keys: KeyInfo[] = [{key: "516499c256cbdf600f3adacb3105be04", isValid: true}];

  /**
   * Gets first valid key or, if all are invalid, first one because most probably rate limit has expired for that one
   */
  getValidKey(): KeyInfo {
    console.log("getting another valid key");
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
