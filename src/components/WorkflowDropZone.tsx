import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowDropZoneProps {
  onCreateFlow?: () => void;
}

export const WorkflowDropZone = ({ onCreateFlow }: WorkflowDropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle drop logic here
    onCreateFlow?.();
  };

  return (
    <div
      className={cn(
        "relative min-h-[200px] md:w-[40%] rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
        "flex flex-col items-center justify-center gap-4 p-8",
        isDragOver 
          ? "border-primary bg-workflow-hover" 
          : "border-workflow-border hover:border-muted-foreground hover:bg-workflow-hover"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onCreateFlow}
    >
      <div className={cn(
        "rounded-full p-4 transition-colors",
        isDragOver ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <Plus className="h-8 w-8" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Create New Flow</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {isDragOver 
            ? "Drop here to create your workflow" 
            : "Build a custom CRM workflow"
          }
        </p>
      </div>
    </div>
  );
};