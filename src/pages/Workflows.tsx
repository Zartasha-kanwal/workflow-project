import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/MetricCard";
import { WorkflowDropZone } from "@/components/WorkflowDropZone";
import { Plus, BarChart3, Play, Users, Mail, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Workflows = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateFlow = () => {
    navigate('/flow-builder');
  };

  const handleBrowseTemplates = () => {
    navigate('/templates');
  };

  const handleSaveFlow = () => {
    toast({
      title: "Flow Saved",
      description: "Your workflow has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Marketing Flows</h1>
            <p className="text-lg text-muted-foreground">
              Automate your marketing with powerful workflows
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBrowseTemplates} className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Browse Templates
            </Button>
            <Button onClick={handleCreateFlow} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Flow
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Active Flows"
            value="0"
            subtitle="0 inactive"
            icon={Play}
            color="success"
          />
          <MetricCard
            title="Total Contacts"
            value="4"
            subtitle="Across all flows"
            icon={Users}
            color="info"
          />
          <MetricCard
            title="Engagement Rate"
            value="68%"
            subtitle="Last 30 days"
            icon={Mail}
            color="warning"
          />
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search flows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Workflow Drop Zone */}
        <WorkflowDropZone onCreateFlow={handleCreateFlow} />
      </div>
    </div>
  );
};

export default Workflows;