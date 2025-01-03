import { useState } from "react";

interface ViewSelectorProps {
  view: string;
  onViewChange: (view: string) => void;
}

export function ViewSelector({ view, onViewChange }: ViewSelectorProps) {
  const [currentView, setCurrentView] = useState(view);

  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
    onViewChange(newView);
  };

  return (
    <div className="flex space-x-4">
      <button
        className={`p-2 ${currentView === "month" ? "font-bold" : ""}`}
        onClick={() => handleViewChange("month")}
      >
        Month
      </button>
      <button
        className={`p-2 ${currentView === "week" ? "font-bold" : ""}`}
        onClick={() => handleViewChange("week")}
      >
        Week
      </button>
      <button
        className={`p-2 ${currentView === "day" ? "font-bold" : ""}`}
        onClick={() => handleViewChange("day")}
      >
        Day
      </button>
    </div>
  );
}
