"use client";

import { FeedProject, FeedPost } from "@/types/feed";
import { createId } from "@/lib/utils";
import { downloadTextFile } from "@/lib/file";

import PostEditor from "./PostEditor";

type Props = {
  project: FeedProject;
  onChange: (project: FeedProject) => void;
};

function createEmptyPost(): FeedPost {
  return {
    id: createId("post"),
    author: "이름",
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
}: Props) {
  const addPost = () => {
    onChange({
      ...project,
      posts: [...project.posts, createEmptyPost()],
    });
  };

  const updatePost = (
    id: string,
    nextPost: FeedPost
  ) => {
    onChange({
      ...project,
      posts: project.posts.map((post) =>
        post.id === id ? nextPost : post
      ),
    });
  };

  const deletePost = (id: string) => {
    onChange({
      ...project,
      posts: project.posts.filter(
        (post) => post.id !== id
      ),
    });
  };

  const saveJson = () => {
    downloadTextFile(
      "xiaoxiao-project.json",
      JSON.stringify(project, null, 2)
    );
  };

  const loadJson = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as FeedProject;

      onChange(parsed);
    } catch {
      alert("올바른 JSON 파일이 아닙니다.");
    }

    e.target.value = "";
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto p-4 pb-20">
      <div className="flex flex-col gap-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">
            편집 패널
          </h2>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={addPost}
              className="rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white"
            >
              + 게시물 추가
            </button>

            <button
              type="button"
              onClick={saveJson}
              className="rounded-xl bg-slate-100 px-4 py-3 font-semibold"
            >
              JSON 저장
            </button>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                JSON 불러오기
              </label>

              <input
                type="file"
                accept=".json,application/json"
                onChange={loadJson}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {project.posts.map((post, index) => (
          <PostEditor
            key={post.id}
            post={post}
            index={index}
            onChange={(nextPost) =>
              updatePost(post.id, nextPost)
            }
            onDelete={() =>
              deletePost(post.id)
            }
          />
        ))}

      </div>
    </div>
  );
}