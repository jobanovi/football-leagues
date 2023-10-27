import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyProvider {

  private readonly keys: KeyInfo[] = [{key: "a0efa8d3ccc54bd4d678b69fd4e67480", isValid: true},
    {key: "0700862f2c8329dd671a20b8c96e58bb", isValid: true}]; // todo key

  /**
   * Gets first valid key or, if all are invalid, first one
   */
  getValidKey(): KeyInfo {
    console.log("getting another valid key");
    const validKey: KeyInfo | undefined = this.keys.find(k => k.isValid);
    return validKey ? validKey : this.keys.at(0) as KeyInfo;
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
