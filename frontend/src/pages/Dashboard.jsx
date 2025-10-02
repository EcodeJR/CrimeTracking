import React, { lazy, Suspense, useState } from "react";
import CriminalTable from "../components/CriminalTable";
import SuspectTable from "../components/SuspectTable";
import ComplainantTable from "../components/ComplainantTable";
import DashboardStats from "../components/DashboardStats";

const CriminalForm = lazy(() => import('../components/CriminalForm'));
const SuspectForm = lazy(() => import('../components/SuspectForm'));
const ComplainantForm = lazy(() => import('../components/ComplainantForm'));

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'criminal':
        return <CriminalForm onClose={() => setActiveForm(null)} onUpdate={handleRefresh} />;
      case 'suspect':
        return <SuspectForm onClose={() => setActiveForm(null)} onUpdate={handleRefresh} />;
      case 'complainant':
        return <ComplainantForm onClose={() => setActiveForm(null)} onUpdate={handleRefresh} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dashboard</h1>
      <DashboardStats />
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 m-3">
        <button 
          onClick={() => setActiveForm('criminal')}
          className="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Register Criminal
        </button>
        <button 
          onClick={() => setActiveForm('suspect')}
          className="bg-yellow-600 text-white p-4 rounded-lg shadow hover:bg-yellow-700 transition-colors"
        >
          Register Suspect
        </button>
        <button 
          onClick={() => setActiveForm('complainant')}
          className="bg-green-600 text-white p-4 rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          Register Complainant
        </button>
      </div>

      {/* Modal */}
      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Suspense fallback={<div className="text-center py-4">Loading form...</div>}>
              {renderForm()}
            </Suspense>
          </div>
        </div>
      )}

      <hr className="my-8" />
      <CriminalTable key={`criminal-${refreshTrigger}`} />
      <SuspectTable key={`suspect-${refreshTrigger}`} />
      <ComplainantTable key={`complainant-${refreshTrigger}`} />
    </div>
  );
};

export default Dashboard;