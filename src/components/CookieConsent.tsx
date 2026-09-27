"use client"
import { useEffect } from "react"
import * as CC from "vanilla-cookieconsent"
import "vanilla-cookieconsent/dist/cookieconsent.css"

type GtagFn = (...args: unknown[]) => void

function updateGcm(categories: string[]) {
  if (typeof window === "undefined") return
  const win = window as typeof window & { gtag?: GtagFn }
  if (typeof win.gtag !== "function") return
  const granted = categories.includes("analytics") || categories.includes("marketing")
  const state = granted ? "granted" : "denied"
  win.gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  })
}

export default function CookieConsent() {
  useEffect(() => {
    CC.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {
          enabled: false,
          autoClear: { cookies: [{ name: /^(_ga|_gid|_gat)/ }] },
        },
        marketing: {
          enabled: false,
          autoClear: { cookies: [{ name: /^(NID|IDE|ANID|_gcl)/ }] },
        },
      },
      onFirstConsent: ({ cookie }) => updateGcm(cookie.categories),
      onChange:       ({ cookie }) => updateGcm(cookie.categories),
      guiOptions: {
        consentModal:    { layout: "box",          position: "bottom right" },
        preferencesModal:{ layout: "box" },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title:               "We use cookies",
              description:         'We use cookies to serve relevant ads and improve your experience. <a href="/privacy" class="cc__link">Privacy Policy</a>',
              acceptAllBtn:        "Accept All",
              acceptNecessaryBtn:  "Reject All",
              showPreferencesBtn:  "Manage Preferences",
            },
            preferencesModal: {
              title:               "Cookie Preferences",
              acceptAllBtn:        "Accept All",
              acceptNecessaryBtn:  "Reject All",
              savePreferencesBtn:  "Save Preferences",
              closeIconLabel:      "Close",
              sections: [
                {
                  title:       "Cookie Usage",
                  description: "We use cookies to ensure basic functionality and to improve your experience.",
                },
                {
                  title:          "Strictly Necessary",
                  description:    "Required for the site to function. Cannot be disabled.",
                  linkedCategory: "necessary",
                },
                {
                  title:          "Analytics",
                  description:    "Help us understand how visitors interact with the site.",
                  linkedCategory: "analytics",
                },
                {
                  title:          "Advertising",
                  description:    "Used to show you relevant advertisements.",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
