"use client";
import { useState } from "react";
import { StyleConfig } from "@/types/style";
import { Button } from "@/components/ui/Button";

interface StyleEditorProps {
  style: StyleConfig;
  onSave: (style: StyleConfig) => Promise<void>;
}

export function StyleEditor({ style, onSave }: StyleEditorProps) {
  const [json, setJson] = useState(JSON.stringify(style, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(json) as StyleConfig;
      setError(null);
      setIsSaving(true);
      await onSave(parsed);
    } catch (e) {
      setError(e instanceof SyntaxError ? `JSON構文エラー: ${e.message}` : "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        className="w-full h-96 font-mono text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        spellCheck={false}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={handleSave} isLoading={isSaving}>
        保存
      </Button>
    </div>
  );
}
