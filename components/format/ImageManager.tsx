"use client";
import { useRef, useState } from "react";
import { ArticleData, ArticleImage } from "@/types/article";

interface PlacementInfo {
  afterHeading: string;
  altText: string;
  reason: string;
}

interface ImageManagerProps {
  article: ArticleData;
  onImageUploaded: (image: ArticleImage, suggestion: PlacementInfo) => void;
}

export function ImageManager({ article, onImageUploaded }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/articles/${article.id}/images`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "アップロードに失敗しました");
        return;
      }
      onImageUploaded(data.image as ArticleImage, data.suggestion as PlacementInfo);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={isUploading}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">AIが配置場所を分析中...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">クリックして画像を選択</p>
            <p className="text-xs text-gray-400 mt-1">JPG · PNG · GIF · WebP</p>
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {article.images.length > 0 && (
        <ul className="space-y-2">
          {article.images.map((img) => (
            <li key={img.filename} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <img
                src={`/api/images/${img.filename}`}
                alt={img.altText}
                className="w-12 h-12 object-cover rounded shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{img.originalName}</p>
                <p className="text-xs text-gray-500">「{img.placementAfter}」の後に配置</p>
                {img.altText && (
                  <p className="text-xs text-gray-400 truncate">alt: {img.altText}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
