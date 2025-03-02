
// Fix the task assignee references
<div className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
  <User className="h-4 w-4 text-slate-500" />
  <div className="flex flex-col">
    <span className="text-sm font-medium">Assigned To</span>
    <Badge className={getAgentColor(task.assignee as unknown as AgentType)}>
      {task.assignee}
    </Badge>
  </div>
</div>
