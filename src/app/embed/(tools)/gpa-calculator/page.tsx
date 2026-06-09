"use client"
import { useState } from "react"

const GRADES: { label: string; points: number }[] = [
  { label: "A+", points: 4.0 },
  { label: "A",  points: 4.0 },
  { label: "A-", points: 3.7 },
  { label: "B+", points: 3.3 },
  { label: "B",  points: 3.0 },
  { label: "B-", points: 2.7 },
  { label: "C+", points: 2.3 },
  { label: "C",  points: 2.0 },
  { label: "C-", points: 1.7 },
  { label: "D",  points: 1.0 },
  { label: "F",  points: 0.0 },
]

interface Course {
  id: number
  name: string
  grade: string
  credits: string
}

let nextId = 5

function makeCourse(id: number): Course {
  return { id, name: "", grade: "A", credits: "3" }
}

export default function EmbedGpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([1, 2, 3, 4].map(makeCourse))
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; totalQP: number } | null>(null)

  function update(id: number, field: keyof Course, value: string) {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  function addCourse() {
    setCourses(cs => [...cs, makeCourse(nextId++)])
  }

  function calc() {
    let totalQP = 0
    let totalCredits = 0
    for (const c of courses) {
      const credits = parseFloat(c.credits) || 0
      const gradeEntry = GRADES.find(g => g.label === c.grade)
      const points = gradeEntry ? gradeEntry.points : 0
      totalQP += points * credits
      totalCredits += credits
    }
    if (totalCredits === 0) return
    setResult({ gpa: totalQP / totalCredits, totalCredits, totalQP })
  }

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        🎓 GPA Calculator
      </h2>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#a8a8b3" }}>Course (optional)</span>
        <span style={{ fontSize: 11, color: "#a8a8b3" }}>Grade</span>
        <span style={{ fontSize: 11, color: "#a8a8b3" }}>Credits</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {courses.map(c => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px", gap: 6 }}>
            <input
              type="text"
              placeholder="Course name"
              value={c.name}
              onChange={e => update(c.id, "name", e.target.value)}
              style={inputStyle}
            />
            <select
              value={c.grade}
              onChange={e => update(c.id, "grade", e.target.value)}
              style={{ ...inputStyle, padding: "8px 4px" }}
            >
              {GRADES.map(g => (
                <option key={g.label} value={g.label}>{g.label}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={6}
              value={c.credits}
              onChange={e => update(c.id, "credits", e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button
          onClick={addCourse}
          style={{ flex: 1, background: "#16213e", color: "#a8a8b3", border: "1px solid #1e2d4a", borderRadius: 6, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          + Add Course
        </button>
        <button
          onClick={calc}
          style={{ flex: 2, background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Calculate GPA
        </button>
      </div>

      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 14 }}>
            <span style={{ color: "#a8a8b3" }}>Semester GPA</span>
            <span style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>{result.gpa.toFixed(2)} / 4.0</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 14 }}>
            <span style={{ color: "#a8a8b3" }}>Total credits</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>{result.totalCredits}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
            <span style={{ color: "#a8a8b3" }}>Quality points</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>{result.totalQP.toFixed(1)}</span>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: "#a8a8b3" }}>
        <a href="https://www.dayblip.com/education/gpa-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Full GPA Calculator → dayblip.com
        </a>
      </div>
    </div>
  )
}
