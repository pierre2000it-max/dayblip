"use client";
import { useState, useEffect } from "react";
import { getStreak, updateStreak, isAlreadyPlayedToday, type StreakData } from "@/utils/streakManager";
import { generateShareImage } from "@/utils/generateShareImage";

const STREAK_KEY = "dayblip_otd_streak";

const MILESTONES: Record<number, string> = {
  3:   "You're on a roll! 🎯",
  7:   "One week strong! 🔥",
  14:  "Two weeks — history buff! 📚",
  30:  "30 days — legendary! 🏆",
  100: "100 days — unstoppable! 👑",
};

export default function OtdStreakBadge() {
  const [streakData,      setStreakData]      = useState<StreakData | null>(null);
  const [prevStreakCount, setPrevStreakCount] = useState(0);

  useEffect(() => {
    if (isAlreadyPlayedToday(STREAK_KEY)) {
      setStreakData(getStreak(STREAK_KEY));
    } else {
      const prev    = getStreak(STREAK_KEY);
      const updated = updateStreak(STREAK_KEY);
      if (prev && prev.count > 1 && updated.count === 1) setPrevStreakCount(prev.count);
      setStreakData(updated);
    }
  }, []);

  if (!streakData) return null;

  const streakBroke = prevStreakCount > 0 && streakData.count === 1;

  if (streakBroke) {
    return (
      <div className="bg-[#1a1a2e] px-6 pb-10">
        <div className="mx-auto max-w-[900px]">
          <div style={{ background: "#1e2435", border: "1px solid #0f3460", borderRadius: 12, padding: 20 }}>
            <p className="text-2xl mb-1">😔</p>
            <p className="font-bold text-white">Streak reset</p>
            <p className="text-[#a8a8b3] text-sm mt-2">
              Your {prevStreakCount}-day streak ended. Start a new one today!
            </p>
            <p className="text-[#a8a8b3] text-xs mt-3">
              Best streak: {streakData.longestStreak} days
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] px-6 pb-10">
      <div className="mx-auto max-w-[900px]">
        <div style={{ background: "#1e2435", border: "1px solid #0f3460", borderRadius: 12, padding: 20 }}>
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontSize: 32 }}>🔥</span>
            <span className="text-2xl font-bold" style={{ color: "#e8445a" }}>
              {streakData.count}-Day Streak!
            </span>
          </div>
          <p className="text-[#a8a8b3] text-sm">Longest streak: {streakData.longestStreak} days</p>
          <p className="text-[#a8a8b3] text-sm">Total days played: {streakData.totalPlayed}</p>
          <p className="text-[#a8a8b3] text-sm mt-3">
            {MILESTONES[streakData.count] ?? "Come back tomorrow to keep it going!"}
          </p>
          <button
            onClick={() => void generateShareImage({
              title: "On This Day Streak",
              primaryStat: String(streakData.count),
              primaryLabel: "day streak 🔥",
              stats: [
                { label: "Longest streak",    value: `${streakData.longestStreak} days` },
                { label: "Total days played", value: `${streakData.totalPlayed} days` },
              ],
              tagline: "I learn something new every day.",
              toolUrl: "dayblip.com/on-this-day",
              filename: "dayblip-otd-streak.png",
            })}
            style={{
              background: "#e8445a", color: "white", borderRadius: 8,
              padding: "12px 24px", width: "100%", marginTop: 12,
              fontWeight: 600, border: "none", cursor: "pointer",
            }}
          >
            📸 Share Your Streak
          </button>
        </div>
      </div>
    </div>
  );
}
