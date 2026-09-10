"use client";

import { Heart, MessageCircle } from "lucide-react";
import { FeedComment, FeedPost as FeedPostType } from "@/types/feed";

type Props = {
  post: FeedPostType;
};

function renderCommentAuthor(comment: FeedComment) {
  if (comment.isReply && comment.replyTo.trim()) {
    return (
      <>
        <span className="text-[18px] font-medium text-[#7185be]">
          {comment.author}
        </span>

        <span className="text-[18px] font-medium text-[#555555]">
          답장
        </span>

        <span className="text-[18px] font-medium text-[#7185be]">
          {comment.replyTo}
        </span>
      </>
    );
  }

  return (
    <span className="text-[18px] font-medium text-[#7185be]">
      {comment.author}
    </span>
  );
}

export default function FeedPost({ post }: Props) {
  const hasComments = post.comments.length > 0;

  const hasLikeInfo =
    post.liked && post.likedBy.trim().length > 0;

  const showReactionBox =
    hasComments || hasLikeInfo;

  return (
    <article className="border-b border-[#eeeeee] px-7 py-7 last:border-b-0">
      <div className="flex gap-4">
        <img
          src={post.profileImage}
          alt=""
          className="h-[56px] w-[56px] shrink-0 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[21px] font-medium text-[#7185be]">
            {post.author}
          </div>

          <div className="whitespace-pre-wrap break-words text-[20px] leading-[1.6] text-[#565656]">
            {post.content}
          </div>

          {post.postImage && (
            <div className="mt-4">
              <img
                src={post.postImage}
                alt=""
                className="max-h-[520px] w-full max-w-[470px] object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* 게시물 아래 하트 / 말풍선 */}
      <div className="mt-5 flex justify-end gap-5 pr-6">
        <Heart
          size={38}
          strokeWidth={1.6}
          fill={post.liked ? "#ef8fa1" : "none"}
          className={
            post.liked
              ? "text-[#ef8fa1]"
              : "text-[#a6a6a6]"
          }
        />

        <MessageCircle
          size={38}
          strokeWidth={1.5}
          fill={hasComments ? "#ef8fa1" : "none"}
          className={
            hasComments
              ? "text-[#ef8fa1]"
              : "text-[#a6a6a6]"
          }
          style={{
            transform: "scaleX(-1)",
          }}
        />
      </div>

      {/* 좋아요 정보 또는 댓글이 있을 때만 회색 박스 표시 */}
      {showReactionBox && (
        <div className="ml-[72px] mt-4 bg-[#f4f4f4] px-5 py-4">

          {/* 좋아요 누른 사람 */}
          {hasLikeInfo && (
            <div
              className={
                hasComments
                  ? "mb-3 flex items-center gap-2"
                  : "flex items-center gap-2"
              }
            >
              <Heart
                size={20}
                strokeWidth={1.8}
                fill="none"
                className="text-[#7185be]"
              />

              <span className="text-[18px] font-medium text-[#7185be]">
                {post.likedBy}
              </span>
            </div>
          )}

          {/* 댓글 */}
          {hasComments &&
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-2 last:mb-0"
              >
                {renderCommentAuthor(comment)}

                <span className="text-[18px] leading-[1.6] text-[#555555]">
                  {" : "}
                  {comment.content}
                </span>
              </div>
            ))}
        </div>
      )}
    </article>
  );
}