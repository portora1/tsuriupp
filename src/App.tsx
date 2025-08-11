import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { Auth } from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/supabaseClient";
import { Dashboard } from "./components/Dashboard";
import { Profile } from './components/Profile';

export type FishingLog = {
  id: number;
  created_at: string;
  fish_name: string;
  fish_size: number | null;
  location: string;
  fished_at: string;
  comment: string | null;
  image_url: string | null;
  user_id: string;
};

const AppLayout = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className='app-header'>
        <nav>
          <Link to="/dashboard">ダッシュボード</Link> | <Link to ="/profile">プロフィール</Link>
        </nav>
        <div>
          <span>ようこそ、{user?.user_metadata.username || user?.email}さん！</span>
          <button onClick={() => supabase.auth.signOut()}>ログアウト</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const { session, loading } = useAuth();
  if(loading) {
    return<div>読み込み中...</div>;
  }

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
        {!session ? (
          <Route path="*" element={<Auth />} />
        ) : (
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<Dashboard />} />
          </Route>
        )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;