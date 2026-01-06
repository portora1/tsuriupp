import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import { Auth } from "./components/Auth";
import { supabase } from "./lib/supabaseClient";
import { Profile } from './components/Profile';
import { DashboardContainer as Dashboard } from "./components/FishingDashboard/DashboardContainer";
import type { ReactNode } from "react";
import { FishDex } from "./components/FishingDashboard";
import './styles/components/_app-layout.scss';
import { useAuth } from "./hooks/useAuth";

const AppLayout = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className="app-header">
        <div className="header-left">
          <img src="/images/app_logo.png" alt="釣りアップっぷ" className="app-logo" />
          <nav>
            <ul>
              <li><Link to="/dashboard">ダッシュボード</Link></li>
              <li><Link to="/profile">プロフィール</Link></li>
              <li><Link to="/dex">魚図鑑</Link></li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <span>ようこそ、{user?.user_metadata.username || "ゲスト"}さん！</span>
          <button onClick={() => supabase.auth.signOut()}>ログアウト</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { loading } = useAuth();
  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dex" element={<FishDex />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
