// Modal for creating and editing child profiles.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AvatarDisplay from "./AvatarDisplay";
import { createChild, updateChild, getAvatarOptions } from "@/services/childService";
import useToast from "@/hooks/useToast";
import { clsx } from "clsx";

const ChildFormModal = ({ isOpen, onClose, editingChild = null }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!editingChild;

  const [form, setForm] = useState({
    firstName: "",
    username: "",
    age: "",
    avatar: "explorer",
    dailyTimeLimitMinutes: 60,
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingChild) {
      setForm({
        firstName: editingChild.firstName,
        username: editingChild.username,
        age: editingChild.age,
        avatar: editingChild.avatar,
        dailyTimeLimitMinutes: editingChild.dailyTimeLimitMinutes,
      });
    } else {
      setForm({
        firstName: "",
        username: "",
        age: "",
        avatar: "explorer",
        dailyTimeLimitMinutes: 60,
      });
    }
    setErrors({});
  }, [editingChild, isOpen]);

  const { data: avatarData } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatarOptions,
    staleTime: Infinity, // Avatar list never changes
  });

  const avatars = avatarData?.data?.avatars || [];

  const { mutate, isPending } = useMutation({
    mutationFn: isEditing
      ? (data) => updateChild(editingChild._id, data)
      : createChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success(
        isEditing
          ? `${form.firstName}'s profile updated.`
          : `${form.firstName}'s profile created.`
      );
      onClose();
    },
    onError: (error) => {
      const data = error.response?.data;
      if (data?.errors) {
        const fieldErrors = {};
        data.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutate({
      ...form,
      age: parseInt(form.age),
      dailyTimeLimitMinutes: parseInt(form.dailyTimeLimitMinutes),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-4xl shadow-quest-lg w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="font-display text-2xl text-slate-800">
                  {isEditing ? "Edit profile" : "Add a child"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                {/* Avatar selection */}
                <div>
                  <p className="font-body font-600 text-sm text-slate-700 mb-3">
                    Choose an avatar
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {avatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, avatar: av }))}
                        className={clsx(
                          "rounded-2xl p-1 border-2 transition-all",
                          form.avatar === av
                            ? "border-quest-500 scale-110"
                            : "border-transparent hover:border-quest-200"
                        )}
                      >
                        <AvatarDisplay avatar={av} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />

                {!isEditing && (
                  <Input
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    error={errors.username}
                    helperText="Lowercase letters, numbers, and underscores only"
                    required
                  />
                )}

                <Input
                  label="Age"
                  name="age"
                  type="number"
                  min="6"
                  max="17"
                  value={form.age}
                  onChange={handleChange}
                  error={errors.age}
                  required
                />

                <div>
                  <label className="font-body font-600 text-sm text-slate-700 block mb-1.5">
                    Daily time limit (minutes)
                  </label>
                  <select
                    name="dailyTimeLimitMinutes"
                    value={form.dailyTimeLimitMinutes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-quest-400 focus:ring-2 focus:ring-quest-100 font-body text-slate-800 outline-none transition-all bg-white"
                  >
                    <option value={0}>No limit</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isPending}
                    className="flex-1"
                  >
                    {isEditing ? "Save changes" : "Create profile"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChildFormModal;