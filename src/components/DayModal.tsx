import { Activity } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface Props {
  open: boolean;
  dayKey: string | null;
  activities: Activity[];
  selectedIds: string[];
  onToggle: (dayKey: string, activityId: string) => void;
  onClose: () => void;
}

export default function DayModal({
  open,
  dayKey,
  activities,
  selectedIds,
  onToggle,
  onClose,
}: Props) {
  if (!dayKey) return null;

  const formatDate = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground font-semibold capitalize">
            {formatDate(dayKey)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {activities.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhuma atividade cadastrada. Crie uma primeiro!
            </p>
          )}
          {activities.map((activity) => {
            const checked = selectedIds.includes(activity.id);
            return (
              <button
                key={activity.id}
                onClick={() => onToggle(dayKey, activity.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:bg-accent transition-colors"
              >
                <span
                  className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: checked ? activity.color : "transparent",
                    border: `2px solid ${activity.color}`,
                  }}
                >
                  {checked && <Check className="w-3 h-3 text-foreground" />}
                </span>
                <span className="text-sm text-foreground">{activity.name}</span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
