"use client";

import { useEffect, useState } from "react";
import { StyleConfig } from "@/types/style";
import { StyleDisplay } from "@/components/style/StyleDisplay";
import { StyleEditor } from "@/components/style/StyleEditor";
import { StyleAnalyzer } from "@/components/style/StyleAnalyzer";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SettingsPage() {
  const [style, setStyle]           = useState<StyleConfig | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/style").then((r) => r.json()).then(setStyle);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (updated: StyleConfig) => {
    const res = await fetch("/api/style", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setStyle(await res.json() as StyleConfig);
    setIsEditMode(false);
    showToast("保存しました");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-28 md:pb-12">

      {/* Page header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-1">
          SETTINGS
        </p>
        <h1 className="font-display text-[40px] md:text-[52px] leading-none text-ink">
          設定
        </h1>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-6 px-4 py-2.5 bg-marker border border-rule text-ink-sub text-[13px] font-sans rounded-sm">
          {toast}
        </div>
      )}

      {style === null ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-10">

          {/* ── Section 1: スタイル設定 ── */}
          <SettingsSection
            title="スタイル設定"
            description="記事生成時の文体・構成・語彙の傾向を定義します。既存記事からAIで自動解析することもできます。"
          >
            {/* Current style display / editor */}
            <div className="p-5 md:p-6">
              {isEditMode ? (
                <StyleEditor style={style} onSave={handleSave} />
              ) : (
                <StyleDisplay style={style} />
              )}
              <div className="mt-5 flex gap-2 pt-4 border-t border-rule">
                <Button
                  variant={isEditMode ? "secondary" : "primary"}
                  onClick={() => setIsEditMode((v) => !v)}
                >
                  {isEditMode ? "キャンセル" : "編集"}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-rule" />

            {/* AI analyzer */}
            <div className="p-5 md:p-6">
              <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-3">
                AI 自動解析
              </p>
              <p className="text-[13px] font-sans text-mute mb-4 leading-relaxed">
                自分のnote記事を貼り付けると、AIがスタイルを自動解析します。
                解析結果を確認してから適用できます。
              </p>
              <StyleAnalyzer onApply={handleSave} />
            </div>
          </SettingsSection>

          {/*
            Future sections go here, e.g.:
            <SettingsSection title="プロフィール" description="...">...</SettingsSection>
            <SettingsSection title="APIキー" description="...">...</SettingsSection>
          */}

        </div>
      )}
    </main>
  );
}
