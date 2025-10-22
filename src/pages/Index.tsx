import { useState } from "react";
import Sidebar from "@/components/Navigation/Sidebar";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import PasswordAnalyzer from "@/components/PasswordAnalyzer/PasswordAnalyzer";
import BatchAnalyzer from "@/components/BatchAnalyzer/BatchAnalyzer";
import PasswordGenerator from "@/components/PasswordGenerator/PasswordGenerator";
import BreachChecker from "@/components/BreachChecker/BreachChecker";
import PolicyRecommendations from "@/components/PolicyRecommendations/PolicyRecommendations";
import PolicyBuilder from "@/components/PolicyBuilder/PolicyBuilder";
import ComplianceChecker from "@/components/ComplianceChecker/ComplianceChecker";
import AuditReports from "@/components/AuditReports/AuditReports";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "analyzer":
        return <PasswordAnalyzer />;
      case "batch":
        return <BatchAnalyzer />;
      case "generator":
        return <PasswordGenerator />;
      case "breach":
        return <BreachChecker />;
      case "policy":
        return <PolicyRecommendations />;
      case "builder":
        return <PolicyBuilder />;
      case "compliance":
        return <ComplianceChecker />;
      case "audit":
        return <AuditReports />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="container mx-auto p-8 max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
