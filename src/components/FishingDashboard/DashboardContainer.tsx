import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useFishingLogs } from "../../hooks/useFishingLogs";
import { useStorage } from "../../hooks/useStorage";
import { useAuth } from "../../hooks/useAuth";
import { FishingLogForm } from "./FishingLogForm";
import { FishingLogList } from "./FishingLogList";
import type {
  FishingLog,
  FishingLogFormData,
  FishingLogWithProfile,
} from "../../types";
import { handleSupabaseError } from "../../lib/errorHandlers";

export const DashboardContainer = () => {
  const { user } = useAuth();
  const { logs, setLogs, addLog, removeLog, updateLog } = useFishingLogs();
  const { isUploading, uploadImage, deleteImage } =
    useStorage("fishing-images");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    // console.log('%c --- fetchLogs CALLED! --- ', 'color: red; font-weight: bold;');
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("fishing_logs")
        .select(
          `*,profiles(username),
          fishing_log_reactions(emoji_id,user_id)
          `
        )
        .order("created_at", { ascending: false });
      if (fetchError) throw fetchError;
      if (data) setLogs(data as FishingLogWithProfile[]);
    } catch (err: unknown) {
      const message = handleSupabaseError(err);
      setError(message || "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchLogs();
  }, [user]);

  const handleLogSubmit = async (logData: FishingLogFormData) => {
    if (!user) return;
    try {
      const imageUrlPromise = logData.imageFile
        ? uploadImage(logData.imageFile)
        : Promise.resolve(null);

      const imageUrl = await imageUrlPromise;

      const { data, error: insertError } = await supabase
        .from("fishing_logs")
        .insert({
          fish_name: logData.fishName,
          fish_size: logData.fishSize ? Number(logData.fishSize) : null,
          fish_weight: logData.fishWeight ? Number(logData.fishWeight) : null,
          location: logData.location || null,
          comment: logData.comment,
          profile_id: user.id,
          fished_at: new Date().toISOString(),
          image_url: imageUrl,
        })
        .select(`*,profiles(username)`)
        .single();
      if (insertError) throw insertError;
      if (data) addLog(data);
    } catch (err: unknown) {
      const message = handleSupabaseError(err);
      alert(message || "投稿に失敗しました。");
    }
  };

  const handleDelete = async (logToDelete: FishingLog) => {
    // console.log(`[Container] Deleting image...`);
    try {
      if (logToDelete.image_url) {
        console.log(`[Container] Deleting image...`);
        await deleteImage(logToDelete.image_url);
      }
      // console.log(`[Container] Deleting from Supabase...`);
      const { error } = await supabase
        .from("fishing_logs")
        .delete()
        .eq("id", logToDelete.id);

      if (error) {
        console.error(`[Container] Supabase delete ERROR:`, error);
        throw error;
      }
      // console.log(`[Container] Supabase delete SUCCESS`);

      removeLog(logToDelete.id);
    } catch (err: unknown) {
      const message = handleSupabaseError(err);
      alert(message || "削除に失敗しました。");
    }
  };

  const handleUpdate = async (
    logToUpdate: FishingLog,
    updatedData: FishingLogFormData
  ) => {
    //画像が変更されたかチェック
    const isImageChanged = !!updatedData.imageFile;
    //テキストが変更されたかチェック
    const isTextChanged =
      logToUpdate.fish_name !== updatedData.fishName ||
      String(logToUpdate.location || "") !== updatedData.location ||
      String(logToUpdate.fish_size || "") !== updatedData.fishSize ||
      String(logToUpdate.fish_weight || "") !== updatedData.fishWeight ||
      String(logToUpdate.comment || "") !== updatedData.comment;
    //画像もテキストもどちらも変更が無ければ処理完了
    if (!isImageChanged && !isTextChanged) {
      return;
    }

    try {
      const updatedImageUrlPromise = updatedData.imageFile
        ? (async () => {
            if (logToUpdate.image_url) await deleteImage(logToUpdate.image_url);
            if (updatedData.imageFile) {
              return uploadImage(updatedData.imageFile);
            }
            return null;
          })()
        : Promise.resolve(logToUpdate.image_url);

      const updatedImageUrl = await updatedImageUrlPromise;

      const { data, error } = await supabase
        .from("fishing_logs")
        .update({
          fish_name: updatedData.fishName,
          fish_size: updatedData.fishSize ? Number(updatedData.fishSize) : null,
          fish_weight: updatedData.fishWeight
            ? Number(updatedData.fishWeight)
            : null,
          location: updatedData.location,
          comment: updatedData.comment,
          image_url: updatedImageUrl,
        })
        .eq("id", logToUpdate.id)
        .select(`*, profiles(username)`)
        .single();

      if (error) throw error;
      if (data) updateLog(data);
    } catch (err: unknown) {
      const message = handleSupabaseError(err);
      alert(message || "更新に失敗しました。");
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー： {error}</div>;

  return (
    <div>
      {/* <h1>釣りアップっぷ</h1> */}
      <FishingLogForm onLogSubmit={handleLogSubmit} isUploading={isUploading} />
      <hr />
      <FishingLogList
        logs={logs}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onRefresh={fetchLogs}
      />
    </div>
  );
};
