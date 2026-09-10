"use client";

import { FeedComment, FeedPost } from "@/types/feed";
import { createId } from "@/lib/utils";

import CommentEditor from "./CommentEditor";
import FilePicker from "./FilePicker";

type Props = {
  post: FeedPost;
  index: number;
  onChange: (post: FeedPost) => void;
  onDelete: () => void;
};

export default function PostEditor({
  post,
  index,
  onChange,
  onDelete,
}: Props) {
  const addComment = () => {
    const newComment: FeedComment = {
      id: createId("comment"),
      author: "이름",
      content: "",
      isReply: false,
      replyTo: "",
    };

    onChange({
      ...post,
      comments: [...post.comments, newComment],
    });
  };

  const updateComment = (
    id: string,
    nextComment: FeedComment
  ) => {
    onChange({
      ...post,
      comments: post.comments.map((comment) =>
        comment.id === id ? nextComment : comment
      ),
    });
  };

  const deleteComment = (id: string) => {
    onChange({
      ...post,
      comments: post.comments.filter(
        (comment) => comment.id !== id
      ),
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">
          게시물 {index + 1}
        </h3>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
        >
          게시물 삭제
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <FilePicker
          label="프로필 이미지"
          onChange={(value) =>
            onChange({
              ...post,
              profileImage: value,
            })
          }
        />

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            작성자
          </label>

          <input
            value={post.author}
            onChange={(e) =>
              onChange({
                ...post,
                author: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            본문
          </label>

          <textarea
            value={post.content}
            onChange={(e) =>
              onChange({
                ...post,
                content: e.target.value,
              })
            }
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <FilePicker
          label="게시물 이미지"
          onChange={(value) =>
            onChange({
              ...post,
              postImage: value,
            })
          }
        />

        {post.postImage && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...post,
                postImage: "",
              })
            }
            className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm"
          >
            게시물 이미지 제거
          </button>
        )}

<div className="flex flex-col gap-3">
  <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm">
    <input
      type="checkbox"
      checked={post.liked}
      onChange={(e) =>
        onChange({
          ...post,
          liked: e.target.checked,
        })
      }
    />

    좋아요 누르기
  </label>

  {post.liked && (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700">
        좋아요 누른 사람
      </label>

      <input
        value={post.likedBy}
        onChange={(e) =>
          onChange({
            ...post,
            likedBy: e.target.value,
          })
        }
        placeholder="예: 이름"
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </div>
  )}
</div>
        <div className="flex items-center justify-between">
          <strong className="text-sm">
            댓글 목록
          </strong>

          <button
            type="button"
            onClick={addComment}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
          >
            + 댓글 추가
          </button>
        </div>

        <div className="text-xs text-slate-500">
          댓글이 없으면 미리보기에서는 회색 박스가 표시되지 않습니다.
        </div>

        <div className="flex flex-col gap-3">
          {post.comments.map((comment) => (
            <CommentEditor
              key={comment.id}
              comment={comment}
              onChange={(next) =>
                updateComment(comment.id, next)
              }
              onDelete={() =>
                deleteComment(comment.id)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}