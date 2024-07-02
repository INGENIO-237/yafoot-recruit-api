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

const now = new Date().toISOString();

export function formatDate(datetime: string) {
  if (datetime.includes("T") && datetime.endsWith("Z")) {
    datetime = datetime.split(".")[0];

    const [date, time] = datetime.split("T");

    datetime = date + " " + time;
  }

  return datetime;
}
