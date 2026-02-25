import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; // パスを修正
import { handleSupabaseError } from "../../lib/errorHandlers"; // パスを修正
import { useAuth } from "../../hooks/useAuth"; // パスを修正
import styles from "./Profile.module.scss";

export const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();
          if (error && error.code !== "PGRST116") {
            throw error;
          }
          if (data) {
            setUsername(data.username || "");
          }
        } catch (err: unknown) {
          const message = handleSupabaseError(err);
          console.error("Error fetching profile:", message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("ユーザー情報が見つかりません。");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;

      await supabase.auth.updateUser({
        data: { username: username },
      });

      alert("プロフィールを更新しました！");
    } catch (error: unknown) {
      const message = handleSupabaseError(error);
      alert(message || "更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2>プロフィール編集</h2>
      <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
        <div className={styles.formRow}>
          <label>メールアドレス</label>
          <span className={styles.emailText}>{user?.email}</span>
        </div>
        <div className={styles.formRow}>
          <label htmlFor="username">ユーザー名</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "更新中..." : "更新する"}
        </button>
      </form>
    </div>
  );
};
