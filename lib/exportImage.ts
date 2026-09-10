import {
  getFontEmbedCSS,
  toJpeg,
  toPng,
} from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  try {
    // 현재 페이지의 웹폰트가 완전히 로드될 때까지 대기
    await document.fonts.ready;

    // html-to-image가 현재 요소에서 사용하는 폰트를
    // 미리 추출해서 저장 이미지에 직접 포함
    const fontEmbedCSS = await getFontEmbedCSS(element);

    const options = {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
      preferredFontFormat: "woff2",
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