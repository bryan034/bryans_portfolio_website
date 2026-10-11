"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function ProjectImage(props: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(
    null,
  );
  return (
    <Image
      {...props}
      src={
        failedSource === props.src
          ? "/images/project-placeholder.svg"
          : props.src
      }
      onError={() => setFailedSource(props.src)}
    />
  );
}
