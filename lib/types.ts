export type TaskType = "daily" | "meeting" | "vacation"

export interface Task {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  type: TaskType
  projectId: string
  userId: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  memberIds: string[]
  createdAt: Date
}

export interface User {
  id: string
  name: string
  avatar: string
  email: string
}

export interface CalendarSettings {
  rememberLastProject: boolean
  lastSelectedProjectId?: string
}

export type CheckInCategory = "study" | "work" | "exam" | "exercise" | "reading" | "other"

export interface CheckInRecord {
  id: string
  date: Date
  category: CheckInCategory
  note?: string
  userId: string
}

export interface CheckInCategoryConfig {
  id: CheckInCategory
  name: string
  color: string
  icon: string
}
