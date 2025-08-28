import { useState, useEffect,} from "react";
import { supabase } from "../lib/supabaseClient";
import type { FishingLog } from "../App";
import type { User } from "@supabase/supabase-js";

//profilesの情報を含むようにする
export type FishingLogWithProfile = FishingLog & {
    profiles: {
        username: string;
    } | null;
};

export const useFishingLogs = (user: User | null) => {
    const [logs, setLogs] = useState<FishingLogWithProfile[]>([]);
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
                  .select(`
                    *,
                    profiles (
                        username 
                    )
                    `)
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
    }, [user]);
    
    const addLog = (newLog: FishingLogWithProfile) => {
        setLogs(prevLogs => [newLog, ...prevLogs]);
    };

    const removeLog = (logId: number) => {
        setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
    };

    const updateLog = (updatedLog: FishingLogWithProfile) => {
        setLogs(prevLogs => prevLogs.map(log => (log.id === updatedLog.id ? updatedLog : log)));
    };


    return { logs, loading, error, addLog, removeLog, updateLog};
};

