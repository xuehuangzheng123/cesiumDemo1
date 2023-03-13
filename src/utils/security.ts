import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("66756c656979756e");
const iv = CryptoJS.enc.Utf8.parse("706f7461746f6679");

function dt(text: string) {
	const encryptedHexStr = CryptoJS.enc.Hex.parse(text);
	const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
	const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
	return JSON.parse(decryptedStr.toString());
}

function et(text: string) {
	let word = JSON.stringify(text);
	const srcs = CryptoJS.enc.Utf8.parse(word);
	const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	return encrypted.ciphertext.toString().toUpperCase();
}

let secretKey = "fuleiyun";
// encryptText("Hello,你好") // "U2FsdGVkX1+k7hsrmfutPZhLlia0AhUshTZXRNBYjUw="
function encryptText(cleartext: string) {
	return CryptoJS.AES.encrypt(cleartext, secretKey).toString();
}
// decryptText("U2FsdGVkX1+k7hsrmfutPZhLlia0AhUshTZXRNBYjUw") // "Hello,你好"
function decryptText(ciphertext: string) {
	return CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
}

export { decryptText, dt, encryptText, et };
