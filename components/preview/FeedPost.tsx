"use client";

import { MessageCircle } from "lucide-react";

import {
  FeedComment,
  FeedPost as FeedPostType,
} from "@/types/feed";

type Props = {
  post: FeedPostType;
};

function CustomHeart({
  filled = false,
  size = 44,
  color = "#a6a6a6",
}: {
  filled?: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill={
        filled
          ? color
          : "none"
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 34.5
           C18.2 33.2 14.7 30.9 11.4 28.2
           C7.2 24.7 4.5 20.7 4.5 16.2
           C4.5 11 7.9 6.8 12.9 6.8
           C16.2 6.8 18.8 8.5 20 10.9
           C21.2 8.5 23.8 6.8 27.1 6.8
           C32.1 6.8 35.5 11 35.5 16.2
           C35.5 20.7 32.8 24.7 28.6 28.2
           C25.3 30.9 21.8 33.2 20 34.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderCommentAuthor(
  comment: FeedComment
) {
  if (
    comment.isReply &&
    comment.replyTo.trim()
  ) {
    return (
      <>
        <span className="text-[23px] text-[#7185be]">
          {comment.author}
        </span>

        <span className="text-[23px] text-[#565656]">
          답장
        </span>

        <span className="text-[23px] text-[#7185be]">
          {comment.replyTo}
        </span>
      </>
    );
  }

  return (
    <span className="text-[23px] text-[#7185be]">
      {comment.author}
    </span>
  );
}

export default function FeedPost({
  post,
}: Props) {
  const hasComments =
    post.comments.length > 0;

  const hasLikeInfo =
    post.liked &&
    post.likedBy.trim().length > 0;

  const showReactionBox =
    hasComments ||
    hasLikeInfo;

  return (
    <article className="border-b border-[#e8e8e8] px-7 py-8 last:border-b-0">

      <div className="flex gap-5">

        {/* 프로필 이미지 */}
        {post.profileImage && (
          <img
            src={
              post.profileImage
            }
            alt=""
            width={63}
            height={63}
            draggable={
              false
            }
            decoding="sync"
            className="h-[63px] w-[63px] shrink-0 rounded-[3px] object-cover"
          />
        )}

        {/* 게시물 내용 */}
        <div className="min-w-0 flex-1">

          {/* 작성자 */}
          <div className="text-[25px] font-medium leading-[1.05] text-[#7185be]">
            {post.author}
          </div>

          {/* 본문 */}
          <div className="mt-[12px] whitespace-pre-wrap break-words text-[23px] leading-[1.25] text-[#565656]">
            {post.content}
          </div>

          {/* 게시물 첨부 이미지 */}
          {post.postImage && (
            <div className="mt-4">

              <div className="h-[335px] w-[470px] overflow-hidden bg-white">

                <img
                  src={
                    post.postImage
                  }
                  alt=""
                  draggable={
                    false
                  }
                  decoding="sync"
                  className="h-full w-full object-cover"
                />

              </div>

            </div>
          )}

        </div>

      </div>

      {/* 좋아요 / 댓글 아이콘 */}
      <div className="mt-2 flex items-center justify-end gap-5 pr-6">

        <CustomHeart
          size={44}
          filled={
            post.liked
          }
          color={
            post.liked
              ? "#ef8fa1"
              : "#a6a6a6"
          }
        />

        <MessageCircle
          size={38}
          strokeWidth={1.5}
          fill={
            hasComments
              ? "#ef8fa1"
              : "none"
          }
          className={
            hasComments
              ? "text-[#ef8fa1]"
              : "text-[#a6a6a6]"
          }
          style={{
            transform:
              "scaleX(-1)",
          }}
        />

      </div>

      {/* 좋아요 / 댓글 회색 박스 */}
      {showReactionBox && (
        <div className="ml-[83px] mr-6 mt-2 rounded-[8px] bg-[#f4f4f4] px-4 py-2">

          {/* 좋아요 */}
          {hasLikeInfo && (
            <div
              className={
                hasComments
                  ? "mb-3 flex items-center gap-2"
                  : "flex items-center gap-2"
              }
            >

              <CustomHeart
                size={24}
                filled={
                  false
                }
                color="#7185be"
              />

              <span className="text-[23px] text-[#7185be]">
                {
                  post.likedBy
                }
              </span>

            </div>
          )}

          {/* 댓글 */}
          {hasComments &&
            post.comments.map(
              (comment) => (
                <div
                  key={
                    comment.id
                  }
                  className="mb-2 last:mb-0"
                >

                  {renderCommentAuthor(
                    comment
                  )}

                  <span className="text-[23px] leading-[1.6] text-[#555555]">
                    {" : "}
                    {
                      comment.content
                    }
                  </span>

                </div>
              )
            )}

        </div>
      )}

    </article>
  );
}