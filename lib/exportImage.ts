import {
  getFontEmbedCSS,
  toJpeg,
  toPng,
} from "html-to-image";

async function waitForImages(
  element: HTMLElement
) {
  const images = Array.from(
    element.querySelectorAll<HTMLImageElement>(
      "img"
    )
  );

  await Promise.all(
    images.map(async (img) => {
      if (!img.src) {
        return;
      }

      if (!img.complete) {
        await new Promise<void>(
          (resolve) => {
            const finish = () => {
              img.removeEventListener(
                "load",
                finish
              );

              img.removeEventListener(
                "error",
                finish
              );

              resolve();
            };

            img.addEventListener(
              "load",
              finish
            );

            img.addEventListener(
              "error",
              finish
            );
          }
        );
      }

      try {
        if (
          typeof img.decode ===
          "function"
        ) {
          await img.decode();
        }
      } catch {
        // 이미지 decode 실패 시에도 계속 진행
      }
    })
  );
}

async function waitForPaint() {
  await new Promise<void>(
    (resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }
  );
}

/**
 * 모바일 기기 여부 확인
 */
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
}

/**
 * 일반 다운로드 fallback
 */
function downloadBlob(
  blob: Blob,
  filename: string
) {
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
}

/**
 * PC에서 파일 저장 위치 선택
 */
async function saveFileOnDesktop(
  blob: Blob,
  filename: string,
  mimeType: string,
  extension: ".png" | ".jpg"
) {
  const windowWithPicker =
    window as typeof window & {
      showSaveFilePicker?: (
        options?: {
          suggestedName?: string;
          types?: {
            description?: string;
            accept: Record<
              string,
              string[]
            >;
          }[];
        }
      ) => Promise<{
        createWritable: () => Promise<{
          write: (
            data: Blob
          ) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    };

  if (
    !windowWithPicker.showSaveFilePicker
  ) {
    return false;
  }

  try {
    const fileHandle =
      await windowWithPicker.showSaveFilePicker(
        {
          suggestedName:
            filename,

          types: [
            {
              description:
                extension ===
                ".png"
                  ? "PNG 이미지"
                  : "JPEG 이미지",

              accept: {
                [mimeType]: [
                  extension,
                ],
              },
            },
          ],
        }
      );

    const writable =
      await fileHandle.createWritable();

    await writable.write(
      blob
    );

    await writable.close();

    return true;
  } catch (error) {
    // 사용자가 저장 창에서 취소한 경우
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return true;
    }

    console.error(
      "파일 저장 선택창 오류:",
      error
    );

    return false;
  }
}

export async function exportElementAsImage(
  element: HTMLElement,
  type: "png" | "jpg",
  filename: string
) {
  try {
    /*
     * 1. 폰트 로딩 완료 대기
     */
    await document.fonts.ready;

    /*
     * 2. 이미지 로딩 완료 대기
     */
    await waitForImages(
      element
    );

    /*
     * 3. 브라우저 paint 완료 대기
     */
    await waitForPaint();

    /*
     * 4. 폰트 CSS 가져오기
     */
    const fontEmbedCSS =
      await getFontEmbedCSS(
        element
      );

    /*
     * 5. html-to-image 옵션
     */
    const options = {
      pixelRatio: 2,

      backgroundColor:
        "#ffffff",

      fontEmbedCSS,

      preferredFontFormat:
        "woff2" as const,

      cacheBust: false,

      width:
        element.scrollWidth,

      height:
        element.scrollHeight,

      style: {
        transform: "none",
      },
    };

    /*
     * 6. 이미지 생성
     */
    let dataUrl: string;

    if (type === "png") {
      dataUrl = await toPng(
        element,
        options
      );
    } else {
      dataUrl =
        await toJpeg(
          element,
          {
            ...options,
            quality: 0.95,
          }
        );
    }

    /*
     * 7. Data URL → Blob
     */
    const response =
      await fetch(dataUrl);

    const blob =
      await response.blob();

    /*
     * 8. 파일 형식
     */
    const mimeType =
      type === "png"
        ? "image/png"
        : "image/jpeg";

    const extension =
      type === "png"
        ? ".png"
        : ".jpg";

    /*
     * 9. File 객체 생성
     */
    const file =
      new File(
        [blob],
        filename,
        {
          type: mimeType,
        }
      );

    /*
     * =========================
     * 모바일
     * =========================
     */
    if (
      isMobileDevice()
    ) {
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
            title:
              filename,
          });

          return;
        } catch (error) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "모바일 공유 실패:",
            error
          );
        }
      }

      /*
       * 모바일 공유를 지원하지 않는 브라우저
       */
      downloadBlob(
        blob,
        filename
      );

      return;
    }

    /*
     * =========================
     * PC
     * =========================
     */

    /*
     * Chrome / Edge 등에서는
     * 파일 저장 위치 선택창 표시
     */
    const saved =
      await saveFileOnDesktop(
        blob,
        filename,
        mimeType,
        extension
      );

    if (saved) {
      return;
    }

    /*
     * 저장 위치 선택 API를 지원하지 않는
     * PC 브라우저의 fallback
     */
    downloadBlob(
      blob,
      filename
    );
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