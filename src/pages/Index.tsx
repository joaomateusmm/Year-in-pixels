import { useState } from "react";
import { useYearInPixels } from "@/hooks/useYearInPixels";
import PixelGrid from "@/components/PixelGrid";
import DayModal from "@/components/DayModal";
import ActivityManager from "@/components/ActivityManager";

const Index = () => {
  const year = new Date().getFullYear();
  const {
    activities,
    records,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleDayActivity,
  } = useYearInPixels();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Year in Pixels
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {year} · Acompanhe suas atividades diárias
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {activities.map((a) => (
              <div key={a.id} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-xs text-muted-foreground">{a.name}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_240px] gap-6">
          {/* Grid */}
          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <PixelGrid
              year={year}
              activities={activities}
              records={records}
              onDayClick={setSelectedDay}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <ActivityManager
              activities={activities}
              onAdd={addActivity}
              onUpdate={updateActivity}
              onDelete={deleteActivity}
            />

            {/* Stats */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                Resumo
              </h2>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Dias registrados: {Object.keys(records).length}</p>
                {activities.map((a) => {
                  const count = Object.values(records).filter((ids) =>
                    ids.includes(a.id)
                  ).length;
                  return (
                    <p key={a.id} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-sm inline-block"
                        style={{ backgroundColor: a.color }}
                      />
                      {a.name}: {count} dias
                    </p>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Day modal */}
      <DayModal
        open={!!selectedDay}
        dayKey={selectedDay}
        activities={activities}
        selectedIds={selectedDay ? records[selectedDay] || [] : []}
        onToggle={toggleDayActivity}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
};

export default Index;
