import { load } from "./helpers.js";
import R from 'ramda';

const hexToBit = {
	"0" : "0000",
	"1" : "0001",
	"2" : "0010",
	"3" : "0011",
	"4" : "0100",
	"5" : "0101",
	"6" : "0110",
	"7" : "0111",
	"8" : "1000",
	"9" : "1001",
	"A" : "1010",
	"B" : "1011",
	"C" : "1100",
	"D" : "1101",
	"E" : "1110",
	"F" : "1111",
}

const parse = hex => {
	let out = "";
	for (const char of hex) {
		out += hexToBit[char];
	}
	return out;
}

// packet
// {
// 	version: 
// 	typeID:
// 	literVal: 
// 	packets: []
// }

const readPacket = (bin, i) => {
	const packet = {};
	const version = parseInt(bin.substring(i, i+3), 2);
	const typeID = parseInt(bin.substring(i+3, i+6), 2);
	packet.version = version;
	packet.typeID = typeID;
	i += 6;
	if (typeID === 4) {
		let val = "";
		while (bin[i] === "1") {
			val += bin.substring(i+1,i+5);
			i += 5;
		}
		val += bin.substring(i+1,i+5);
		i += 5;
		packet.value = parseInt(val, 2);

		return {packet, i}
	} else {
		const lengthType = bin.substring(i, i+1);
		packet.lengthType = lengthType
		if (lengthType === '0') {
			const numBits = parseInt(bin.substring(i+1,i+16), 2);
			packet.length = numBits;
			packet.packets = read(bin.substring(i+16,i+16+numBits), 1+16)
			i = i + 16 + numBits
		} else {
			const numPackets = parseInt(bin.substring(i+1,i+12), 2);
			packet.length = numPackets;
			const subPackets = [];
			let read = 0;
			i += 12
			while (read < numPackets - 4) {
				const res = readPacket(bin, i)
				subPackets.push(res.packet)
				i = res.i;
				read++;
			}
			packet.packets = subPackets
		}
		return {packet, i}
	}
}

// bin_str -> []packet
const read = (binary) => {
	const packets = [];
	let i = 0;
	while (i < binary.length - 7) {
		const res = readPacket(binary, i);
		packets.push(res.packet)
		i = res.i;
	}
	return packets;
}

const sum = packets => {
	let s = 0;
	for (const p of packets || []) {
		s += p.version || 0;
		s += sum(p.packets)
	}
	return s
}

const run = (arr) => {
	console.log(arr);
	for (const el of arr) {
		const hex = el;
		const bin = parse(hex);
		const packets = read(bin, 0);

		console.log(sum(packets))
	}
}

load("16.txt")
	.then(run)