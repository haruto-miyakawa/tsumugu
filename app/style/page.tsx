"use client";
import { useEffect, useState } from "react";
import { StyleConfig } from "@/types/style";
import { StyleDisplay } from "@/components/style/StyleDisplay";
import { StyleEditor } from "@/components/style/StyleEditor";
import { StyleAnalyzer } from "@/components/style/StyleAnalyzer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function StylePage() {
  const [style, setStyle] = useState<StyleConfig | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/style")
      .then((r) => r.json())
      .then(setStyle);
  }, []);

  const handleSave = async (updated: StyleConfig) => {
    const res = await fetch("/api/style", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const saved = await res.json() as StyleConfig;
    setStyle(saved);
    setIsEditMode(false);
    setToast("保存しました");
    setTimeout(() => setToast(null), 3000);
  };

  if (!style) return (
    <PageContainer title="スタイル設定">
      <div className="flex justify-center py-12"><LoadingSpinner /></div>
    </PageContainer>
  );

  return (
    <PageContainer title="スタイル設定">
      {toast && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
          {toast}
        </div>
      )}
      <div className="space-y-6">
        <Card title="現在のスタイル">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditMode ? (
                <StyleEditor style={style} onSave={handleSave} />
              ) : (
                <StyleDisplay style={style} />
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant={isEditMode ? "secondary" : "primary"}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "キャンセル" : "編集"}
            </Button>
          </div>
        </Card>
        <Card title="既存記事からスタイルを解析">
          <p className="text-sm text-gray-600 mb-4">
            自分のnote記事を貼り付けると、AIがスタイルを自動解析します。解析結果を確認してから適用できます。
          </p>
          <StyleAnalyzer onApply={handleSave} />
        </Card>
      </div>
    </PageContainer>
  );
}
