import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
            M
          </div>
          <p className="text-sm text-muted-foreground">My Duit - Finance Tracker</p>
        </div>
        <Outlet />
      </div>
      <p className="fixed bottom-4 text-xs text-muted-foreground">v2.4</p>
    </div>
  );
}
