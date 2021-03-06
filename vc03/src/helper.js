import { countBy } from "lodash";

export const splitDataIntoRows = (data) => data.split("\n");

export const splitRowsIntoItems = (data) => data.split("\t");

export const matchItems = (data, header) => {
  const tmp = {};

  header.forEach((item, idx) => {
    tmp[item] = data[idx];
  });

  return tmp;
};

export const jsonfy = (cars) => {
  let header = splitRowsIntoItems(cars.shift());

  let temp = [];

  cars.forEach((car) => {
    const items = splitRowsIntoItems(car);

    temp.push(matchItems(items, header));
  });

  return {
    data: temp,
    header,
  };
};

export const countableItems = [
  "Herkunft",
  "Hersteller",
  "Zylinder",
  "PS",
  "Baujahr",
];

export const selectableItems = [
  "Zylinder",
  "PS",
  "Baujahr",
  "Beschleunigung",
  "Gewicht",
  "Hubraum",
  "Verbrauch",
];

export const countItems = (cars, by = "Herkunft") => {
  let items = [];

  cars.forEach((item) => {
    items.push(item[by]);
  });

  let data = countBy(items);

  return Object.keys(data).map((i) => ({ item: i, count: data[i] }));
};

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
export const round = (value) =>  Math.round((value + Number.EPSILON) * 100) / 100
