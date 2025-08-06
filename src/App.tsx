import { Auth } from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/supabaseClient";

function App() {
  const { session, loading } = useAuth();
  if(loading) {
    return<div>読み込み中...</div>;
  }

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : (
        <div>
          <h1>釣りアップっぷ</h1>
          <p>ようこそ、{session.user.email}さん！</p>
          <button onClick={() => supabase.auth.signOut()}>ログアウト</button>
          </div>
      )}
    </div>
  );
}

export default App;