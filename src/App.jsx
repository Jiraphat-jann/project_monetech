import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';

// Views
import LoginView from './views/LoginView';
import ForgotPasswordView from './views/ForgotPasswordView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import ExpenseView from './views/ExpenseView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import ReportView from './views/ReportView';
import AboutView from './views/AboutView';
import GoalsView from './views/GoalsView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  
  // State เก็บรายการที่บันทึกจากสลิป
  const [transactions, setTransactions] = useState([]);

  const mainTabs = ['home', 'goals'];

  // ฟังก์ชันรับรายการสลิปใหม่
  const handleAddExpense = (newExpense) => {
    setTransactions((prev) => [newExpense, ...prev]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': 
        return <LoginView onNavigate={setCurrentScreen} />;
      case 'forgot-password': 
        return <ForgotPasswordView onNavigate={setCurrentScreen} />;
      case 'register': 
        return <RegisterView onNavigate={setCurrentScreen} />;
      case 'home': 
        return (
          <HomeView 
            onNavigate={setCurrentScreen} 
            transactions={transactions} 
          />
        );
      case 'expense': 
        return (
          <ExpenseView 
            onNavigate={setCurrentScreen} 
            onAddExpense={handleAddExpense} 
          />
        );
      case 'profile': 
        return <ProfileView onNavigate={setCurrentScreen} />;
      case 'settings': 
        return <SettingsView onNavigate={setCurrentScreen} />;
      case 'report': 
        return <ReportView onNavigate={setCurrentScreen} transactions={transactions} />;
      case 'about': 
        return <AboutView onNavigate={setCurrentScreen} />;
      case 'goals': 
        return <GoalsView onNavigate={setCurrentScreen} />;
      default: 
        return <LoginView onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen sm:p-4 bg-slate-100 font-['Prompt',sans-serif]">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:max-h-[900px] sm:rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col border-0 sm:border-[8px] sm:border-slate-800">
        <StatusBar />
        
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          {renderScreen()}
        </div>

        {mainTabs.includes(currentScreen) && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}

        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-1.5 shrink-0 z-50 pointer-events-none"></div>
      </div>
    </div>
  );
}