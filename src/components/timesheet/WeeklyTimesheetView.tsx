import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TimesheetEntry } from "@/types/timesheet";
import { ChevronLeft, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskModal } from "./TaskModal";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface WeeklyTimesheetViewProps {
  entry: TimesheetEntry;
  onBack: () => void;
  onSave: (updatedEntry: TimesheetEntry) => void;
}

interface TaskEntry {
  id: string;
  description: string;
  hours: number;
  projectHours: number;
}

export const WeeklyTimesheetView = ({ entry, onBack, onSave }: WeeklyTimesheetViewProps) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<TaskEntry | null>(null);

  const [weekData, setWeekData] = useState(() => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(entry.startDate);
      date.setDate(entry.startDate.getDate() + i);
      days.push({
        date,
        tasks: [
          {
            id: `task-${i}-1`,
            description: "Homepage Development",
            hours: 8,
            projectHours: 8,
          },
          {
            id: `task-${i}-2`,
            description: "Homepage Development",
            hours: 2,
            projectHours: 2,
          },
        ] as TaskEntry[],
      });
    }
    return days;
  });

  // Lenis + GSAP animation effect
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Title animation
    gsap.from(".timesheet-title", {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out",
    });

    // Scroll animation for each day
    gsap.utils.toArray(".timesheet-day").forEach((el: any, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.05,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatDateHeader = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  const handleAddNewTask = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (dayIndex: number, task: TaskEntry) => {
    setSelectedDayIndex(dayIndex);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: {
    project: string;
    workType: string;
    description: string;
    hours: number;
  }) => {
    if (selectedDayIndex === null) return;

    if (editingTask) {
      setWeekData((prev) => {
        const updated = [...prev];
        const taskIndex = updated[selectedDayIndex].tasks.findIndex(
          (t) => t.id === editingTask.id
        );
        if (taskIndex !== -1) {
          updated[selectedDayIndex].tasks[taskIndex] = {
            ...updated[selectedDayIndex].tasks[taskIndex],
            description: taskData.description,
            hours: taskData.hours,
            projectHours: taskData.hours,
          };
        }
        return updated;
      });
    } else {
      const newTask: TaskEntry = {
        id: `task-${selectedDayIndex}-${Date.now()}`,
        description: taskData.description,
        hours: taskData.hours,
        projectHours: taskData.hours,
      };

      setWeekData((prev) => {
        const updated = [...prev];
        updated[selectedDayIndex].tasks.push(newTask);
        return updated;
      });
    }
  };

  const updateTask = (
    dayIndex: number,
    taskId: string,
    field: keyof TaskEntry,
    value: string | number
  ) => {
    setWeekData((prev) => {
      const updated = [...prev];
      const taskIndex = updated[dayIndex].tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        updated[dayIndex].tasks[taskIndex] = {
          ...updated[dayIndex].tasks[taskIndex],
          [field]: value,
        };
      }
      return updated;
    });
  };

  const deleteTask = (dayIndex: number, taskId: string) => {
    setWeekData((prev) => {
      const updated = [...prev];
      updated[dayIndex].tasks = updated[dayIndex].tasks.filter((t) => t.id !== taskId);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2 sm:mr-4 p-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-normal text-foreground timesheet-title">
            This week's timesheet
          </h1>
        </div>

        <Card className="border-2 border-primary bg-card">
          <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                {formatDateHeader(entry.startDate)}
              </h2>
              <div className="text-sm text-muted-foreground">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  {entry.totalHours}/40 hrs
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {weekData.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="timesheet-day border-b border-border pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{formatDate(day.date)}</h3>
                  </div>

                  <div className="space-y-2">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 group p-2 sm:p-0"
                      >
                        <div className="flex-1">
                          <Input
                            value={task.description}
                            onChange={(e) =>
                              updateTask(dayIndex, task.id, "description", e.target.value)
                            }
                            className="w-full border-0 bg-blue-50 h-8 text-sm"
                            placeholder="Task description"
                          />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={task.hours}
                              onChange={(e) =>
                                updateTask(
                                  dayIndex,
                                  task.id,
                                  "hours",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 border-0 bg-blue-50 h-8 text-sm text-center"
                              placeholder="0"
                              step="0.5"
                              min="0"
                            />
                            <span className="text-xs text-muted-foreground">hrs</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-xs text-primary hidden sm:inline">
                              Project Name
                            </span>
                            <span className="text-xs text-primary sm:hidden">PH</span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTask(dayIndex, task)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteTask(dayIndex, task.id)}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      onClick={() => handleAddNewTask(dayIndex)}
                      className="w-full h-8 text-primary hover:text-primary hover:bg-primary/10 justify-start text-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add new task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 tentwenty™. All rights reserved.
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedDayIndex(null);
          setEditingTask(null);
        }}
        onSave={handleTaskSave}
        editTask={editingTask}
      />
    </div>
  );
};
