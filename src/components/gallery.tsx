"use client";
import { ProjectImage as Image } from "./project-image";
import { useRef, useState } from "react";
import { X } from "lucide-react";
export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export function Gallery({
  images,
  className = "",
}: {
  images: Screenshot[];
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Screenshot | null>(null);
  if (!images.length) return null;
  return (
    <div className={`gallery ${className}`}>
      {images.map((img) => (
        <figure key={img.src}>
          <button
            className="gallery-button"
            onClick={() => {
              setSelected(img);
              dialog.current?.showModal();
            }}
            aria-label={`Enlarge: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 700px) 100vw, 720px"
            />
          </button>
          <figcaption>{img.caption}</figcaption>
        </figure>
      ))}
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-label="Enlarged project screenshot"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close screenshot"
          onClick={() => dialog.current?.close()}
        >
          <X size={22} />
        </button>
        {selected && (
          <figure>
            <Image
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
            />
            <figcaption>{selected.caption}</figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
