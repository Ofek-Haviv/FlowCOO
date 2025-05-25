import { useState } from "react";
import { useMetrics } from "@/hooks/useMetrics";
import { MetricCard, Metric } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddMetricDialog } from "@/components/AddMetricDialog";
import { EditMetricDialog } from "@/components/EditMetricDialog";
import { useToast } from "@/components/ui/use-toast";

export function Metrics() {
  const { user } = useAuth();
  const { metrics, isLoading, error, addMetric, updateMetric, deleteMetric } = useMetrics(user?.id || '');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const { toast } = useToast();

  const handleAddMetric = async (metric: Omit<Metric, 'id' | 'userId'>) => {
    try {
      await addMetric(metric);
      setIsAddDialogOpen(false);
      toast({
        title: "Metric added",
        description: "Your new metric has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add metric. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditMetric = async (metric: Metric) => {
    try {
      await updateMetric(metric.id, metric);
      setEditingMetric(null);
      toast({
        title: "Metric updated",
        description: "Your metric has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update metric. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMetric = async (id: string) => {
    try {
      await deleteMetric(id);
      toast({
        title: "Metric deleted",
        description: "Your metric has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete metric. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  if (error) {
    return <div>Error loading metrics: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Metrics</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Metric
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onEdit={setEditingMetric}
            onDelete={handleDeleteMetric}
          />
        ))}
      </div>

      <AddMetricDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddMetric}
      />

      {editingMetric && (
        <EditMetricDialog
          open={!!editingMetric}
          onOpenChange={(open) => !open && setEditingMetric(null)}
          metric={editingMetric}
          onSave={handleEditMetric}
        />
      )}
    </div>
  );
} 