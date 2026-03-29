import { useState } from "react";
import { Activity } from "@/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Props {
  activities: Activity[];
  onAdd: (name: string, color: string) => void;
  onUpdate: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#f59e0b",
  "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#8b5cf6",
];

export default function ActivityManager({ activities, onAdd, onUpdate, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
    setColor(PRESET_COLORS[0]);
    setIsAdding(false);
  };

  const startEdit = (a: Activity) => {
    setEditingId(a.id);
    setName(a.name);
    setColor(a.color);
  };

  const handleUpdate = () => {
    if (!editingId || !name.trim()) return;
    onUpdate(editingId, name.trim(), color);
    setEditingId(null);
    setName("");
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName("");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Atividades
        </h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Activity list */}
      <div className="space-y-1.5">
        {activities.map((a) =>
          editingId === a.id ? (
            <FormRow
              key={a.id}
              name={name}
              color={color}
              onNameChange={setName}
              onColorChange={setColor}
              onConfirm={handleUpdate}
              onCancel={cancel}
            />
          ) : (
            <div
              key={a.id}
              className="flex items-center gap-2 group px-2 py-1.5 rounded hover:bg-accent transition-colors"
            >
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: a.color }}
              />
              <span className="text-sm text-foreground flex-1">{a.name}</span>
              <button
                onClick={() => startEdit(a)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(a.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <FormRow
          name={name}
          color={color}
          onNameChange={setName}
          onColorChange={setColor}
          onConfirm={handleAdd}
          onCancel={cancel}
        />
      )}
    </div>
  );
}

function FormRow({
  name,
  color,
  onNameChange,
  onColorChange,
  onConfirm,
  onCancel,
}: {
  name: string;
  color: string;
  onNameChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nome da atividade"
        className="flex-1 bg-accent text-foreground text-sm px-2 py-1 rounded border border-border outline-none focus:ring-1 focus:ring-ring"
        onKeyDown={(e) => e.key === "Enter" && onConfirm()}
        autoFocus
      />
      <button onClick={onConfirm} className="text-foreground hover:text-primary transition-colors">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
