"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { FromReadmeModal } from "./FromReadmeModal";
import type { FromReadmeResponse } from "@/types/from-readme";

interface FromReadmeButtonProps {
  onApply: (response: FromReadmeResponse) => void;
  disabled?: boolean;
}

/**
 * 「READMEから自動入力」モーダルを起動するボタン。
 * 親（GenerateForm）に解析結果をコールバックで渡す。
 */
export function FromReadmeButton({ onApply, disabled }: FromReadmeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Btn
        kind="soft"
        size="md"
        icon="wand"
        iconRight="arrow-right"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        READMEから自動入力
      </Btn>
      <FromReadmeModal
        open={open}
        onClose={() => setOpen(false)}
        onApply={onApply}
      />
    </>
  );
}
