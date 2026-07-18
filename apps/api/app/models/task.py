"""Task model and related entities."""

from __future__ import annotations

import enum
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class TaskStatus(enum.StrEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    BLOCKED = "blocked"
    DONE = "done"
    CANCELLED = "cancelled"


class TaskPriority(enum.StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskType(enum.StrEnum):
    TASK = "task"
    BUG = "bug"
    FEATURE = "feature"
    EPIC = "epic"
    STORY = "story"
    SUBTASK = "subtask"


class AIStatus(enum.StrEnum):
    IDLE = "idle"
    PLANNING = "planning"
    RUNNING = "running"
    WAITING = "waiting"
    FAILED = "failed"
    COMPLETED = "completed"


class Task(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A task within a project."""

    __tablename__ = "tasks"

    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    parent_task_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("tasks.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status", native_enum=False),
        nullable=False,
        default=TaskStatus.TODO,
        index=True,
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority", native_enum=False),
        nullable=False,
        default=TaskPriority.MEDIUM,
    )
    type: Mapped[TaskType] = mapped_column(
        Enum(TaskType, name="task_type", native_enum=False),
        nullable=False,
        default=TaskType.TASK,
    )

    assignee_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    reporter_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    assigned_agent_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("agents.id", ondelete="SET NULL"), nullable=True
    )

    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    estimated_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    position: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True, default=dict)
    ai_context: Mapped[dict | None] = mapped_column(JSONB, nullable=True, default=dict)
    ai_status: Mapped[AIStatus] = mapped_column(
        Enum(AIStatus, name="ai_status", native_enum=False),
        nullable=False,
        default=AIStatus.IDLE,
    )

    is_recurring: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    recurrence_rule: Mapped[str | None] = mapped_column(String(500), nullable=True)
    next_occurrence: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped[Project] = relationship(back_populates="tasks")  # type: ignore[name-defined]  # noqa: F821
    parent_task: Mapped[Task] = relationship(back_populates="subtasks", remote_side="Task.id")
    subtasks: Mapped[list[Task]] = relationship(
        back_populates="parent_task", cascade="all, delete-orphan"
    )

    assignee: Mapped[User] = relationship(foreign_keys=[assignee_id])  # type: ignore[name-defined]  # noqa: F821
    reporter: Mapped[User] = relationship(foreign_keys=[reporter_id])  # type: ignore[name-defined]  # noqa: F821
    assigned_agent: Mapped[Agent] = relationship()  # type: ignore[name-defined]  # noqa: F821

    labels: Mapped[list[TaskLabel]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )
    activities: Mapped[list[TaskActivity]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )
    watchers: Mapped[list[TaskWatcher]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id!r} status={self.status.value!r} title={self.title!r}>"


class Label(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A label within a project."""

    __tablename__ = "labels"

    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    color: Mapped[str] = mapped_column(String(20), nullable=False)

    project: Mapped[Project] = relationship(back_populates="labels")  # type: ignore[name-defined]  # noqa: F821
    task_labels: Mapped[list[TaskLabel]] = relationship(
        back_populates="label", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Label name={self.name!r} color={self.color!r}>"


class TaskLabel(UUIDPrimaryKeyMixin, Base):
    """Many-to-many relationship between Tasks and Labels."""

    __tablename__ = "task_labels"

    task_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
    )
    label_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("labels.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )

    task: Mapped[Task] = relationship(back_populates="labels")
    label: Mapped[Label] = relationship(back_populates="task_labels")

    def __repr__(self) -> str:
        return f"<TaskLabel task_id={self.task_id!r} label_id={self.label_id!r}>"


class TaskActivity(UUIDPrimaryKeyMixin, Base):
    """Activity/audit log for a task."""

    __tablename__ = "task_activities"

    task_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)

    old_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    new_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )

    task: Mapped[Task] = relationship(back_populates="activities")
    user: Mapped[User] = relationship()  # type: ignore[name-defined]  # noqa: F821

    def __repr__(self) -> str:
        return f"<TaskActivity action={self.action!r} task_id={self.task_id!r}>"


class TaskWatcher(UUIDPrimaryKeyMixin, Base):
    """A user watching a task."""

    __tablename__ = "task_watchers"

    task_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )

    task: Mapped[Task] = relationship(back_populates="watchers")
    user: Mapped[User] = relationship()  # type: ignore[name-defined]  # noqa: F821

    def __repr__(self) -> str:
        return f"<TaskWatcher task_id={self.task_id!r} user_id={self.user_id!r}>"
