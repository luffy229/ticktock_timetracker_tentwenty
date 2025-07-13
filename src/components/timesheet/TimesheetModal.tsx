import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimesheetEntry } from "@/types/timesheet";
import { useToast } from "@/hooks/use-toast";

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimesheetEntry, 'id'>) => void;
  entry?: TimesheetEntry;
  mode: 'add' | 'edit';
}

export const TimesheetModal = ({ isOpen, onClose, onSave, entry, mode }: TimesheetModalProps) => {
  const [formData, setFormData] = useState({
    weekNumber: '',
    startDate: '',
    totalHours: '',
    status: 'incomplete' as TimesheetEntry['status'],
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (entry && mode === 'edit') {
      setFormData({
        weekNumber: entry.weekNumber.toString(),
        startDate: entry.startDate.toISOString().split('T')[0],
        totalHours: entry.totalHours.toString(),
        status: entry.status,
        description: entry.description || '',
      });
    } else {
      // Reset form for add mode
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      setFormData({
        weekNumber: getWeekNumber(today).toString(),
        startDate: startOfWeek.toISOString().split('T')[0],
        totalHours: '',
        status: 'incomplete',
        description: '',
      });
    }
  }, [entry, mode, isOpen]);

  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weekNumber || !formData.startDate || !formData.totalHours) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Fix validation to allow 0 hours (for missing status)
    const totalHours = parseFloat(formData.totalHours);
    if (isNaN(totalHours) || totalHours < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid number of hours (0 or greater)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
    // Implement automatic status calculation based on hours
    const calculatedStatus: TimesheetEntry['status'] = 
      totalHours === 0 ? 'missing' : 
      totalHours >= 40 ? 'completed' : 'incomplete';
    
    const timesheetEntry = {
      weekNumber: parseInt(formData.weekNumber),
      startDate: new Date(formData.startDate),
      totalHours,
      status: calculatedStatus, // Use calculated status instead of form status
      description: formData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

      onSave(timesheetEntry);
      setIsLoading(false);
      onClose();
      
      toast({
        title: "Success",
        description: `Timesheet ${mode === 'add' ? 'added' : 'updated'} successfully`,
      });
    }, 500);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekNumber = getWeekNumber(date);
    setFormData(prev => ({ 
      ...prev, 
      startDate: dateStr,
      weekNumber: weekNumber.toString()
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Timesheet' : 'Edit Timesheet'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new weekly timesheet entry with your work hours.'
              : 'Update your timesheet entry details.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekNumber">Week Number</Label>
              <Input
                id="weekNumber"
                type="number"
                placeholder="e.g., 1"
                value={formData.weekNumber}
                onChange={(e) => handleInputChange('weekNumber', e.target.value)}
                disabled={isLoading}
                min="1"
                max="53"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Week Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleDateChange(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalHours">Total Hours</Label>
              <Input
                id="totalHours"
                type="number"
                placeholder="0"
                value={formData.totalHours}
                onChange={(e) => handleInputChange('totalHours', e.target.value)}
                disabled={isLoading}
                min="0"
                step="0.5"
              />
              <p className="text-xs text-muted-foreground">
                Status will be calculated automatically:
                <br />• 40+ hours = Completed
                <br />• 1-39 hours = Incomplete  
                <br />• 0 hours = Missing
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes or description for this timesheet..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (mode === 'add' ? 'Adding...' : 'Updating...') 
                : (mode === 'add' ? 'Add Timesheet' : 'Update Timesheet')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};