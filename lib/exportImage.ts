import { toJpeg, toPng } from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  const options = {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  };

  let dataUrl: string;

  if (type === "png") {
    dataUrl = await toPng(element, options);
  } else {
    dataUrl = await toJpeg(element, {
      ...options,
      quality: 0.95,
    });
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}