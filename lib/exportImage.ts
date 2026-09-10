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
    await document.fonts.ready;

    const fontEmbedCSS =
      await getFontEmbedCSS(element);

    const options = {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
      preferredFontFormat: "woff2",
    };

    let dataUrl: string;

    if (type === "png") {
      dataUrl = await toPng(
        element,
        options
      );
    } else {
      dataUrl = await toJpeg(
        element,
        {
          ...options,
          quality: 0.95,
        }
      );
    }

    const response =
      await fetch(dataUrl);

    const blob =
      await response.blob();

    const mimeType =
      type === "png"
        ? "image/png"
        : "image/jpeg";

    const file =
      new File(
        [blob],
        filename,
        {
          type: mimeType,
        }
      );

    // 모바일에서 시스템 공유 기능 우선 사용
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      try {
        await navigator.share({
          files: [file],
        });

        return;
      } catch (error) {
        console.log(
          "공유 기능 사용 실패:",
          error
        );
      }
    }

    // 일반 다운로드 fallback
    const blobUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    setTimeout(() => {
      URL.revokeObjectURL(
        blobUrl
      );
    }, 5000);
  } catch (error) {
    console.error(
      "이미지 저장 실패:",
      error
    );

    alert(
      "이미지 저장 중 오류가 발생했습니다."
    );

    throw error;
  }
}