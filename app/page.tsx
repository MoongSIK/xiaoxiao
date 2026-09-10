"use client";

import { useRef, useState } from "react";

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

      author: "이름",

      profileImage: defaultProfile,

      content:
        "안뇽하세요^^",

      postImage: "",

      liked: false,

      likedBy: "",

      comments: [],
    },
  ],
};

export default function Home() {
  const [project, setProject] =
    useState<FeedProject>(initialProject);

  const [scale, setScale] = useState(0.75);

  const captureRef =
    useRef<HTMLDivElement>(null);

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
    <main className="h-screen overflow-hidden bg-[#f3f4f6]">
      <div className="grid h-full min-h-0 grid-cols-[420px_1fr]">

        <aside className="min-h-0 overflow-hidden border-r border-slate-200 bg-[#f8fafc]">
          <EditorPanel
            project={project}
            onChange={setProject}
          />
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Xiaoxiao Feed Generator
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                왼쪽에서 내용을 수정하면 실시간으로 반영됩니다.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                배율

                <select
                  value={scale}
                  onChange={(e) =>
                    setScale(
                      Number(e.target.value)
                    )
                  }
                  className="rounded-lg border border-slate-300 px-2 py-2"
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
                onClick={() =>
                  exportImage("png")
                }
                className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white"
              >
                PNG 저장
              </button>

              <button
                onClick={() =>
                  exportImage("jpg")
                }
                className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
              >
                JPG 저장
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
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

      </div>
    </main>
  );
}