"use client";

import React from "react";
import { FeedProject } from "@/types/feed";
import FeedPost from "./FeedPost";

type Props = {
  project: FeedProject;
  captureRef: React.RefObject<HTMLDivElement | null>;
};

export default function FeedCanvas({
  project,
  captureRef,
}: Props) {
  return (
    <div
      ref={captureRef}
      className="w-[760px] bg-white"
    >
      <header className="flex h-[64px] items-center border-b border-[#eeeeee] px-6">
        <div className="text-[42px] font-light leading-none text-[#111111]">
          ‹
        </div>
      </header>

      <main>
        {project.posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
          />
        ))}
      </main>
    </div>
  );
}