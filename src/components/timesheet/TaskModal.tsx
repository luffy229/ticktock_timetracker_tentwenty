import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    project: string;
    workType: string;
    description: string;
    hours: number;
  }) => void;
  editTask?: {
    id: string;
    description: string;
    hours: number;
    projectHours: number;
  } | null;
}

export const TaskModal = ({ isOpen, onClose, onSave, editTask }: TaskModalProps) => {
  const [project, setProject] = useState("");
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);

  // Reset form when modal opens/closes or edit task changes
  useEffect(() => {
    if (isOpen && editTask) {
      // Pre-populate form for editing
      setProject("homepage-dev"); // Default since we don't store project in task
      setWorkType("feature-development"); // Default since we don't store work type in task
      setDescription(editTask.description);
      setHours(editTask.hours);
    } else if (isOpen && !editTask) {
      // Reset form for new task
      setProject("");
      setWorkType("");
      setDescription("");
      setHours(0);
    }
  }, [isOpen, editTask]);

  const handleSave = () => {
    if (!project || !workType || !description) return;
    
    onSave({
      project,
      workType,
      description,
      hours
    });
    
    // Reset form
    setProject("");
    setWorkType("");
    setDescription("");
    setHours(0);
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setProject("");
    setWorkType("");
    setDescription("");
    setHours(0);
    onClose();
  };

  const incrementHours = () => setHours(prev => prev + 0.5);
  const decrementHours = () => setHours(prev => Math.max(0, prev - 0.5));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-foreground">
            {editTask ? "Edit Entry" : "Add New Entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project" className="text-sm font-medium text-foreground">
              Select Project <span className="text-destructive">*</span>
            </Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Project Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homepage-dev">Homepage Development</SelectItem>
                <SelectItem value="mobile-app">Mobile App</SelectItem>
                <SelectItem value="api-integration">API Integration</SelectItem>
                <SelectItem value="ui-design">UI Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type of Work */}
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium text-foreground">
              Type of Work <span className="text-destructive">*</span>
            </Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug-fixes">Bug fixes</SelectItem>
                <SelectItem value="feature-development">Feature Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="code-review">Code Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Task description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Write task here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Hours <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={decrementHours}
                disabled={hours <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-20 text-center"
                step="0.5"
                min="0"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={incrementHours}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={!project || !workType || !description}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {editTask ? "Update entry" : "Add entry"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};