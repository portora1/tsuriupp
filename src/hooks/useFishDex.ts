import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js"
import type { FishDexEntry } from "../types";

export const useFishDex = (user: User | null) => {
    const [dexEntries, setDexEntries] = useState<FishDexEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchDex = async () => {
            setLoading(true);
            setError(null);
            try {

                
                 const { data, error: fetchError } = await supabase
                    .from('fish_summary')
                    .select('*')

                if (fetchError) throw fetchError;
                if (data) setDexEntries(data);
            } catch (err: any) {
                setError(err.message || '図鑑データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchDex();
    }, [user]);

    const refetchDex = async () => {
        if (!user) return;
    };

    return { dexEntries, loading, error, refetchDex };
};