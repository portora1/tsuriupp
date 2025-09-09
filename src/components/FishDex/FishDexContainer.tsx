import { useAuth } from "../../contexts/AuthContext";
import { useFishDex } from "../../hooks/useFishDex";
import { FishDexList } from "./FishDexList";

export const FishDexContainer = () => {
    const { user } = useAuth();
    const { dexEntries, loading, error } = useFishDex(user);

    if(loading) {
        return <div>図鑑を読み込み中...</div>;
    }

    if(error) {
        return <div>エラー: {error}</div>
    }

    return (
        <div>
            <h2>魚図鑑</h2>
            <FishDexList entries={dexEntries} />
        </div>
    );
};