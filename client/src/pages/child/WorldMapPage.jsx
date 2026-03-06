// Kid world map placeholder — full implementation in Step 7.

import useAuthStore from "@/store/authStore";

const WorldMapPage = () => {
  const { currentChild } = useAuthStore();

  return (
    <div className="min-h-screen bg-quest-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-white">
          Welcome, {currentChild?.firstName}!
        </h1>
        <p className="font-body text-quest-300 mt-4">
          The adventure map is coming in Step 7.
        </p>
      </div>
    </div>
  );
};

export default WorldMapPage;