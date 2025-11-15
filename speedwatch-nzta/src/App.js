import React from 'react';
import MapView from './components/MapView';
import { Toaster, toast } from 'sonner';

export default function Home() {
  const handleClearRoute = () => {
    toast.success("Route cleared!");
  };

  return (
    <div className="h-screen flex flex-col">
      <Toaster />
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">SpeedWatch NZTA</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search, Theme Toggle, Settings */}
        </div>
      </header>

      <div className="h-full grid grid-cols-12">
        {/* Map */}
        <div className="col-span-9">
          <MapView cameras={[]} events={[]} />
        </div>

        {/* Sidebar */}
        <div className="col-span-3 border-l p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-bold">Navigation</h2>
          <button className="w-full px-3 py-2 bg-green-600 text-white rounded">
            Set my location
          </button>
          <button
            className="w-full px-3 py-2 bg-red-600 text-white rounded"
            onClick={handleClearRoute}
          >
            Clear route
          </button>

          <label className="block mt-4 text-sm">Mode</label>
          <select className="w-full border rounded px-2 py-1">
            <option>Driving</option>
            <option>Cycling</option>
            <option>Walking</option>
          </select>

          <div className="mt-4 text-sm">
            <p>Estimated: 12.4 km • 15 min</p>
          </div>

          <h3 className="text-md font-semibold mt-6">Waypoints</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Camera #1</span>
              <button className="text-xs px-2 py-1 bg-gray-200 rounded">Remove</button>
            </li>
          </ul>

          <h3 className="text-md font-semibold mt-6">Events</h3>
          <div className="space-y-3">
            <div className="p-2 border rounded">
              <p className="font-semibold">Crash on SH1</p>
              <button className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                Route to event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
