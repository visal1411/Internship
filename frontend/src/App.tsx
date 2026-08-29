import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './hooks/useLanguage';
import {
  LayoutDashboard,
  Scale,
  Settings as SettingsIcon,
  Search,
  Bell,
  Globe,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Wifi
} from 'lucide-react';
import logoImg from './assets/custom-logo.jpg';
import cowIcon from './assets/cow.png';
import { Home } from './pages/Home';
import { Devices, Scale as ScaleInterface } from './pages/Devices';
import { Herd } from './pages/Herd';
import { Settings } from './pages/Settings';
import { NavItem } from './components/NavItem';

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeScaleId, setActiveScaleId] = useState<string | null>(null);
  const [weighingCowId, setWeighingCowId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const navigateToScale = (scaleId: string, cowId?: string) => {
    setActiveScaleId(scaleId);
    setWeighingCowId(cowId || null);
    setActiveTab('devices');
  };
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage } = useLanguage();
  
  const [scalesData, setScalesData] = useState<ScaleInterface[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'TAG-8921 is overweight (1450 lbs)', time: '10 mins ago' },
    { id: 2, type: 'error', text: 'Scale SCALE-02 is offline', time: '1 hour ago' },
    { id: 3, type: 'info', text: 'Weekly report generated successfully', time: '2 hours ago' },
  ]);

  // Polling logic for when ESP32 or hardware connects
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/devices');
        if (!res.ok) return;
        const rawDevices = await res.json();
        const newScales: ScaleInterface[] = rawDevices.map((d: any) => ({
          id: d.deviceId || d.id,
          name: d.name || 'Unknown Device',
          status: d.status || 'offline',
          battery: d.battery || 100,
          lastSync: d.lastSeen ? new Date(d.lastSeen).toLocaleTimeString() : 'Unknown',
          currentReading: d.currentReading || '0 lbs'
        }));
        
        setScalesData(prevScales => {
          // Check for newly added devices
          newScales.forEach(newScale => {
            const exists = prevScales.find(s => s.id === newScale.id);
            if (!exists) {
              // Trigger Toast Notification
              setToastMessage(`New device connected: ${newScale.name}`);
              setTimeout(() => setToastMessage(null), 5000);
              
              // Add to notification center
              setNotifications(prev => [
                {
                  id: Date.now(),
                  type: 'info',
                  text: `New device connected: ${newScale.name} (${newScale.id})`,
                  time: 'Just now'
                },
                ...prev
              ]);
            }
          });
          return newScales;
        });
      } catch (err) {
        // Silent fail on polling if backend isn't up
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleRemoveDevice = async (id: string) => {
    // Optimistic update
    setScalesData(prev => prev.filter(scale => scale.id !== id));
    setToastMessage("Device removed successfully");
    setTimeout(() => setToastMessage(null), 3000);
    
    try {
      await fetch(`/api/devices/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete device', err);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} flex font-sans transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex-shrink-0 hidden md:flex flex-col transition-colors duration-200`}>
        <div className={`h-16 flex items-center px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <img src={logoImg} alt="CowFit Logo" className="h-12 w-12 object-cover mr-3 rounded-full shadow-sm" />
          <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight font-sans`}>CowFit</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label={t('nav.home')} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<div className="w-5 h-5 bg-current" style={{ WebkitMaskImage: `url(${cowIcon})`, maskImage: `url(${cowIcon})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />} label={t('nav.herd')} active={activeTab === 'herd'} onClick={() => setActiveTab('herd')} />
          <NavItem icon={<Scale size={20} />} label={t('nav.devices')} active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} />
          <NavItem icon={<SettingsIcon size={20} />} label={t('nav.settings')} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`} onClick={() => setActiveTab('settings')}>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
              JD
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sal The Butcher</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farm Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className={`h-16 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-6 lg:px-10 flex-shrink-0 transition-colors duration-200`}>
          <div className={`flex items-center text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} font-sans`}>
            {activeTab === 'home' && t('dashboard.overview')}
            {activeTab === 'devices' && t('nav.devices')}
            {activeTab === 'herd' && t('nav.herd')}
            {activeTab === 'settings' && t('nav.settings')}
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors mr-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <Globe className="w-4 h-4" />
              <span>{currentLanguage === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            <div className="relative hidden sm:block">
              <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                className={`pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 font-sans transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                className={`relative p-2 transition-colors rounded-full ${showNotifications ? (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700') : (isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50')}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border overflow-hidden z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">{notifications.length} new</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`p-4 transition-colors cursor-pointer flex gap-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notif.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                              notif.type === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {notif.type === 'error' || notif.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{notif.text}</p>
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No new notifications
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className={`p-3 border-t text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button className="text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300">Mark all as read</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-10 mb-16 md:mb-0">
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
            {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
            {activeTab === 'devices' && <Devices scalesData={scalesData} onRemoveDevice={handleRemoveDevice} activeScaleId={activeScaleId} setActiveScaleId={setActiveScaleId} weighingCowId={weighingCowId} setWeighingCowId={setWeighingCowId} />}
            {activeTab === 'herd' && <Herd onNavigateToScale={navigateToScale} />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t flex items-center justify-around z-50 transition-colors duration-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}>
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'home' ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">{t('nav.dashboard', 'Home')}</span>
        </button>
        <button onClick={() => setActiveTab('herd')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'herd' ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="w-5 h-5 bg-current" style={{ WebkitMaskImage: `url(${cowIcon})`, maskImage: `url(${cowIcon})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
          <span className="text-[10px] font-medium">{t('nav.herd', 'Herd')}</span>
        </button>
        <button onClick={() => setActiveTab('devices')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'devices' ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Wifi size={20} />
          <span className="text-[10px] font-medium">{t('nav.devices', 'Devices')}</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'settings' ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <SettingsIcon size={20} />
          <span className="text-[10px] font-medium">{t('nav.settings', 'Settings')}</span>
        </button>
      </div>
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-lg font-medium flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}


