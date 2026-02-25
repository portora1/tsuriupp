import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { handleSupabaseError } from "../../lib/errorHandlers";
import style from "./Auth.module.scss";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLoginForm) {
        // ログイン処理
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        navigate("/dashboard");
      } else {
        // サインアップ処理
        if (!username) {
          alert("ユーザー名を入力してください。");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        alert("確認メールを送信しました！メールボックスを確認してください。");
      }
    } catch (error: unknown) {
      const message = handleSupabaseError(error);
      alert(message || "処理に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.authContainer}>
      <h2>{isLoginForm ? "ログイン" : "新規登録"}</h2>

      <form onSubmit={handleAuth} className={style.authForm}>
        {!isLoginForm && (
          <div className={style.formRow}>
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className={style.formRow}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={style.formRow}>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={style.formActions}>
          <button type="submit" disabled={loading}>
            {loading ? "処理中..." : isLoginForm ? "ログイン" : "登録する"}
          </button>
        </div>
      </form>

      <div className={style.switchText}>
        {isLoginForm ? (
          <p>
            アカウントをお持ちではないですか？{" "}
            <button onClick={() => setIsLoginForm(false)}>新規登録</button>
          </p>
        ) : (
          <p>
            すでにアカウントをお持ちですか？{" "}
            <button onClick={() => setIsLoginForm(true)}>ログイン</button>
          </p>
        )}
      </div>
    </div>
  );
};
