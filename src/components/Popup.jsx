import React, { useState } from "react";
import Button from "./Button";

function Popup({setPopupVisible, onScoreUpdate}) {
  const [selectedType, setSelectedType] = useState('normal');

  const deliveryTypes = [
    { label: 'Normal', type: 'normal' },
    { label: 'Wide', type: 'wide' },
    { label: 'No Ball', type: 'noball' },
    { label: 'Bye', type: 'bye' },
    { label: 'Leg Bye', type: 'legbye' },
  ];

  const runs = [0, 1, 2, 3, 4, 5, 6];

  const handleRunClick = (run) => {
    onScoreUpdate({ type: selectedType, runs: run });
    setPopupVisible(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen backdrop-blur-sm flex justify-center items-center z-10">
      <div className="bg-black/50 p-10 rounded-3xl shadow-lg gap-5 flex flex-col lg:gap-10 justify-center items-center w-[80%] lg:w-[50%] md:w-[60%]">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-white text-lg font-semibold">Delivery Type</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {deliveryTypes.map(({ label, type }) => (
              <Button
                key={type}
                label={label}
                variant={selectedType === type ? 'runs' : 'default'}
                onClick={() => setSelectedType(type)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-white text-lg font-semibold">Runs</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {runs.map(run => (
              <Button
                key={run}
                label={run.toString()}
                variant="runs"
                onClick={() => handleRunClick(run)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;
