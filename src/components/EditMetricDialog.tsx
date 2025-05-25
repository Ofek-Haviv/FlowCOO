import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Metric } from "./MetricCard";

interface EditMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: Metric;
  onSave: (metric: Metric) => void;
}

export function EditMetricDialog({ open, onOpenChange, metric, onSave }: EditMetricDialogProps) {
  const [title, setTitle] = useState(metric.title);
  const [value, setValue] = useState(metric.value.toString());
  const [target, setTarget] = useState(metric.target.toString());
  const [unit, setUnit] = useState(metric.unit);
  const [trend, setTrend] = useState(metric.trend);
  const [change, setChange] = useState(metric.change.toString());

  useEffect(() => {
    setTitle(metric.title);
    setValue(metric.value.toString());
    setTarget(metric.target.toString());
    setUnit(metric.unit);
    setTrend(metric.trend);
    setChange(metric.change.toString());
  }, [metric]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...metric,
      title,
      value: Number(value),
      target: Number(target),
      unit,
      trend,
      change: Number(change)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metric</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Current Value</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target Value</Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trend">Trend</Label>
            <Select value={trend} onValueChange={(value: 'up' | 'down' | 'stable') => setTrend(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="change">Change (%)</Label>
            <Input
              id="change"
              type="number"
              value={change}
              onChange={(e) => setChange(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 