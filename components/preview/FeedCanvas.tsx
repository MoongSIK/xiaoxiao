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
      style={{
        fontFamily: "'SUITE Variable', sans-serif",
      }}
    >
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