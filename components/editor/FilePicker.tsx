"use client";

import { readFileAsDataUrl } from "@/lib/file";

type Props = {
	label: string;
	onChange: (value: string) => void;
};

export default function FilePicker({ label, onChange }: Props) {
	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const dataUrl = await readFileAsDataUrl(file);

		onChange(dataUrl);
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm font-semibold text-slate-700">{label}</label>

			<input
				type="file"
				accept="image/*"
				onChange={handleFile}
				className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
			/>
		</div>
	);
}
