import { Auth } from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/supabaseClient";
import { Dashboard } from "./components/Dashboard";
import './App.scss';

export type FishingLog = {
  id:number;
  created_at: string;
  fish_name: string;
  fish_size: number | null;
  location: string;
  fished_at: string;
  comment: string | null;
  image_url: string | null;
  user_id: string;
};

function App() {
  const { session, loading, user } = useAuth();
  if(loading) {
    return<div>読み込み中...</div>;
  }

  return (
    <div className="App">
      {session && user && (
        <div className="app-header">
          <p>ようこそ、{user.email}さん！</p>
          <button onClick={() => supabase.auth.signOut()}>ログアウト</button>
          </div>
          )}
      {!session ? (
        <Auth />
      ) : (
        user && <Dashboard key={user.id} />
      )}
    </div>
  );
}

export default App;