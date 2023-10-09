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

    /**
     * Chuyen Date sang timestamp
     * 
     * @param format 
     * @param value 
     * @returns 
     */
    convertDateToUnixTime(format, value) {
        let result = null;
        if(!value) {
            return result;
        }
        if(format == 'DD/MM/YYYY') {
            const dateString = value; // Oct 23
            const dateParts: any = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
            result = Math.floor(dateObject.getTime() / 1000);
        }
        return result;
    }

}