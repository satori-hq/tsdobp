const TIMEOUT_MS = 1000;

export class Object {
	state: DurableObjectState
	data: any
	timeouts: any

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.timeouts = {}
		this.data = {}
		// this.state.blockConcurrencyWhile(async () => {}) // not needed
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request): Promise<Response> {
		const url: URL = new URL(request.url);
		const key: string | null = url.searchParams.get('key')
		if (!key) return new Response("Not found", { status: 404 });

		let value = this.data[key]
		if (!value) {
			value = this.data[key] = await this.state.storage?.get<any>(key) || 0;
		}

		await fetch('https://example.com')

		switch (url.pathname) {
			case "/increment":
				value = ++this.data[key];
				await this.state.storage?.put(key, this.data[key]);
				break;
			case "/decrement":
				value = --this.data[key];
				await this.state.storage?.put(key, this.data[key]);
				break;
			case "/":
				// Just serve the current value. No storage calls needed!
				break;
			default:
				return new Response("Not found", { status: 404 });
		}

		if (this.timeouts[key]) {
			clearTimeout(this.timeouts[key])
		}
		this.timeouts[key] = setTimeout(() => {
			delete this.data[key]
		}, TIMEOUT_MS)
		
		return new Response(value.toString());
	}
}

interface Env { }
