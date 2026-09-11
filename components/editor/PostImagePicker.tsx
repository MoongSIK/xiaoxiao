"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type Props = {
  darkMode: boolean;
  onChange: (value: string) => void;
};

/*
 * 최종 게시물 이미지
 *
 * 화면 표시: 470 × 335
 * 저장 이미지: 940 × 670
 */
const OUTPUT_WIDTH = 940;
const OUTPUT_HEIGHT = 670;

async function loadImage(
  imageSrc: string
): Promise<HTMLImageElement> {
  const image = new Image();

  image.src = imageSrc;

  await new Promise<void>(
    (resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    }
  );

  return image;
}

/*
 * 사용자가 편집한 영역을
 * 최종 940 × 670 이미지로 생성
 */
async function createCroppedImage(
  imageSrc: string,
  cropPixels: Area
): Promise<string> {
  const image =
    await loadImage(imageSrc);

  const canvas =
    document.createElement("canvas");

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas를 생성할 수 없습니다."
    );
  }

  /*
   * 배경
   */
  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );

  /*
   * Cropper에서 선택한 영역을
   * 최종 게시물 이미지에 출력
   *
   * Cropper 비율과 출력 비율이 같기 때문에
   * 사진이 찌그러지지 않음
   */
  ctx.drawImage(
    image,

    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,

    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );

  return canvas.toDataURL(
    "image/jpeg",
    0.95
  );
}

export default function PostImagePicker({
  darkMode,
  onChange,
}: Props) {
  const [
    imageSrc,
    setImageSrc,
  ] =
    useState<string | null>(
      null
    );

  const [
    fileName,
    setFileName,
  ] =
    useState(
      "선택된 파일 없음"
    );

  /*
   * x: 0 / y: 0
   * = react-easy-crop 기준 중앙
   */
  const [
    crop,
    setCrop,
  ] =
    useState({
      x: 0,
      y: 0,
    });

  const [
    zoom,
    setZoom,
  ] =
    useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] =
    useState<Area | null>(
      null
    );

  /*
   * 새 사진 선택 시
   * Cropper 상태를 완전히 초기화
   */
  const [
    cropperKey,
    setCropperKey,
  ] =
    useState(0);

  /*
   * 파일 선택
   */
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    const reader =
      new FileReader();

    reader.onload = () => {
      setImageSrc(
        String(reader.result)
      );

      /*
       * 항상 중앙 정렬
       */
      setCrop({
        x: 0,
        y: 0,
      });

      /*
       * 기본 확대율
       */
      setZoom(1);

      setCroppedAreaPixels(
        null
      );

      /*
       * 이전 Cropper 상태 제거
       */
      setCropperKey(
        (prev) => prev + 1
      );
    };

    reader.readAsDataURL(file);
  };

  /*
   * Cropper가 계산한 실제 선택 영역
   */
  const handleCropComplete = (
    _: Area,
    croppedPixels: Area
  ) => {
    setCroppedAreaPixels(
      croppedPixels
    );
  };

  /*
   * 적용
   */
  const applyCrop =
    async () => {
      if (
        !imageSrc ||
        !croppedAreaPixels
      ) {
        return;
      }

      try {
        const result =
          await createCroppedImage(
            imageSrc,
            croppedAreaPixels
          );

        onChange(result);

        setImageSrc(null);
      } catch (error) {
        console.error(error);

        alert(
          "게시물 이미지 조정 중 오류가 발생했습니다."
        );
      }
    };

  /*
   * 최종 게시물 이미지와 동일한 비율
   *
   * 940 : 670
   * =
   * 470 : 335
   */
  const cropAspect =
    OUTPUT_WIDTH /
    OUTPUT_HEIGHT;

  return (
    <>
      {/* 게시물 이미지 */}
      <div className="flex flex-col gap-2">

        <label
          className={`text-sm font-semibold ${
            darkMode
              ? "text-[#dddddd]"
              : "text-slate-700"
          }`}
        >
          게시물 이미지
        </label>

        {/* 파일 선택 */}
        <div className="flex min-w-0 items-center gap-3">

          <label
            className={`shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              darkMode
                ? "border-[#505050] bg-[#2a2a2a] text-white"
                : "border-slate-300 bg-white text-slate-800"
            }`}
          >
            파일 선택

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          <span
            className={`min-w-0 truncate text-sm ${
              darkMode
                ? "text-[#bbbbbb]"
                : "text-slate-500"
            }`}
          >
            {fileName}
          </span>

        </div>

      </div>

      {/* 게시물 사진 편집 팝업 */}
      {imageSrc && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">

          <div
            className={`w-full max-w-[720px] rounded-2xl border p-5 shadow-2xl ${
              darkMode
                ? "border-[#484848] bg-[#242424] text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >

            <h2 className="mb-2 text-lg font-bold">
              게시물 사진 조정
            </h2>

            <p
              className={`mb-4 text-sm ${
                darkMode
                  ? "text-[#bbbbbb]"
                  : "text-slate-500"
              }`}
            >
              사진은 처음 중앙에 배치됩니다. 드래그하거나 확대/축소해서 위치를 조정하세요.
            </p>

            {/* 편집 화면 */}
            <div
              className="relative w-full overflow-hidden bg-black"
              style={{
                aspectRatio:
                  `${OUTPUT_WIDTH} / ${OUTPUT_HEIGHT}`,
              }}
            >

              <Cropper
                key={cropperKey}
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropAspect}
                cropShape="rect"
                showGrid={true}
                onCropChange={
                  setCrop
                }
                onZoomChange={
                  setZoom
                }
                onCropComplete={
                  handleCropComplete
                }
              />

            </div>

            {/* 확대 / 축소 */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-semibold">
                  확대 / 축소
                </label>

                <span
                  className={`text-sm ${
                    darkMode
                      ? "text-[#bbbbbb]"
                      : "text-slate-500"
                  }`}
                >
                  {Math.round(
                    zoom * 100
                  )}
                  %
                </span>

              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) =>
                  setZoom(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />

            </div>

            {/* 버튼 */}
            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setImageSrc(null)
                }
                className={`rounded-lg px-4 py-2 font-semibold ${
                  darkMode
                    ? "bg-[#333333] text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                취소
              </button>

              <button
                type="button"
                onClick={applyCrop}
                className={`rounded-lg px-4 py-2 font-semibold ${
                  darkMode
                    ? "bg-[#eeeeee] text-black"
                    : "bg-slate-800 text-white"
                }`}
              >
                적용
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}