const check = (n) => {
  // console.log("checking: ", n);
  const digits = (''+n).split('').map(Number);
  // console.log(digits);
  let prev = -1;
  let double = false;
  for (const i of digits.keys()) {
    const d = digits[i];
    if (d < prev) return false;
    if (d === prev &&
      ((i == digits.length - 1 && (i <= 1 || d !== digits[i-2]))
       || (i !== digits.length - 1 && d !== digits[i + 1] && d !== digits[i - 2]))) {
      // console.log(i, d);
      double = true;
    }
    prev = d;
  }

  return double;
}
let tot = 0;
for (let i = 136818; i <= 685979; i++) {
  if (check(i)) tot += 1;
}

console.log(tot);