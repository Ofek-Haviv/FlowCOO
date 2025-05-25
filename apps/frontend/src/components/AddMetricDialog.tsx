import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Metric } from "./MetricCard";

interface AddMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (metric: Omit<Metric, 'id' | 'userId'>) => void;
}

export function AddMetricDialog({ open, onOpenChange, onAdd }: AddMetricDialogProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [change, setChange] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      value: Number(value),
      target: Number(target),
      unit,
      trend,
      change: Number(change)
    });
    // Reset form
    setTitle('');
    setValue('');
    setTarget('');
    setUnit('');
    setTrend('stable');
    setChange('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Metric</DialogTitle>
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
            <Button type="submit">Add Metric</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 