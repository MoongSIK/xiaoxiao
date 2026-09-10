"use client";

import { useEffect, useRef, useState } from "react";

import EditorPanel from "@/components/editor/EditorPanel";
import FeedCanvas from "@/components/preview/FeedCanvas";
import { FeedProject } from "@/types/feed";
import { exportElementAsImage } from "@/lib/exportImage";

const defaultProfile =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#dbe4ff"/>
      <circle cx="50" cy="35" r="16" fill="#8598e5"/>
      <rect x="25" y="57" width="50" height="24" fill="#8598e5"/>
    </svg>
  `);

const initialProject: FeedProject = {
  title: "",
  posts: [
    {
      id: "post-1",
      author: "멍이",
      profileImage: defaultProfile,
      content: "안녕하세요^^",
      postImage: "",
      liked: true,
      likedBy: "냥이, 숭이",
      comments: [
        {
          id: "comment-1",
          author: "냥이",
          content: "안냐세요",
          isReply: false,
          replyTo: "",
        },
        {
          id: "comment-2",
          author: "멍이",
          content: "네 안냐세용",
          isReply: true,
          replyTo: "냥이",
        },
      ],
    },
  ],
};

export default function Home() {
  const [project, setProject] =
    useState<FeedProject>(initialProject);

  const [scale, setScale] =
    useState(0.75);

  const [darkMode, setDarkMode] =
    useState(false);

  const captureRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "xiaoxiao-theme"
      );

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;

      localStorage.setItem(
        "xiaoxiao-theme",
        next ? "dark" : "light"
      );

      return next;
    });
  };

  const exportImage = async (
    type: "png" | "jpg"
  ) => {
    if (!captureRef.current) return;

    try {
      await exportElementAsImage(
        captureRef.current,
        type,
        type === "png"
          ? "xiaoxiao-feed.png"
          : "xiaoxiao-feed.jpg"
      );
    } catch (error) {
      console.error(error);

      alert(
        "이미지 생성 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <main
      className={`min-h-screen xl:h-screen xl:overflow-hidden ${
        darkMode
          ? "bg-[#181818]"
          : "bg-[#f3f4f6]"
      }`}
    >
      <div className="flex min-h-screen flex-col xl:grid xl:h-full xl:min-h-0 xl:grid-cols-[420px_1fr]">

        {/* 미리보기 영역 */}
        <section className="order-1 flex min-w-0 flex-col xl:order-2 xl:min-h-0">

          {/* 상단 메뉴 */}
          <header
            className={`border-b px-4 py-4 sm:px-6 ${
              darkMode
                ? "border-[#3a3a3a] bg-[#202020]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h1
                  className={`text-xl font-bold ${
                    darkMode
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  Xiaoxiao Feed Generator
                </h1>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-[#aaaaaa]"
                      : "text-slate-500"
                  }`}
                >
                  내용을 수정하면 실시간으로 반영됩니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                <label
                  className={`flex items-center gap-2 text-sm ${
                    darkMode
                      ? "text-[#dddddd]"
                      : "text-slate-700"
                  }`}
                >
                  배율

                  <select
                    value={scale}
                    onChange={(e) =>
                      setScale(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className={`rounded-lg border px-2 py-2 ${
                      darkMode
                        ? "border-[#505050] bg-[#2a2a2a] text-white"
                        : "border-slate-300 bg-white text-slate-800"
                    }`}
                  >
                    <option value={0.5}>
                      50%
                    </option>

                    <option value={0.6}>
                      60%
                    </option>

                    <option value={0.75}>
                      75%
                    </option>

                    <option value={0.9}>
                      90%
                    </option>

                    <option value={1}>
                      100%
                    </option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    exportImage("png")
                  }
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold sm:px-4 ${
                    darkMode
                      ? "bg-[#eeeeee] text-black"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  PNG 저장
                </button>

                <button
                  type="button"
                  onClick={() =>
                    exportImage("jpg")
                  }
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold sm:px-4 ${
                    darkMode
                      ? "bg-[#353535] text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  JPG 저장
                </button>

              </div>
            </div>
          </header>

          {/* 미리보기 */}
          <div
            className={`overflow-auto px-2 py-6 sm:p-8 xl:flex-1 ${
              darkMode
                ? "bg-[#181818]"
                : "bg-[#f3f4f6]"
            }`}
          >
            <div className="flex justify-center">
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin:
                    "top center",
                }}
              >
                <FeedCanvas
                  project={project}
                  captureRef={captureRef}
                />
              </div>
            </div>
          </div>

        </section>

        {/* 편집 패널 */}
        <aside
          className={`order-2 border-t xl:order-1 xl:min-h-0 xl:overflow-hidden xl:border-r xl:border-t-0 ${
            darkMode
              ? "border-[#3a3a3a] bg-[#181818]"
              : "border-slate-200 bg-[#f8fafc]"
          }`}
        >
          <EditorPanel
            project={project}
            onChange={setProject}
            darkMode={darkMode}
            onToggleDarkMode={
              toggleDarkMode
            }
          />
        </aside>

      </div>
    </main>
  );
}