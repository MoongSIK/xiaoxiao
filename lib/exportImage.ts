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

    const isIOS =
      /iPad|iPhone|iPod/.test(
        navigator.userAgent
      );

    if (isIOS) {
      const newWindow =
        window.open();

      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <title>${filename}</title>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  background: #000;
                }

                img {
                  display: block;
                  width: 100%;
                  height: auto;
                }
              </style>
            </head>
            <body>
              <img
                src="${dataUrl}"
                alt="${filename}"
              />
            </body>
          </html>
        `);

        newWindow.document.close();
      } else {
        window.location.href =
          dataUrl;
      }

      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
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