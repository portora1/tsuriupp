import { useState, useEffect,} from "react";
import { supabase } from "../lib/supabaseClient";
import type {FishingLog} from "../App";
import type { User } from "@supabase/supabase-js";

export const useFishingLogs = (user: User | null) => {
    const [logs, setLogs] = useState<FishingLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data,error: fetchError } = await supabase
                  .from('fishing_logs')
                  .select('*')
                  .order('created_at', { ascending: false });
                if (fetchError) throw fetchError;
                if (data) setLogs(data);
            } catch (err: any) {
                setError(err.message || 'データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [user?.id]);

    const removeLog = (logId: number) => {
        setLogs(logs.filter(log => log.id !== logId));
    };

    const updateLog = (updateLog: FishingLog) => {
        setLogs(logs.map(log => (log.id === updateLog.id ? updateLog : log)));
    };
    
    const addLog = (newLog: FishingLog) => {
        setLogs([newLog, ...logs]);
    };

    return { logs, loading, error, addLog, removeLog, updateLog};
};