"use client";

import { FeedComment } from "@/types/feed";

type Props = {
  comment: FeedComment;
  onChange: (comment: FeedComment) => void;
  onDelete: () => void;
};

export default function CommentEditor({
  comment,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <strong className="text-sm text-slate-700">
          댓글
        </strong>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
        >
          삭제
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            작성자
          </label>

          <input
            value={comment.author}
            onChange={(e) =>
              onChange({
                ...comment,
                author: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={comment.isReply}
            onChange={(e) =>
              onChange({
                ...comment,
                isReply: e.target.checked,
                replyTo: e.target.checked ? comment.replyTo : "",
              })
            }
          />
          답글로 작성
        </label>

        {comment.isReply && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              답글 대상
            </label>

            <input
              value={comment.replyTo}
              onChange={(e) =>
                onChange({
                  ...comment,
                  replyTo: e.target.value,
                })
              }
              placeholder="예: 이름"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            내용
          </label>

          <textarea
            value={comment.content}
            onChange={(e) =>
              onChange({
                ...comment,
                content: e.target.value,
              })
            }
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}