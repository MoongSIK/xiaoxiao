"use client";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  FeedProject,
  FeedPost,
} from "@/types/feed";

import { createId } from "@/lib/utils";
import PostEditor from "./PostEditor";

type Props = {
  project: FeedProject;
  onChange: (
    project: FeedProject
  ) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

function createEmptyPost(): FeedPost {
  return {
    id: createId("post"),
    author: "소휘",

    profileImage:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <rect width="100" height="100" fill="#dbe4ff"/>
          <circle cx="50" cy="35" r="16" fill="#8598e5"/>
          <rect x="25" y="57" width="50" height="24" fill="#8598e5"/>
        </svg>
      `),

    content: "",
    postImage: "",
    liked: false,
    likedBy: "",
    comments: [],
  };
}

export default function EditorPanel({
  project,
  onChange,
  darkMode,
  onToggleDarkMode,
}: Props) {
  const addPost = () => {
    onChange({
      ...project,
      posts: [
        ...project.posts,
        createEmptyPost(),
      ],
    });
  };

  const updatePost = (
    id: string,
    nextPost: FeedPost
  ) => {
    onChange({
      ...project,
      posts: project.posts.map(
        (post) =>
          post.id === id
            ? nextPost
            : post
      ),
    });
  };

  const deletePost = (
    id: string
  ) => {
    onChange({
      ...project,
      posts:
        project.posts.filter(
          (post) =>
            post.id !== id
        ),
    });
  };

  return (
    <div className="p-4 pb-20 xl:h-full xl:min-h-0 xl:overflow-y-auto">

      <div className="flex flex-col gap-4">

        {/* 편집 패널 상단 */}
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            darkMode
              ? "border-[#3a3a3a] bg-[#222222]"
              : "border-slate-200 bg-white"
          }`}
        >

          <div className="mb-4 flex items-center justify-between">

            <h2
              className={`text-lg font-bold ${
                darkMode
                  ? "text-white"
                  : "text-slate-800"
              }`}
            >
              편집 패널
            </h2>

            <button
              type="button"
              onClick={
                onToggleDarkMode
              }
              aria-label={
                darkMode
                  ? "라이트 모드"
                  : "다크 모드"
              }
              className={`flex h-[38px] w-[38px] items-center justify-center rounded-lg border ${
                darkMode
                  ? "border-[#555555] bg-[#303030] text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

          </div>

          <button
            type="button"
            onClick={addPost}
            className={`w-full rounded-xl px-4 py-3 font-semibold ${
              darkMode
                ? "bg-[#eeeeee] text-black"
                : "bg-slate-800 text-white"
            }`}
          >
            + 게시물 추가
          </button>

        </div>

        {/* 게시물 편집 */}
        {project.posts.map(
          (post, index) => (
            <PostEditor
              key={post.id}
              post={post}
              index={index}
              darkMode={darkMode}
              onChange={(
                nextPost
              ) =>
                updatePost(
                  post.id,
                  nextPost
                )
              }
              onDelete={() =>
                deletePost(
                  post.id
                )
              }
            />
          )
        )}

      </div>
    </div>
  );
}