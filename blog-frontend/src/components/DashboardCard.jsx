// DashboardCard.jsx (Reusable Card Component)

import React from "react";

const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl flex items-center justify-between w-full hover:bg-gray-900 transition-colors duration-200 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="text-4xl text-gray-300">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
