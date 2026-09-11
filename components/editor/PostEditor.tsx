"use client";

import {
  FeedComment,
  FeedPost,
} from "@/types/feed";

import { createId } from "@/lib/utils";

import CommentEditor from "./CommentEditor";
import PostImagePicker from "./PostImagePicker";
import ProfileImagePicker from "./ProfileImagePicker";

type Props = {
  post: FeedPost;
  index: number;
  darkMode: boolean;
  onChange: (
    post: FeedPost
  ) => void;
  onDelete: () => void;
};

export default function PostEditor({
  post,
  index,
  darkMode,
  onChange,
  onDelete,
}: Props) {
  const addComment = () => {
    const newComment: FeedComment = {
      id: createId("comment"),
      author: "",
      content: "",
      isReply: false,
      replyTo: "",
    };

    onChange({
      ...post,
      comments: [
        ...post.comments,
        newComment,
      ],
    });
  };

  const updateComment = (
    id: string,
    nextComment: FeedComment
  ) => {
    onChange({
      ...post,
      comments:
        post.comments.map(
          (comment) =>
            comment.id === id
              ? nextComment
              : comment
        ),
    });
  };

  const deleteComment = (
    id: string
  ) => {
    onChange({
      ...post,
      comments:
        post.comments.filter(
          (comment) =>
            comment.id !== id
        ),
    });
  };

  const labelClass =
    darkMode
      ? "text-[#dddddd]"
      : "text-slate-700";

  const inputClass =
    darkMode
      ? "border-[#505050] bg-[#2a2a2a] text-white placeholder:text-[#888888]"
      : "border-slate-300 bg-white text-slate-900";

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? "border-[#3a3a3a] bg-[#222222]"
          : "border-slate-200 bg-white"
      }`}
    >

      {/* 상단 */}
      <div className="mb-4 flex items-center justify-between">

        <h3
          className={`font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-800"
          }`}
        >
          게시물 {index + 1}
        </h3>

        <button
          type="button"
          onClick={onDelete}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            darkMode
              ? "bg-[#3a2020] text-red-300"
              : "bg-red-50 text-red-600"
          }`}
        >
          게시물 삭제
        </button>

      </div>

      <div className="flex flex-col gap-4">

        {/* 프로필 이미지 */}
        <ProfileImagePicker
          darkMode={
            darkMode
          }
          onChange={(value) =>
            onChange({
              ...post,
              profileImage:
                value,
            })
          }
        />

        {/* 작성자 */}
        <div>

          <label
            className={`mb-1 block text-sm font-semibold ${labelClass}`}
          >
            작성자
          </label>

          <input
            value={
              post.author
            }
            onChange={(e) =>
              onChange({
                ...post,
                author:
                  e.target.value,
              })
            }
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
          />

        </div>

        {/* 본문 */}
        <div>

          <label
            className={`mb-1 block text-sm font-semibold ${labelClass}`}
          >
            본문
          </label>

          <textarea
            value={
              post.content
            }
            onChange={(e) =>
              onChange({
                ...post,
                content:
                  e.target.value,
              })
            }
            rows={5}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
          />

        </div>

        {/* 게시물 이미지 */}
        <PostImagePicker
          darkMode={
            darkMode
          }
          onChange={(value) =>
            onChange({
              ...post,
              postImage:
                value,
            })
          }
        />

        {/* 게시물 이미지 제거 */}
        {post.postImage && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...post,
                postImage: "",
              })
            }
            className={`w-fit rounded-lg px-3 py-2 text-sm ${
              darkMode
                ? "bg-[#303030] text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            게시물 이미지 제거
          </button>
        )}

        {/* 좋아요 */}
        <div className="flex flex-col gap-3">

          {/* 내가 좋아요 눌렀는지 */}
          <label
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              darkMode
                ? "border-[#444444] bg-[#252525] text-[#eeeeee]"
                : "border-slate-200 text-slate-800"
            }`}
          >
            <input
              type="checkbox"
              checked={
                post.liked
              }
              onChange={(e) =>
                onChange({
                  ...post,
                  liked:
                    e.target.checked,
                })
              }
            />

            좋아요 누르기

          </label>

          {/* 좋아요 누른 사람 */}
          <div>

            <label
              className={`mb-1 block text-sm font-semibold ${labelClass}`}
            >
              좋아요 누른 사람
            </label>

            <input
              value={
                post.likedBy
              }
              onChange={(e) =>
                onChange({
                  ...post,
                  likedBy:
                    e.target.value,
                })
              }
              placeholder="예: 냥이, 송이"
              className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            />

          </div>

        </div>

        {/* 댓글 목록 제목 */}
        <div className="flex items-center justify-between">

          <strong
            className={`text-sm ${
              darkMode
                ? "text-white"
                : "text-slate-800"
            }`}
          >
            댓글 목록
          </strong>

          <button
            type="button"
            onClick={
              addComment
            }
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              darkMode
                ? "bg-[#eeeeee] text-black"
                : "bg-slate-800 text-white"
            }`}
          >
            + 댓글 추가
          </button>

        </div>

        {/* 댓글 */}
        <div className="flex flex-col gap-3">

          {post.comments.map(
            (comment) => (
              <CommentEditor
                key={
                  comment.id
                }
                comment={
                  comment
                }
                darkMode={
                  darkMode
                }
                onChange={(
                  next
                ) =>
                  updateComment(
                    comment.id,
                    next
                  )
                }
                onDelete={() =>
                  deleteComment(
                    comment.id
                  )
                }
              />
            )
          )}

        </div>

      </div>

    </div>
  );
}