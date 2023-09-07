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

    resizeImage(image) {
        return new Promise((resolve) => {
            let fr = new FileReader;
            fr.onload = () => {
                var img = new Image();
                img.onload = () => {
                    console.log(img.width);
                    let width = img.width < 900 ? img.width : 900;
                    let height = img.width < 900 ? img.height : width * img.height / img.width;
                    console.log(width, height);
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext('2d');
                    if (ctx != null) {
                        ctx.drawImage(img, 0, 0, width, height);
                    }
                    let data = canvas.toDataURL('image/png');
                    resolve(data);
                };

                // @ts-ignore
                img.src = fr.result;
            };

            fr.readAsDataURL(image);
        })
    }

}