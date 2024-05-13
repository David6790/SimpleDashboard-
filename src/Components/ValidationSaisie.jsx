// ValidationSaisie.jsx
import { format, isAfter, parse } from "date-fns";

export function validateEmail(email) {
  const re =
    // eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateNumberOfPeople(number) {
  const num = parseInt(number, 10);
  return Number.isInteger(num) && num > 0; // Valide si c'est un entier positif et non nul
}

export function validateDate(date) {
  const currentDate = new Date();
  const selectedDate = parse(date, "yyyy-MM-dd", new Date());
  return (
    format(selectedDate, "yyyy-MM-dd") === date &&
    (isAfter(selectedDate, currentDate) ||
      format(selectedDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"))
  );
}
