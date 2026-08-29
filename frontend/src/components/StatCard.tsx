import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ArrowUpRight, ArrowDownRight, Eye, Download } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
  isAlert?: boolean;
  onExport?: () => void;
  onViewDetails?: () => void;
}

export function StatCard({ title, value, trend, trendUp, icon, color, isAlert = false, onExport, onViewDetails }: StatCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm transition-colors ${isAlert ? 'border-red-300 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 rounded-md transition-colors ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <MoreVertical size={20} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onViewDetails?.();
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Eye size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
                View Details
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onExport?.();
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Download size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
                Export Data
              </button>
            </div>
          )}
        </div>
      </div>
      <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
      <div className="mt-3 flex items-center text-sm">
        <span className={`flex items-center font-medium ${isAlert ? 'text-red-600 dark:text-red-400' : (trendUp ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400')
          }`}>
          {trendUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {trend}
        </span>
      </div>
    </div>
  );
}
