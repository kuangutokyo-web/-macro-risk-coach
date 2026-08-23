import type { ProgressActivity, VocabularyProgressEvent, WeeklyProgressSummary } from "./types";

function localDateKey(value:string|Date):string {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export function startOfLocalWeek(now:Date):Date { const start = new Date(now.getFullYear(),now.getMonth(),now.getDate()); const day = (start.getDay()+6)%7; start.setDate(start.getDate()-day); return start; }

export function weeklyProgressSummary(activities:ProgressActivity[],events:VocabularyProgressEvent[],now=new Date()):WeeklyProgressSummary {
  const weekStart = startOfLocalWeek(now); const nextWeek = new Date(weekStart); nextWeek.setDate(nextWeek.getDate()+7);
  const inWeek = (value:string) => { const date = new Date(value); return date >= weekStart && date < nextWeek; };
  const weeklyActivities = activities.filter((activity) => inWeek(activity.date)); const weeklyEvents = events.filter((event) => inWeek(event.date));
  const busyResults = weeklyActivities.flatMap((activity) => activity.busy?.results || []); const wrongByCategory = new Map<string,number>();
  for (const result of busyResults) if (!result.correct) wrongByCategory.set(result.category,(wrongByCategory.get(result.category)||0)+1);
  const practiceDates = new Set([...weeklyActivities.map((activity) => localDateKey(activity.date)),...weeklyEvents.filter((event) => event.type === "reviewed").map((event) => localDateKey(event.date))]);
  return {
    daysPracticed:practiceDates.size,
    busyCorrect:busyResults.filter((result) => result.correct).length,
    busyTotal:busyResults.length,
    modeCounts:{normal:weeklyActivities.filter((item) => item.mode === "normal").length,deep:weeklyActivities.filter((item) => item.mode === "deep").length,news:weeklyActivities.filter((item) => item.mode === "news").length,"pnl-mystery":weeklyActivities.filter((item) => item.mode === "pnl-mystery").length},
    vocabularyAdded:weeklyEvents.filter((event) => event.type === "added").reduce((sum,event) => sum+event.count,0),
    vocabularyReviewed:weeklyEvents.filter((event) => event.type === "reviewed").reduce((sum,event) => sum+event.count,0),
    weakTopics:[...wrongByCategory.entries()].map(([category,wrongCount]) => ({category,wrongCount})).toSorted((a,b) => b.wrongCount-a.wrongCount || a.category.localeCompare(b.category)),
  };
}
