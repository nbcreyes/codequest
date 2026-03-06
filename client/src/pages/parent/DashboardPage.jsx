import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, LogOut, Settings } from "lucide-react";
import { getChildren, deleteChild, switchToChild } from "@/services/childService";
import { getPinStatus } from "@/services/childService";
import useAuthStore from "@/store/authStore";
import useToast from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ChildCard from "@/components/child/ChildCard";
import ChildFormModal from "@/components/child/ChildFormModal";
import PinModal from "@/components/parent/PinModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { parent, clearAuth, setChildSession } = useAuthStore();

  // Modal states
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [deletingChild, setDeletingChild] = useState(null);
  const [switchingToChild, setSwitchingToChild] = useState(null);
  const [pinError, setPinError] = useState("");

  // Fetch children
  const { data: childrenData, isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
  });

  // Check if PIN is set
  const { data: pinData } = useQuery({
    queryKey: ["pinStatus"],
    queryFn: getPinStatus,
  });

  const pinIsSet = pinData?.data?.pinIsSet || false;
  const children = childrenData?.data?.children || [];

  // Delete child mutation
  const { mutate: removeChild, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteChild(deletingChild._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success(`${deletingChild.firstName}'s profile has been removed.`);
      setDeletingChild(null);
    },
    onError: () => {
      toast.error("Could not remove profile. Please try again.");
    },
  });

  // Switch to child mutation
  const { mutate: doSwitch, isPending: isSwitching } = useMutation({
    mutationFn: ({ childId, pin }) => switchToChild(childId, pin),
    onSuccess: (data) => {
      setChildSession(data.data.childToken, data.data.child);
      setSwitchingToChild(null);
      navigate("/play");
    },
    onError: (error) => {
      const code = error.response?.data?.code;
      if (code === "PIN_INCORRECT") {
        setPinError("Incorrect PIN. Please try again.");
      } else {
        toast.error(error.response?.data?.message || "Could not switch profiles.");
        setSwitchingToChild(null);
      }
    },
  });

  const handlePlay = (child) => {
    if (pinIsSet) {
      setPinError("");
      setSwitchingToChild(child);
    } else {
      doSwitch({ childId: child._id });
    }
  };

  const handlePinSubmit = (pin) => {
    setPinError("");
    doSwitch({ childId: switchingToChild._id, pin });
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-quest-50 via-white to-quest-100">
      {/* Header */}
      <header className="bg-white border-b border-quest-100 shadow-quest-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-quest-600">CodeQuest</h1>
          <div className="flex items-center gap-3">
            <span className="font-body text-slate-500 text-sm hidden sm:block">
              {parent?.firstName} {parent?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-quest-50 text-slate-500 hover:text-quest-600 font-body text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="font-display text-3xl text-slate-800">
            Welcome back, {parent?.firstName}
          </h2>
          <p className="font-body text-slate-500 mt-1">
            Manage your children's learning profiles and track their progress.
          </p>
        </motion.div>

        {/* Children section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-slate-700">
            Child profiles
          </h3>
          <Button
            onClick={() => setShowAddChild(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add a child
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : children.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-4xl p-12 text-center shadow-card border border-quest-100"
          >
            <div className="text-6xl mb-4">🧒</div>
            <h3 className="font-display text-xl text-slate-700 mb-2">
              No child profiles yet
            </h3>
            <p className="font-body text-slate-400 text-sm mb-6">
              Add your first child profile to get started with CodeQuest.
            </p>
            <Button onClick={() => setShowAddChild(true)}>
              <Plus className="w-4 h-4" />
              Add a child
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ChildCard
                  child={child}
                  onPlay={handlePlay}
                  onEdit={setEditingChild}
                  onDelete={setDeletingChild}
                  isSwitching={isSwitching}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ChildFormModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
      />

      <ChildFormModal
        isOpen={!!editingChild}
        onClose={() => setEditingChild(null)}
        editingChild={editingChild}
      />

      <ConfirmModal
        isOpen={!!deletingChild}
        onClose={() => setDeletingChild(null)}
        onConfirm={removeChild}
        isLoading={isDeleting}
        title="Remove profile?"
        message={`This will remove ${deletingChild?.firstName}'s profile. Their learning history will be preserved but the profile will no longer be visible.`}
        confirmLabel="Remove"
        isDanger
      />

      <PinModal
        isOpen={!!switchingToChild}
        onClose={() => { setSwitchingToChild(null); setPinError(""); }}
        onSubmit={handlePinSubmit}
        isLoading={isSwitching}
        error={pinError}
      />
    </div>
  );
};

export default DashboardPage;