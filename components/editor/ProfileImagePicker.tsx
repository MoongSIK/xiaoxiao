"use client";

import { useState } from "react";

import Cropper, {
  Area,
} from "react-easy-crop";

type Props = {
  darkMode: boolean;
  onChange: (
    value: string
  ) => void;
};

async function createCroppedImage(
  imageSrc: string,
  cropPixels: Area
): Promise<string> {
  const image =
    new Image();

  image.src =
    imageSrc;

  await new Promise<void>(
    (resolve, reject) => {
      image.onload =
        () => resolve();

      image.onerror =
        reject;
    }
  );

  const canvas =
    document.createElement(
      "canvas"
    );

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    throw new Error(
      "Canvas를 생성할 수 없습니다."
    );
  }

  canvas.width =
    cropPixels.width;

  canvas.height =
    cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return canvas.toDataURL(
    "image/png"
  );
}

export default function ProfileImagePicker({
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

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] =
    useState<Area | null>(
      null
    );

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setFileName(
      file.name
    );

    const reader =
      new FileReader();

    reader.onload = () => {
      setImageSrc(
        String(
          reader.result
        )
      );

      setCrop({
        x: 0,
        y: 0,
      });

      setZoom(1);

      setCroppedAreaPixels(
        null
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  const handleCropComplete = (
    _: Area,
    croppedPixels: Area
  ) => {
    setCroppedAreaPixels(
      croppedPixels
    );
  };

  const applyCrop =
    async () => {
      if (
        !imageSrc ||
        !croppedAreaPixels
      ) {
        return;
      }

      try {
        const croppedImage =
          await createCroppedImage(
            imageSrc,
            croppedAreaPixels
          );

        onChange(
          croppedImage
        );

        setImageSrc(
          null
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          "이미지 조정 중 오류가 발생했습니다."
        );
      }
    };

  return (
    <>
      <div className="flex flex-col gap-2">

        <label
          className={`text-sm font-semibold ${
            darkMode
              ? "text-[#dddddd]"
              : "text-slate-700"
          }`}
        >
          프로필 이미지
        </label>

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
              onChange={
                handleFile
              }
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

      {/* 프로필 사진 조정 팝업 */}
      {imageSrc && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">

          <div
            className={`w-full max-w-[620px] rounded-2xl border p-5 shadow-2xl ${
              darkMode
                ? "border-[#484848] bg-[#242424] text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <h2 className="mb-2 text-lg font-bold">
              프로필 사진 조정
            </h2>

            <p
              className={`mb-4 text-sm ${
                darkMode
                  ? "text-[#bbbbbb]"
                  : "text-slate-500"
              }`}
            >
              사진을 드래그해서 위치를 조정하고 확대하거나 축소하세요.
            </p>

            {/* 크롭 화면 */}
            <div className="relative h-[420px] overflow-hidden bg-black">

              <Cropper
                image={
                  imageSrc
                }
                crop={
                  crop
                }
                zoom={
                  zoom
                }
                aspect={1}
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
                value={
                  zoom
                }
                onChange={(
                  e
                ) =>
                  setZoom(
                    Number(
                      e.target
                        .value
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
                  setImageSrc(
                    null
                  )
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
                onClick={
                  applyCrop
                }
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