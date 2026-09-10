import { toJpeg, toPng } from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  try {
    const options = {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",

      // 외부 웹폰트 처리 때문에 html-to-image가 실패하는 것을 방지
      skipFonts: true,
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

    // data URL을 Blob으로 변환
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

    alert(
      "이미지 저장 중 오류가 발생했습니다. 개발자 도구 콘솔을 확인해주세요."
    );

    throw error;
  }
}