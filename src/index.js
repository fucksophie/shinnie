import fastifyESM from "fastify";
import fastifyStatic from "fastify-static";
import fastifyRateLimit from "fastify-rate-limit";
import path from "path"
import fs from "fs";

const fastify = fastifyESM();
let amount = 0;

fastify.register(fastifyRateLimit, {
	global: false
})

fastify.register(fastifyStatic, {
	root: path.resolve("src/website/assets")
})

fastify.get('/', async (request, reply) => {
  return reply.sendFile("index.html", path.resolve("src/website/"))
})

fastify.get('/count', async (request, reply) => {
	return reply.send(amount);
})

fastify.get('/add', {
	config: {
		rateLimit: {
			max: 100,
			timeWindow: '1 minute'
		}
	}
}, async (request, reply) => {
	amount++;
	return reply.status(201).send("No Content");
})

fastify.listen(8080, "0.0.0.0", () => {
	console.log("Yas!")

	if(!fs.existsSync("count"))
		fs.writeFileSync("count", "0")
	else
		amount = +fs.readFileSync("count");

	// To prevent useless writes and not to crash the app
	// if a lot of people are using it.

	setInterval(() => {
		fs.writeFileSync("count", amount.toString())
	}, 1000)
})
