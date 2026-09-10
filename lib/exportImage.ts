import { toJpeg, toPng } from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  try {
    await document.fonts.ready;

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

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("이미지 저장 실패:", error);

    alert("이미지 저장 중 오류가 발생했습니다.");

    throw error;
  }
}