import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TimesheetTable } from "@/components/timesheet/TimesheetTable";
import { TimesheetModal } from "@/components/timesheet/TimesheetModal";
import { WeeklyTimesheetView } from "@/components/timesheet/WeeklyTimesheetView";
import { useAuth } from "@/hooks/useAuth";
import { TimesheetEntry } from "@/types/timesheet";
import { timesheetApi } from "@/api/mockApi";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [viewingEntry, setViewingEntry] = useState<TimesheetEntry | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTimesheets = async () => {
      try {
        setLoading(true);
        const loadedTimesheets = await timesheetApi.getTimesheets();
        setTimesheets(loadedTimesheets);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load timesheets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTimesheets();
  }, [toast]);

  const handleAddTimesheet = () => {
    setEditingEntry(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditTimesheet = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewTimesheet = (entry: TimesheetEntry) => {
    setViewingEntry(entry);
  };

  const handleBackFromView = () => {
    setViewingEntry(undefined);
  };

  const handleSaveTimesheet = async (entryData: Omit<TimesheetEntry, 'id'>) => {
    try {
      setLoading(true);
      
      if (modalMode === 'add') {
        const newEntry = await timesheetApi.createTimesheet(entryData);
        const updatedTimesheets = await timesheetApi.getTimesheets();
        setTimesheets(updatedTimesheets);
        
        toast({
          title: "Success",
          description: "Timesheet created successfully",
        });
      } else if (editingEntry) {
        await timesheetApi.updateTimesheet(editingEntry.id, entryData);
        const updatedTimesheets = await timesheetApi.getTimesheets();
        setTimesheets(updatedTimesheets);
        
        toast({
          title: "Success", 
          description: "Timesheet updated successfully",
        });
      }
      
      setIsModalOpen(false);
      setEditingEntry(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save timesheet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(undefined);
  };

  if (!user) {
    return null; // This shouldn't happen as the app handles auth routing
  }

  if (viewingEntry) {
    return (
      <WeeklyTimesheetView
        entry={viewingEntry}
        onBack={handleBackFromView}
        onSave={async (updatedEntry) => {
          try {
            await timesheetApi.updateTimesheet(updatedEntry.id, updatedEntry);
            const updatedTimesheets = await timesheetApi.getTimesheets();
            setTimesheets(updatedTimesheets);
            setViewingEntry(undefined);
            
            toast({
              title: "Success",
              description: "Timesheet updated successfully",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to update timesheet",
              variant: "destructive",
            });
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={logout} />
      
      <TimesheetTable
        entries={timesheets}
        onAdd={handleAddTimesheet}
        onEdit={handleEditTimesheet}
        onView={handleViewTimesheet}
      />

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTimesheet}
        entry={editingEntry}
        mode={modalMode}
      />
    </div>
  );
};