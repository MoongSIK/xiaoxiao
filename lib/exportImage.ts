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

    const userAgent = navigator.userAgent;

    const isAndroid =
      /Android/i.test(userAgent);

    // Android 인앱 브라우저에서
    // async 작업 후 window.open이 차단되는 것을 방지
    let androidWindow: Window | null = null;

    if (isAndroid) {
      androidWindow = window.open("", "_blank");
    }

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

    // 1. 공유 기능을 지원하는 모바일 브라우저
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      // 미리 열어둔 Android 창은 필요 없으므로 닫기
      if (androidWindow) {
        androidWindow.close();
      }

      try {
        await navigator.share({
          files: [file],
        });

        return;
      } catch (error) {
        console.log(
          "파일 공유 실패:",
          error
        );
      }
    }

    // 2. Android 인앱 브라우저 fallback
    if (isAndroid) {
      const blobUrl =
        URL.createObjectURL(blob);

      if (androidWindow) {
        androidWindow.location.href =
          blobUrl;
      } else {
        window.location.href =
          blobUrl;
      }

      // 바로 revoke 하면 이미지가 안 열릴 수 있으므로
      // 충분히 기다린 뒤 해제
      setTimeout(() => {
        URL.revokeObjectURL(
          blobUrl
        );
      }, 60000);

      return;
    }

    // 3. PC 등 일반 브라우저 다운로드
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
    }, 1000);
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