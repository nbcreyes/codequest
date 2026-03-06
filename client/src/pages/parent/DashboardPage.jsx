// Parent dashboard placeholder — full implementation in Step 27.

import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";

const DashboardPage = () => {
  const { parent, clearAuth } = useAuthStore();

  return (
    <div className="min-h-screen bg-quest-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-quest-700">
            Welcome, {parent?.firstName}
          </h1>
          <Button variant="secondary" onClick={clearAuth}>
            Log out
          </Button>
        </div>
        <div className="bg-white rounded-4xl p-8 shadow-card text-center">
          <p className="font-body text-slate-500">
            Parent dashboard coming in Step 27.
          </p>
          <p className="font-body text-slate-400 text-sm mt-2">
            Auth is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;