const url = new URL(process.env.ANVIL_RPC || 'http://anvil:8545');

export async function anvilMine(numBlocks: number = 1, interval?: number) {
    await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "anvil_mine",
            params: [ numBlocks, interval ]
        })
	}).then(res => {
		if (!res.ok) throw new Error("anvil_mine failed")
	})
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}