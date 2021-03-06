import * as crc_32 from "crc-32";
import * as fs from "fs";
import { Html5Entities } from "html-entities";

import * as opt from "../../options";

export function asciiOnly(str: string): string {
	return str.replace(/[^\x00-\x7F]/g, "");
}

//based on alex030293's solution https://stackoverflow.com/questions/38485622/delete-folder-containing-files-node-js
export function deleteDirRecursiveSync(path: string) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(file => {
			const curPath = path + "/" + file;

			if (fs.lstatSync(curPath).isDirectory()) { //recurse
				deleteDirRecursiveSync(curPath);
			} else { //delete file
				deleteFileIfExistsSync(curPath);
			}
		});
	}
}

export function deleteFile(path: string) {
	fs.unlink(path, (err) => {
		if (err) {
			console.error("Attempt to delete file failed: " + path + " Error message:");
			console.error(err.message);
		}
	});
}

export function deleteFileIfExists(dir: string) {
	fs.unlink(dir, doNothing);
}

export function deleteFileIfExistsSync(dir: string) {
	try { fs.unlinkSync(dir); } catch(e) {}
}

export function doNothing() {}

export function fileHash(path: string): Promise<number> {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) return reject(err);
			return resolve(crc_32.buf(data));
		});
	});
}

export function looksLikeIpAddress(str: string): boolean {
	// ipv6 matches 3 or more 0-4 digit hexadecimal numbers separated by colons,
	// potentially followed by an IPV4 address
	// ipv4 matches 3 or more 1-3 digit numbers separated by dots
	const ipv6 = /^(\s)*[0-9a-fA-F]{0,4}(:[0-9a-fA-F]{0,4}){2,}([0-9]{1,3}(.[0-9]{1,3}){2,})?(\s)*$/g;
	const ipv4 = /^(\s)*[0-9]{1,3}(.[0-9]{1,3}){2,}(\s)*$/g;
	return str.match(ipv6) !== null || str.match(ipv4) !== null; // there is a match
}

export function mkdirSafelySync(path: string, mode: number) {
	try { fs.mkdirSync(path, mode); } catch(e) {}
}

/**
 * Make a random integer between two numbers
 *
 * @param x The lower-bound, inclusive
 * @param y The upper-bound, exclusive
 */
export function randIntBetween(x: number, y: number): number {
	return x + Math.floor(Math.random() * (y-x));
}

export function randUpTo(n: number) {
	return Math.floor(Math.random() * n);
}

export function reportError(err: any) {
	console.error(err);
	console.trace();
}

export function roundDps(num: number, places: number): number {
	const offset = Math.pow(2, places);
	return Math.round(num * offset) / offset;
}

export function sanitiseFilename(name: string): string {
	const trimmed = name.substr(0, opt.fileNameSizeLimit).trim(); // trim after because the string could be long
	const noUnicode = asciiOnly(trimmed);
	return new Html5Entities().encode(noUnicode);
}

export function sanitiseNickname(nn: string): string {
	const trimmed = nn.trim().substr(0, opt.nicknameSizeLimit); // trim first to have as many chars as possible
	const noUnicode = asciiOnly(trimmed);
	return new Html5Entities().encode(noUnicode);
}

export function secToMinStr(s: number): string {
	const mins = Math.floor(s/60);
	const secs = s % 60;
	return `${mins}m${secs}s`;
}

export function secToTimeStr(s: number): string {
	const hours = Math.floor(s / 3600);
	const secsInHour = s % 3600;
	const mins = Math.floor(secsInHour / 60);
	const secs = s % 60;

	let str;
	str  = hours > 0 ? " " + hours + "h" : "";
	str += mins  > 0 ? " " + mins  + "m" : "";
	str += secs  > 0 ? " " + secs  + "s" : "";

	return str.trim();
}

//based on Hristo's solution that he got from somewhere else https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
export function sizeToReadbleStr(s: number): string {
	if (s > 1000000000) return "~" + Math.ceil(s / 1000000000) + "GB";
	if (s > 1000000)	return "~" + Math.ceil(s / 1000000)	+ "MB";
	if (s > 1000)	   return "~" + Math.ceil(s / 1000000)	+ "kB";
	return s + "B";
}

//assume at most 2 colons
export function timeCodeToSeconds(s: string): number | null {
	const a = s.split(":");
	let t = 0;

	for (let i = 0; i < a.length; i++) {
		t += parseInt(a[i]) * Math.pow(60, a.length - 1 - i);
	}

	if (t === NaN) return null;

	return t;
}

//altered version of https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
export function toShortSizeString(fileSizeInBytes: number): string {
	let i = -1;
	const byteUnits = ["k", "m", " g", " t", "p", "e", "z", "y"];
	do {
		fileSizeInBytes = fileSizeInBytes / 1024;
		i++;
	} while (fileSizeInBytes > 1024);

	return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export function ytDlTimeStrToSec(str: string): number {
	const timeArr = str.split(":");
	let time = 0;

	switch (timeArr.length) {
		case 1:
			time = parseInt(str);
			break;
		case 2:
			time = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
			break;
		case 3:
			time = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]);
			break;
	}

	if (Number.isNaN(time)) {
		throw new Error(`Unable to convert yt-dl time, ${str}, to seconds.`);
	}

	return time;
}
