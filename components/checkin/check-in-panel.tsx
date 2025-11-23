"use client"

import { useState } from "react"
import { X, Check, BookOpen, Briefcase, GraduationCap, Dumbbell, Book, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCalendarStore } from "@/lib/store/calendar-store"
import { CheckInCategory, CheckInCategoryConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

const CHECK_IN_CATEGORIES: CheckInCategoryConfig[] = [
  { id: "study", name: "学习", color: "bg-blue-500", icon: "BookOpen" },
  { id: "work", name: "工作", color: "bg-purple-500", icon: "Briefcase" },
  { id: "exam", name: "复习考试", color: "bg-red-500", icon: "GraduationCap" },
  { id: "exercise", name: "运动", color: "bg-green-500", icon: "Dumbbell" },
  { id: "reading", name: "阅读", color: "bg-yellow-500", icon: "Book" },
  { id: "other", name: "其他", color: "bg-gray-500", icon: "Plus" },
]

const ICON_MAP = {
  BookOpen,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Book,
  Plus,
}

export function CheckInPanel() {
  const { closeCheckInPanel, currentUser, addCheckIn, deleteCheckIn, getCheckInsForMonth } = useCalendarStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMonth, setViewMonth] = useState(new Date())

  const checkIns = getCheckInsForMonth(viewMonth.getFullYear(), viewMonth.getMonth())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(viewMonth)

  const goToPreviousMonth = () => {
    const newDate = new Date(viewMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setViewMonth(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(viewMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setViewMonth(newDate)
  }

  const handleCheckIn = (category: CheckInCategory) => {
    const dateToCheckIn = new Date(selectedDate)
    dateToCheckIn.setHours(0, 0, 0, 0)

    const existingCheckIn = checkIns.find(
      (checkIn) =>
        new Date(checkIn.date).getDate() === dateToCheckIn.getDate() &&
        checkIn.category === category
    )

    if (existingCheckIn) {
      deleteCheckIn(existingCheckIn.id)
    } else {
      addCheckIn({
        id: `checkin-${crypto.randomUUID()}`,
        date: dateToCheckIn,
        category,
        userId: currentUser.id,
      })
    }
  }

  const getCheckInsForDate = (day: number) => {
    return checkIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.date)
      return checkInDate.getDate() === day
    })
  }

  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth.getMonth() &&
      selectedDate.getFullYear() === viewMonth.getFullYear()
    )
  }

  const hasCheckIn = (day: number, category: CheckInCategory) => {
    return checkIns.some((checkIn) => {
      const checkInDate = new Date(checkIn.date)
      return checkInDate.getDate() === day && checkIn.category === category
    })
  }

  const renderCalendar = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth

      if (isValidDay) {
        const dayCheckIns = getCheckInsForDate(dayNumber)
        const isSelected = isDateSelected(dayNumber)

        days.push(
          <button
            key={i}
            onClick={() => {
              const newDate = new Date(viewMonth)
              newDate.setDate(dayNumber)
              setSelectedDate(newDate)
            }}
            className={cn(
              "relative aspect-square rounded-lg border transition-all hover:border-primary/50",
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
            )}
          >
            <div className="absolute top-1 left-1 text-xs font-medium">{dayNumber}</div>
            <div className="flex flex-wrap gap-0.5 items-center justify-center h-full pt-4">
              {dayCheckIns.map((checkIn) => {
                const config = CHECK_IN_CATEGORIES.find((c) => c.id === checkIn.category)
                if (!config) return null
                return (
                  <div
                    key={checkIn.id}
                    className={cn("h-1.5 w-1.5 rounded-full", config.color)}
                    title={config.name}
                  />
                )
              })}
            </div>
          </button>
        )
      } else {
        days.push(<div key={i} className="aspect-square" />)
      }
    }

    return days
  }

  const selectedDateCheckIns = checkIns.filter((checkIn) => {
    const checkInDate = new Date(checkIn.date)
    return (
      checkInDate.getDate() === selectedDate.getDate() &&
      checkInDate.getMonth() === selectedDate.getMonth() &&
      checkInDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl mx-4 bg-background rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeCheckInPanel}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">打卡</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {viewMonth.getFullYear()}年{viewMonth.getMonth() + 1}月
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  上月
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  下月
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </div>

          {/* Check-in Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 打卡
            </h3>

            <div className="space-y-3">
              {CHECK_IN_CATEGORIES.map((category) => {
                const IconComponent = ICON_MAP[category.icon as keyof typeof ICON_MAP]
                const isCheckedIn = selectedDateCheckIns.some((c) => c.category === category.id)

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCheckIn(category.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                      isCheckedIn
                        ? `${category.color} text-white border-transparent`
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                    {isCheckedIn && (
                      <Check className="h-5 w-5 ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-medium mb-2">本月统计</h4>
              <div className="space-y-2">
                {CHECK_IN_CATEGORIES.map((category) => {
                  const count = checkIns.filter((c) => c.category === category.id).length
                  if (count === 0) return null
                  return (
                    <div key={category.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded-full", category.color)} />
                        <span>{category.name}</span>
                      </div>
                      <span className="font-medium">{count}天</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
