"use client";

type Props = {
  label: string;
  darkMode: boolean;
  onChange: (
    value: string
  ) => void;
};

export default function FilePicker({
  label,
  darkMode,
  onChange,
}: Props) {
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      onChange(
        String(
          reader.result
        )
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  return (
    <div>

      <label
        className={`mb-1 block text-sm font-semibold ${
          darkMode
            ? "text-[#dddddd]"
            : "text-slate-700"
        }`}
      >
        {label}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={
          handleFile
        }
        className={`w-full rounded-lg border px-3 py-2 text-sm ${
          darkMode
            ? "border-[#505050] bg-[#2a2a2a] text-white"
            : "border-slate-300 bg-white text-slate-800"
        }`}
      />

    </div>
  );
}