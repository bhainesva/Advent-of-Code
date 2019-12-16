import R from 'ramda';
import { promises as fs, stat } from 'fs';

const parseFile = R.compose(
  R.map(R.split('')),
  R.map(R.trim),
  R.split('\n'),
  R.trim,
  String
);

const run = async () => {
  let input = await fs.readFile('/Users/bhaines/Downloads/input.txt');

  // input = `.#..##.###...#######
  // ##.############..##.
  // .#.######.########.#
  // .###.#######.####.#.
  // #####.##.#.##.###.##
  // ..#####..#.#########
  // ####################
  // #.####....###.#.#.##
  // ##.#################
  // #####.##.###..####..
  // ..######..##.#######
  // ####.##.####...##..#
  // .#####..#.######.###
  // ##...#.##########...
  // #.##########.#######
  // .####.#.###.###.#.##
  // ....##.##.###..#####
  // .#.#.###########.###
  // #.#.#.#####.####.###
  // ###.##.####.##.#..##`

//   input = `
// .#....#####...#..
// ##...##.#####..##
// ##...#...#.#####.
// ..#.....X...###..
// ..#.#.....#....##`;

  const parsed = parseFile(input);

  const asteroids = [];
  for (const y of [...Array(parsed.length).keys()])  {
    for (const x of [...Array(parsed[0].length).keys()])  {
      if (parsed[y][x] == '#') {
        asteroids.push([x + 0.5, y + 0.5])
      }
    }
  }

  // console.log("found: ", asteroids.length, "asteroids");
  // console.log(asteroids);

  let mostSeen = 0;
  let bestAss = null;
  // for (const as of asteroids) {
    const as = [13.5, 17.5];
    const slopes = new Set();
    const m = {};
    const b = {};
    for (const otherAs of asteroids) {
      if (otherAs[0] == as[0] && otherAs[1] == as[1]) continue;

      let slope = ((otherAs[0] - as[0]) / (otherAs[1] - as[1]));
      // if (as[0] < otherAs[0] || (as[0] == otherAs[0] && as[1] < otherAs[1])) {
      if ((as[0] == otherAs[0] && as[1] > otherAs[1]) || (as[1] > otherAs[1] && as[0] < otherAs[0])) {
        slope = slope + ':1';
      } else if ((as[1] == otherAs[1] && as[0] < otherAs[0]) || (as[1] < otherAs[1] && as[0] < otherAs[0])) {
        slope = slope + ':2';
      } else if ((as[0] == otherAs[0] && as[1] < otherAs[1]) || (as[1] < otherAs[1] && as[0] > otherAs[0])) {
        slope = slope + ':3';
      } else {
        slope = slope + ':4';
      }
      m[otherAs.toString()] = slope;
      b[slope] = (b[slope] ? b[slope].concat([otherAs]) : [otherAs]);

      slopes.add(slope);
    }

    // console.log(m)
    // console.log(b)
    // console.log(as, ":", slopes.size);
    if (slopes.size > mostSeen) {
      mostSeen = slopes.size;
      bestAss = as;
    }
  // }
  console.log(mostSeen);
  console.log(bestAss);

    const keys = Object.keys(b);
    keys.sort((a, b) => {
      if (a[a.length - 1] != b[b.length-1]) {
        return Number(a[a.length-1]) - Number(b[b.length-1]);
      } else {
        return  Number(b.substring(0, b.length - 2)) - Number(a.substring(0, a.length-2));
      }
    })

    let c = 0;
    let i = 0;
    let delOrder = [];
    while (c < 200) {
      let curS = keys[i];
      if (b[curS].length) {
        let minas = null;
        let mindist = -1;
        let mini = 0;
        for (const [i, bs] of b[curS].entries()) {
          if (mindist == - 1 || dist(as, bs) < mindist) {
            minas = bs;
            mindist = dist(as, bs);
            mini = i;
          }
        }

        b[curS].splice(mini, 1);
        delOrder.push(minas);
        c += 1
        console.log(c,": ", minas);
      }
      i+= 1;
      if (i == keys.length) {
        i = 0;
      }
    }
    for (const [i, d] of delOrder.entries()) {
      parsed[d[1] - 0.5][d[0] - 0.5] = i
      // parsed[d[1] - 0.5][d[0] - 0.5] = m[d.toString()].split(":")[1]
    }
    console.log("input:\n" + parsed.map(x => x.map(y => String(y).padStart(3, '0')).join('|')).join('\n'));

    console.log("sroted keys: ", keys);

}

const dist = (as, bs) => {
  return Math.abs(as[0] - bs[0]) + Math.abs(as[1] - bs[1]);
}

run();