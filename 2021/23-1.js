import { load } from "./helpers.js";
import R from "ramda";

const run = (arr) => {
	console.log(arr);
}

load("23.txt")
	.then(run)