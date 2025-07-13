
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Eye, Plus } from "lucide-react";
import { TimesheetEntry } from "@/types/timesheet";

interface TimesheetTableProps {
  entries: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onView: (entry: TimesheetEntry) => void;
  onAdd: () => void;
}

const getStatusDisplay = (status: TimesheetEntry['status'], hours: number) => {
  const statusConfig = {
    completed: { 
      label: "COMPLETED", 
      className: "bg-completed text-completed-foreground border-0 text-xs font-medium px-2 py-1 rounded-sm"
    },
    incomplete: { 
      label: "INCOMPLETE", 
      className: "bg-incomplete text-incomplete-foreground border-0 text-xs font-medium px-2 py-1 rounded-sm"
    },
    missing: { 
      label: "MISSING", 
      className: "bg-missing text-missing-foreground border-0 text-xs font-medium px-2 py-1 rounded-sm"
    },
  };
  
  const config = statusConfig[status];
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const getActionButton = (entry: TimesheetEntry, onView: (entry: TimesheetEntry) => void) => {
  switch (entry.status) {
    case 'completed':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(entry)}
          className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 text-sm"
        >
          
          View
        </Button>
      );
    case 'incomplete':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(entry)}
          className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 text-sm"
        >
          
          Update
        </Button>
      );
    case 'missing':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(entry)}
          className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 text-sm"
        >
          
          Create
        </Button>
      );
    default:
      return null;
  }
};

export const TimesheetTable = ({ entries, onEdit, onView, onAdd }: TimesheetTableProps) => {
  const formatDateRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startStr = startDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const endStr = endDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="bg-background">
      <div className="px-6 py-6">
        <h2 className="text-xl font-normal text-foreground mb-2">Your Timesheets</h2>
        
        <div className="bg-card border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  WEEK #
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  DATE
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  STATUS
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground py-3 px-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <TableCell className="py-4 px-4 text-sm font-medium text-foreground">
                    {entry.weekNumber}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm text-foreground">
                    {formatDateRange(entry.startDate)}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    {getStatusDisplay(entry.status, entry.totalHours)}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {getActionButton(entry, onView)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 tentwenty™. All rights reserved.
        </div>  
      </div>
    </div>
  );
};
