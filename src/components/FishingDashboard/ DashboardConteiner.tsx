import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useFishingLogs } from "../../hooks/useFishingLogs"; 
import { useStorage } from "../../hooks/useStorage";
import { FishingLogForm } from "./FishingLogForm";
import { FishingLogList } from "./FishingLogList";
import type { FishingLog } from "../../App";

export const DashboardContainer = () => {
    const { user } = useAuth();
    const { logs, loading, error, addLog, removeLog, updateLog } = useFishingLogs(user);
    const { isUploading, uploadImage, deleteImage } = useStorage('fishing-images');

    const handleLogSubmit = async (logData: any) => {
        if(!user) return;
        try {
            let imageUrl: string | null = null;
            if (logData.imageFile) {
                imageUrl = await uploadImage(logData.imageFile);
            }
            const { data, error: insertError } = await supabase
            .from('fishing_logs')
            .insert({
                fish_name: logData.fishName,
                fish_size: logData.fishSize ? Number(logData.fishSize) : null,
                fish_weight: logData.fishWeight ? Number(logData.fishWeight) : null,
                location: logData.location || null,
                comment: logData.comment,
                user_id: user.id,
                fished_at: new Date().toISOString(),
                image_url: imageUrl,
            })
            .select()
            .single();
        if (insertError) throw insertError;
        addLog(data);
        } catch(err: any) {
            alert(err.message || '投稿に失敗しました。');
        }
    };

    const handleDelete = async (logToDelete: FishingLog) => {        
        try {
            if(logToDelete.image_url) {
            await deleteImage(logToDelete.image_url);
            }
            const { error } = await supabase
            .from('fishing_logs')
            .delete()
            .eq('id', logToDelete.id);
            if(error) throw error;
            removeLog(logToDelete.id);
        } catch (err) {
            alert('削除に失敗しました。');
        }
    };

    const handleUpdate = async (logToUpdate: FishingLog, updatedData: any) => {
//画像が変更されたかチェック
        const isImageChanged = !updatedData.imageFile;
//テキストが変更されたかチェック
        const isTextChanged = logToUpdate.fish_name !== updatedData.fishName ||
        String(logToUpdate.location || '') !== updatedData.location ||
        String(logToUpdate.fish_size || '') !==updatedData.fishSize ||
        String(logToUpdate.fish_weight || '') !== updatedData.fishWeight ||
        String(logToUpdate.comment || '') !== updatedData.comment;
//画像もテキストもどちらも変更が無ければ処理完了
        if(!isImageChanged && !isTextChanged) {
            return;
        }

        try {
            let updatedImageUrl = logToUpdate.image_url;
            if (updatedData.imageFile) {
                if (logToUpdate.image_url) await deleteImage(logToUpdate.image_url);
                updatedImageUrl = await uploadImage(updatedData.imageFile);
            }
        const { data, error } = await supabase
            .from('fishing_logs')
            .update({
                fish_name: updatedData.fishName,
                fish_size: updatedData.fishSize ? Number(updatedData.fishSize) : null,
                fish_weight: updatedData.fishWeight ? Number(updatedData.fishWeight) : null,
                location: updatedData.location,
                comment: updatedData.comment,
                image_url: updatedImageUrl,
            })
            .eq('id', logToUpdate.id)
            .select()
            .maybeSingle();
            
        if (error) throw error;
        if(data) {
            updateLog(data);
        }
        } catch (err) {
            alert('更新に失敗しました。');
        }
    };

    if (loading) return <div>読み込み中...</div>;
    if (error) return <div>エラー： {error}</div>;

    return (
        <div>
            <h1>釣りアップっぷ</h1>
            <FishingLogForm
            onLogSubmit={handleLogSubmit}
            isUploading={isUploading} />
            < hr />
            <FishingLogList
            logs={logs}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            />
        </div>
    );
};

