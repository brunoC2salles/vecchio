"use client";

import { useState } from "react";
import type { Insumo, ItemLinha } from "./types";

type ItemsEditorProps = {
  insumos: Insumo[];
  initialItems?: ItemLinha[];
  fieldName: string;
};

export function ItemsEditor({ insumos, initialItems, fieldName }: ItemsEditorProps) {
  const [items, setItems] = useState<ItemLinha[]>(
    initialItems && initialItems.length > 0 ? initialItems : [{ insumo_id: insumos[0]?.id ?? "", quantidade: 0 }]
  );

  function updateItem(index: number, patch: Partial<ItemLinha>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { insumo_id: insumos[0]?.id ?? "", quantidade: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input type="hidden" name={fieldName} value={JSON.stringify(items)} />

      <div className="space-y-3">
        {items.map((item, i) => {
          const insumo = insumos.find((ins) => ins.id === item.insumo_id);
          return (
            <div key={i} className="flex items-center gap-3">
              <select
                value={item.insumo_id}
                onChange={(e) => updateItem(i, { insumo_id: e.target.value })}
                className="border-line bg-ink text-paper flex-1 rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
              >
                {insumos.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.nome} ({ins.unidade})
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.001"
                min="0"
                value={item.quantidade}
                onChange={(e) => updateItem(i, { quantidade: Number(e.target.value) })}
                className="border-line bg-ink text-paper w-28 rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
              />
              <span className="text-smoke w-14 text-xs">{insumo?.unidade}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-rosso text-xs underline underline-offset-2"
              >
                remover
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="text-oro mt-3 text-sm underline underline-offset-2"
      >
        + adicionar item
      </button>
    </div>
  );
}
