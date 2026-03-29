// hooks/useYearInPixels.ts
import { useState, useEffect } from "react";
import { Activity, DayRecord } from "@/types";

// Importações dos nossos arquivos de ação
import { getRecordsFromDB, saveDayRecordToDB } from "@/actions/records";
import {
  getActivitiesFromDB,
  saveActivityToDB,
  updateActivityInDB,
  deleteActivityFromDB,
} from "@/actions/activities";

export function useYearInPixels() {
  // 1. Estados iniciais (agora começam vazios, pois a fonte da verdade é o banco)
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<DayRecord>({});
  const [isLoading, setIsLoading] = useState(true);

  // 2. Efeito de Busca: Carrega atividades e records juntos
  useEffect(() => {
    async function fetchAllData() {
      try {
        // Promise.all executa as duas buscas simultaneamente para ganhar tempo
        const [dbRecords, dbActivities] = await Promise.all([
          getRecordsFromDB(),
          getActivitiesFromDB(),
        ]);

        setRecords(dbRecords);
        setActivities(dbActivities);
      } catch (error) {
        console.error("Erro ao buscar dados do banco:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // 3. Adicionar Atividade (Interface Otimista + Salvar no Banco)
  const addActivity = async (name: string, color: string) => {
    const newId = crypto.randomUUID();

    // Atualiza a tela primeiro
    setActivities((prev) => [...prev, { id: newId, name, color }]);

    // Salva no banco em segundo plano
    await saveActivityToDB(newId, name, color);
  };

  // 4. Atualizar Atividade
  const updateActivity = async (id: string, name: string, color: string) => {
    // Atualiza a tela primeiro
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, name, color } : a)),
    );

    // Salva no banco em segundo plano
    await updateActivityInDB(id, name, color);
  };

  // 5. Deletar Atividade
  const deleteActivity = async (id: string) => {
    // A. Remove da lista de atividades na tela
    setActivities((prev) => prev.filter((a) => a.id !== id));

    // B. Remove os registros dessa atividade nos dias marcados na tela
    setRecords((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((aid) => aid !== id);
        if (next[key].length === 0) delete next[key];
      }
      return next;
    });

    // C. Deleta de fato no banco de dados
    await deleteActivityFromDB(id);
  };

  // 6. Atualizar os Dias
  const toggleDayActivity = async (dayKey: string, activityId: string) => {
    const current = records[dayKey] || [];
    const has = current.includes(activityId);
    const updated = has
      ? current.filter((id) => id !== activityId)
      : [...current, activityId];

    setRecords((prev) => {
      if (updated.length === 0) {
        const { [dayKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dayKey]: updated };
    });

    await saveDayRecordToDB(dayKey, updated);
  };

  return {
    activities,
    records,
    isLoading,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleDayActivity,
  };
}
