export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			resolve(String(reader.result));
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function downloadTextFile(filename: string, text: string) {
	const blob = new Blob([text], {
		type: "application/json;charset=utf-8",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}
