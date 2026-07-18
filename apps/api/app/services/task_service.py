"""Task service."""

from collections.abc import Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.task import Task, TaskActivity, TaskLabel
from app.schemas.task import TaskBulkUpdate, TaskCreate, TaskUpdate


class TaskService:
    """Service for managing tasks."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, task_id: str) -> Task | None:
        """Get a task by ID."""
        stmt = (
            select(Task)
            .where(Task.id == task_id)
            .options(
                selectinload(Task.labels).selectinload(TaskLabel.label),
                selectinload(Task.assignee),
                selectinload(Task.reporter),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_project(self, project_id: str) -> Sequence[Task]:
        """Get all tasks for a project."""
        stmt = (
            select(Task)
            .where(Task.project_id == project_id)
            .options(
                selectinload(Task.labels).selectinload(TaskLabel.label),
                selectinload(Task.assignee),
                selectinload(Task.reporter),
            )
            .order_by(Task.position.asc(), Task.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, user_id: str, data: TaskCreate) -> Task:
        """Create a new task."""
        task = Task(
            project_id=data.project_id,
            title=data.title,
            description=data.description,
            status=data.status,
            priority=data.priority,
            type=data.type,
            parent_task_id=data.parent_task_id,
            assignee_id=data.assignee_id,
            reporter_id=data.reporter_id or user_id,
            assigned_agent_id=data.assigned_agent_id,
            due_date=data.due_date,
            start_date=data.start_date,
            completed_at=data.completed_at,
            estimated_hours=data.estimated_hours,
            actual_hours=data.actual_hours,
            position=data.position,
            metadata_=data.metadata_,
            ai_context=data.ai_context,
            ai_status=data.ai_status,
            is_recurring=data.is_recurring,
            recurrence_rule=data.recurrence_rule,
            next_occurrence=data.next_occurrence,
        )
        self.session.add(task)
        await self.session.flush()

        if data.label_ids:
            for label_id in data.label_ids:
                task_label = TaskLabel(task_id=task.id, label_id=label_id)
                self.session.add(task_label)

        # Activity log
        activity = TaskActivity(
            task_id=task.id,
            user_id=user_id,
            action="created",
        )
        self.session.add(activity)

        await self.session.commit()
        return await self.get_by_id(task.id)

    async def update(self, user_id: str, task_id: str, data: TaskUpdate) -> Task | None:
        """Update a task."""
        task = await self.get_by_id(task_id)
        if not task:
            return None

        update_data = data.model_dump(exclude_unset=True, exclude={"label_ids"})

        # Log activity for major changes
        old_values = {}
        new_values = {}
        for key, value in update_data.items():
            if key == "metadata_":
                key = "metadata"
            old_val = getattr(task, key) if key != "metadata" else task.metadata_
            if old_val != value:
                old_values[key] = str(old_val)
                new_values[key] = str(value)
                if key == "metadata":
                    task.metadata_ = value
                else:
                    setattr(task, key, value)

        if data.label_ids is not None:
            # Delete old labels
            for tl in list(task.labels):
                await self.session.delete(tl)
            # Add new labels
            for label_id in data.label_ids:
                task_label = TaskLabel(task_id=task.id, label_id=label_id)
                self.session.add(task_label)

        if old_values or new_values:
            activity = TaskActivity(
                task_id=task.id,
                user_id=user_id,
                action="updated",
                old_value=old_values,
                new_value=new_values,
            )
            self.session.add(activity)

        await self.session.commit()
        return await self.get_by_id(task.id)

    async def delete(self, user_id: str, task_id: str) -> bool:
        """Delete a task."""
        task = await self.get_by_id(task_id)
        if not task:
            return False

        await self.session.delete(task)
        await self.session.commit()
        return True

    async def bulk_update(self, user_id: str, data: TaskBulkUpdate) -> Sequence[Task]:
        """Update multiple tasks at once."""
        stmt = update(Task).where(Task.id.in_(data.task_ids))

        update_data = {}
        if data.status is not None:
            update_data["status"] = data.status
        if data.priority is not None:
            update_data["priority"] = data.priority
        if data.assignee_id is not None:
            update_data["assignee_id"] = data.assignee_id

        if update_data:
            stmt = stmt.values(**update_data)
            await self.session.execute(stmt)

            # Note: We don't log bulk updates to activities for now to save DB load

        await self.session.commit()

        # Return updated tasks
        sel_stmt = (
            select(Task)
            .where(Task.id.in_(data.task_ids))
            .options(
                selectinload(Task.labels).selectinload(TaskLabel.label),
                selectinload(Task.assignee),
                selectinload(Task.reporter),
            )
        )
        result = await self.session.execute(sel_stmt)
        return result.scalars().all()
