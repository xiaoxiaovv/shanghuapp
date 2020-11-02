export function getStorage (key) {
	return new Promise((resolve) => {
		uni.getStorage({
			key,
			success (res) {
				resolve(res.data)
			},
			fail () {
				resolve('')
			}
		});
	})
}

export function setStorage (key, data) {
	return new Promise((resolve) => {
		uni.setStorage({
			key,
			data,
			complete () {
				resolve()
			}
		});
	})
}