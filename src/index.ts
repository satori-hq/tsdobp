import isOdd from 'is-odd'

// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { Object } from './object'

export default {
	async fetch(request: Request, env: Env) {
		try {
			return await handleRequest(request, env)
		} catch (e) {
			return new Response(`${e}`)
		}
	},
}

async function handleRequest(request: Request, env: Env) {
	let id = env.OBJECT.idFromName('A')
	let obj = env.OBJECT.get(id)

	return await obj.fetch(request.url)
}

interface Env {
	OBJECT: DurableObjectNamespace
}
