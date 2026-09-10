import { toJpeg, toPng } from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  try {
    // SUITE 웹폰트가 완전히 로드될 때까지 기다림
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

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("이미지 저장 실패:", error);
    alert("이미지 저장 중 오류가 발생했습니다.");
    throw error;
  }
}