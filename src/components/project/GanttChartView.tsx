
// Fix the date handling issue for task positions
const calculateTaskPosition = (task: Task) => {
  // Default values if dates aren't provided
  if (!task.startDate || !task.endDate) {
    return { left: 0, width: 100 };
  }

  try {
    const taskStart = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
    const taskEnd = typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate;
    
    if (!isValid(taskStart) || !isValid(taskEnd)) {
      return { left: 0, width: 100 };
    }

    // Calculate days from the start of the visible range
    const offsetDays = Math.max(0, differenceInDays(taskStart, startDate));
    // Calculate task duration in days
    const durationDays = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
    
    // Convert to percentages for positioning
    const left = (offsetDays / daysToShow) * 100;
    const width = (durationDays / daysToShow) * 100;
    
    // Ensure the task is at least partially visible
    if (left > 100 || left + width < 0) {
      return { left: 0, width: 0 }; // Hide the task
    }
    
    // Adjust width if it extends beyond the visible range
    const adjustedWidth = Math.min(width, 100 - left);
    
    return { left, width: adjustedWidth };
  } catch (error) {
    console.error("Error calculating task position:", error);
    return { left: 0, width: 100 };
  }
};

// Fix date formatting issue
<div className="px-2 text-sm text-slate-500">
  {phase.startDate && phase.endDate && (
    <span className="flex items-center">
      <CalendarIcon className="h-3 w-3 mr-1" />
      {typeof phase.startDate === 'string' ? format(parseISO(phase.startDate), 'MMM d') : format(phase.startDate, 'MMM d')} - 
      {typeof phase.endDate === 'string' ? format(parseISO(phase.endDate), 'MMM d, yyyy') : format(phase.endDate, 'MMM d, yyyy')}
    </span>
  )}
</div>

// Fix task status comparison
<div
  className={cn(
    "absolute top-1 h-6 rounded-md border text-xs flex items-center justify-center px-2 shadow-sm transition-all cursor-pointer hover:brightness-95",
    task.milestone ? "bg-violet-200 border-violet-400" : "bg-blue-200 border-blue-400",
    task.status === 'completed' ? "bg-green-200 border-green-400" : "",
    task.status === 'in progress' ? "bg-amber-200 border-amber-400" : ""
  )}
  style={{
    left: `${left}%`,
    width: `${width}%`,
    minWidth: '30px'
  }}
  onClick={() => onTaskClick?.(task)}
>
