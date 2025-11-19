import { useState } from "react";
import type { FishingLogWithProfile } from "../types";

export const useFishingLogs = (initialLogs: FishingLogWithProfile[] = []) => {
    const [logs, setLogs] = useState<FishingLogWithProfile[]>(initialLogs);

    const addLog = (newLog: FishingLogWithProfile) => {
        setLogs(prevLogs => [newLog, ...prevLogs]);
    };

    const removeLog = (logId: number) => {
        // console.log(`[HOOK] removeLog CALLED with log ID: ${logId}`);
        setLogs(prevLogs => {
            const newLogs = prevLogs.filter(log => log.id !== logId);
            // console.log(`[HOOK] prevLogs count:`, prevLogs.length);
            // console.log(`[HOOK] newLogs count`, newLogs.length);
            return newLogs;
        });
    };

    const updateLog = (updatedLog: FishingLogWithProfile) => {
        setLogs(prevLogs => prevLogs.map(log=> (log.id === updatedLog.id ? updatedLog : log)));
    };


    return { logs, setLogs, addLog, removeLog, updateLog};
};

