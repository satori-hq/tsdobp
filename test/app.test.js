const test = require('ava');
const fetch = require("node-fetch");

const HOST = 'http://127.0.0.1:8787';
const RUNS = 100

const fetchJson = (url, options) => fetch(url, options).then((r) => r.json());
const fetchText = (url, options) => fetch(url, options).then((r) => r.text());

test('should return', async (t) => {
	let first, last
	await Promise.all(Array(RUNS).fill(0).map(async (_, i) => {
		const res = await fetchText(`${HOST}/increment?key=test`, {
			method: 'GET',
		});
		const num = parseInt(res)
		if (num % 100 === 1) first = parseInt(res)
		if (num % 100 === 0) last = parseInt(res)
	}))

	t.is(last - first, 99)
});
