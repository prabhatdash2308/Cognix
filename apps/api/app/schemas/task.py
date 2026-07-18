"""Task schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import AIStatus, TaskPriority, TaskStatus, TaskType
from app.schemas.base import TimestampSchema, UUIDSchema


class LabelBase(BaseModel):
    name: str = Field(..., max_length=100)
    color: str = Field(..., max_length=20)


class LabelCreate(LabelBase):
    project_id: str


class LabelUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    color: str | None = Field(None, max_length=20)


class LabelResponse(LabelBase, UUIDSchema, TimestampSchema):
    project_id: str

    model_config = ConfigDict(from_attributes=True)


class TaskActivityResponse(UUIDSchema):
    task_id: str
    user_id: str
    action: str
    old_value: dict[str, Any] | None = None
    new_value: dict[str, Any] | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskWatcherResponse(UUIDSchema):
    task_id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskBase(BaseModel):
    title: str = Field(..., max_length=500)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    type: TaskType = TaskType.TASK

    parent_task_id: str | None = None
    assignee_id: str | None = None
    reporter_id: str | None = None
    assigned_agent_id: str | None = None

    due_date: datetime | None = None
    start_date: datetime | None = None
    completed_at: datetime | None = None

    estimated_hours: float | None = None
    actual_hours: float | None = None
    position: float = 0.0

    metadata_: dict[str, Any] | None = Field(None, alias="metadata")
    ai_context: dict[str, Any] | None = None
    ai_status: AIStatus = AIStatus.IDLE

    is_recurring: bool = False
    recurrence_rule: str | None = Field(None, max_length=500)
    next_occurrence: datetime | None = None


class TaskCreate(TaskBase):
    project_id: str
    label_ids: list[str] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    title: str | None = Field(None, max_length=500)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    type: TaskType | None = None

    parent_task_id: str | None = None
    assignee_id: str | None = None
    reporter_id: str | None = None
    assigned_agent_id: str | None = None

    due_date: datetime | None = None
    start_date: datetime | None = None
    completed_at: datetime | None = None

    estimated_hours: float | None = None
    actual_hours: float | None = None
    position: float | None = None

    metadata_: dict[str, Any] | None = Field(None, alias="metadata")
    ai_context: dict[str, Any] | None = None
    ai_status: AIStatus | None = None

    is_recurring: bool | None = None
    recurrence_rule: str | None = Field(None, max_length=500)
    next_occurrence: datetime | None = None

    label_ids: list[str] | None = None


class TaskResponse(TaskBase, UUIDSchema, TimestampSchema):
    project_id: str
    labels: list[LabelResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TaskBulkUpdate(BaseModel):
    task_ids: list[str]
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: str | None = None
    label_ids: list[str] | None = None
