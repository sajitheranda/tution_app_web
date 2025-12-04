'use client'

export default function ClassSchedule() {
  const schedule = [
    { day: 'Monday', time: '4:00 PM - 6:00 PM', subject: 'Mathematics' },
    { day: 'Wednesday', time: '4:00 PM - 6:00 PM', subject: 'Science' },
    { day: 'Friday', time: '4:00 PM - 6:00 PM', subject: 'English' },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Class Schedule</h2>
      
      <div className="grid gap-4">
        {schedule.map((classItem, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{classItem.day}</h3>
                <p className="text-gray-600">{classItem.time}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {classItem.subject}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}