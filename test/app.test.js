const test = require('ava');
const fetch = require("node-fetch");

const HOST = 'http://127.0.0.1:8787';
const RUNS = 100

const fetchJson = (url, options) => fetch(url, options).then((r) => r.json());
const fetchText = (url, options) => fetch(url, options).then((r) => r.text());

test('should return', async (t) => {
	await Promise.all(Array(RUNS).fill(0).map(async () => {
		const res = await fetchText(`${HOST}/increment?key=test`, {
			method: 'GET',
		});
		console.log(res);
	}))
});
