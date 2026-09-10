"use client";

import { FeedComment } from "@/types/feed";

type Props = {
  comment: FeedComment;
  darkMode: boolean;
  onChange: (
    comment: FeedComment
  ) => void;
  onDelete: () => void;
};

export default function CommentEditor({
  comment,
  darkMode,
  onChange,
  onDelete,
}: Props) {
  const inputClass =
    darkMode
      ? "border-[#505050] bg-[#2a2a2a] text-white placeholder:text-[#888888]"
      : "border-slate-300 bg-white text-slate-900";

  return (
    <div
      className={`rounded-xl border p-3 ${
        darkMode
          ? "border-[#444444] bg-[#282828]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">

        <strong
          className={`text-sm ${
            darkMode
              ? "text-white"
              : "text-slate-700"
          }`}
        >
          댓글
        </strong>

        <button
          type="button"
          onClick={onDelete}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            darkMode
              ? "bg-[#3a2020] text-red-300"
              : "bg-red-50 text-red-600"
          }`}
        >
          삭제
        </button>

      </div>

      <div className="flex flex-col gap-3">

        {/* 작성자 */}
        <div>
          <label
            className={`mb-1 block text-xs font-semibold ${
              darkMode
                ? "text-[#cccccc]"
                : "text-slate-600"
            }`}
          >
            작성자
          </label>

          <input
            value={
              comment.author
            }
            onChange={(e) =>
              onChange({
                ...comment,
                author:
                  e.target.value,
              })
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
          />
        </div>

        {/* 답글 */}
        <label
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            darkMode
              ? "border-[#484848] bg-[#2a2a2a] text-white"
              : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <input
            type="checkbox"
            checked={
              comment.isReply
            }
            onChange={(e) =>
              onChange({
                ...comment,
                isReply:
                  e.target.checked,
                replyTo:
                  e.target.checked
                    ? comment.replyTo
                    : "",
              })
            }
          />

          답글로 작성
        </label>

        {/* 답글 대상 */}
        {comment.isReply && (
          <div>
            <label
              className={`mb-1 block text-xs font-semibold ${
                darkMode
                  ? "text-[#cccccc]"
                  : "text-slate-600"
              }`}
            >
              답글 대상
            </label>

            <input
              value={
                comment.replyTo
              }
              onChange={(e) =>
                onChange({
                  ...comment,
                  replyTo:
                    e.target.value,
                })
              }
              placeholder="예: 냥이"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
            />
          </div>
        )}

        {/* 내용 */}
        <div>
          <label
            className={`mb-1 block text-xs font-semibold ${
              darkMode
                ? "text-[#cccccc]"
                : "text-slate-600"
            }`}
          >
            내용
          </label>

          <textarea
            value={
              comment.content
            }
            onChange={(e) =>
              onChange({
                ...comment,
                content:
                  e.target.value,
              })
            }
            rows={3}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
          />
        </div>

      </div>
    </div>
  );
}