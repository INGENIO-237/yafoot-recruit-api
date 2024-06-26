import { ALPHABETS } from "./constants/common";

export function generateRandomNumber(limit: number = 2) {
  let factor = 10;

  for (let i = 1; i < limit; i++) factor *= 10;

  return Math.floor(Math.random() * factor);
}

export function getRandomString(length: number = 1) {
  let str = "";

  for (let i = 1; i <= length; i++) {
    const index = generateRandomNumber(1);
    const char = ALPHABETS[index];

    str += char;
  }

  return str;
}

export function generatePublicId() {
  return "YA-" + getRandomString() + generateRandomNumber() + getRandomString();
}
