"use client"
import * as CC from "vanilla-cookieconsent"

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => CC.showPreferences()}
      style={{
        background: "#e94560",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 20px",
        fontWeight: 600,
        fontSize: "15px",
        cursor: "pointer",
        fontFamily: "Arial, sans-serif",
      }}
    >
      Open cookie preferences
    </button>
  )
}
