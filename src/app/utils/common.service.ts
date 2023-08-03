import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CommonService {

    base64ToArrayBuffer(base64): Uint8Array {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

}