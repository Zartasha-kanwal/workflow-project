"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";
import { WorkflowDropZone } from "@/components/WorkflowDropZone";
import {
  Plus,
  BarChart3,
  Play,
  Users,
  Mail,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SavedFlow {
  id: string;
  name: string;
  created: string;
  nodeCount: number;
  connectionCount: number;
  nodes: any[];
  edges: any[];
}

const getSavedFlows = (): SavedFlow[] => {
  if (typeof window === "undefined") return [];
  try {
    const flows = localStorage.getItem("saved-flows");
    return flows ? JSON.parse(flows) : [];
  } catch {
    return [];
  }
};

const Workflows = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedFlows, setSavedFlows] = useState<SavedFlow[]>([]);

  useEffect(() => {
    const loadFlows = () => setSavedFlows(getSavedFlows());
    loadFlows();

    const handleFlowSaved = () => loadFlows();
    window.addEventListener("flowSaved", handleFlowSaved);
    return () => window.removeEventListener("flowSaved", handleFlowSaved);
  }, []);

  const handleCreateFlow = () => {
    navigate("/flow-builder");
  };

  const handleBrowseTemplates = () => {
    navigate("/templates");
  };

  const handleEditFlow = (flow: SavedFlow) => {
    navigate("/flow-builder", { state: { flow } });
  };

  const handleDeleteFlow = (flowId: string) => {
    const updatedFlows = savedFlows.filter((flow) => flow.id !== flowId);
    localStorage.setItem("saved-flows", JSON.stringify(updatedFlows));
    setSavedFlows(updatedFlows);
    toast({
      title: "Flow Deleted",
      description: "Flow has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Marketing Flows
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Automate your marketing with powerful workflows
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleBrowseTemplates}
              className="gap-2 bg-transparent"
            >
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
            value={savedFlows.length.toString()}
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

        {/* Search */}
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search flows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Workflow Drop Zone */}
           <WorkflowDropZone onCreateFlow={handleCreateFlow} />

          {/* Saved Flows */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Saved Flows
              </h3>
              {savedFlows.length > 0 && (
                <Badge variant="secondary" className="w-fit sm:w-auto">
                  {savedFlows.length} flow{savedFlows.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {savedFlows.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm font-medium">
                      No saved flows yet
                    </div>
                    <div className="text-xs">
                      Create and save your first flow to see it here
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedFlows.map((flow) => (
                  <Card
                    key={flow.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium truncate">
                          {flow.name}
                        </CardTitle>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditFlow(flow)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteFlow(flow.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span>{flow.nodeCount} nodes</span>
                        <span>{flow.connectionCount} connections</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Created {new Date(flow.created).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
