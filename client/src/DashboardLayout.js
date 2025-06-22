import React from "react";

function DashboardLayout({ sidebar, children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-shrink-0">
        {sidebar}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
