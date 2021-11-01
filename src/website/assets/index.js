// no skidding

async function read() {
	const countElement = document.getElementById("count");

	let count = 0;
	
	try {
		const countRequest = await fetch("/count");
		const countAnswer = await countRequest.text();
	
		count = countAnswer;
	} catch(e) {
		console.log("Couldn't get count. Error: " + e);
	}

	countElement.textContent = count;
}


async function write() {
	await fetch("/add");
	await read();
}

document.querySelector("img").addEventListener("click", () => {
	write();
})

read();

// real time💯💯
setInterval(read, 5000)