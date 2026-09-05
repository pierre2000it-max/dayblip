"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "auto_detailing", label: "Auto Detailing" },
  { value: "residential_cleaning", label: "Residential Cleaning" },
  { value: "lawn_care", label: "Lawn Care" },
  { value: "pressure_washing", label: "Pressure Washing" },
  { value: "mobile_car_wash", label: "Mobile Car Wash" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "handyman", label: "Handyman" },
  { value: "junk_removal", label: "Junk Removal" },
  { value: "landscaping", label: "Landscaping" },
  { value: "window_cleaning", label: "Window Cleaning" },
  { value: "carpet_cleaning", label: "Carpet Cleaning" },
  { value: "pest_control", label: "Pest Control" },
  { value: "interior_painting", label: "Interior Painting" },
  { value: "gutter_cleaning", label: "Gutter Cleaning" },
  { value: "snow_removal", label: "Snow Removal" },
  { value: "pool_cleaning", label: "Pool Cleaning" },
  { value: "moving_services", label: "Moving Services" },
  { value: "pet_grooming", label: "Pet Grooming" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "commercial_cleaning", label: "Commercial Cleaning" },
  { value: "roofing", label: "Roofing" },
  { value: "mobile_mechanic", label: "Mobile Mechanic" },
  { value: "window_tinting", label: "Window Tinting" },
  { value: "dumpster_rental", label: "Dumpster Rental" },
  { value: "tree_trimming", label: "Tree Trimming" },
  { value: "fence_installation", label: "Fence Installation" },
  { value: "epoxy_flooring", label: "Epoxy Flooring" },
  { value: "concrete_coating", label: "Concrete Coating" },
];

const API_BASE =
  process.env.NEXT_PUBLIC_ZIPLICIT_API_URL ?? "https://ziplicit.com";

type ScoreResult = {
  zip: string;
  category: string;
  band_low: number;
  band_high: number;
  strongest_criterion: string;
  weakest_criterion: string;
  assumed_pct: number;
  confidence: string;
  alternate_zip: string | null;
  alternate_band_low: number | null;
  alternate_band_high: number | null;
  competitor_count: number | null;
  higher_scoring_zips_count: number;
  insufficient: boolean;
  reason: string | null;
};

function criterionLabel(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
}

export default function ZipScoreTool() {
  const [zip, setZip] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [waitlistSent, setWaitlistSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setRateLimited(false);

    const trimmedZip = zip.trim();
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError("Enter a valid 5-digit US ZIP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/free-score?zip=${trimmedZip}&cat=${category}`
      );
      if (res.status === 429) {
        setRateLimited(true);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? "Something went wrong. Try again.");
        return;
      }
      const data: ScoreResult = await res.json();
      setResult(data);
    } catch {
      setError("Could not reach the scoring service. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setEmailLoading(true);
    try {
      await fetch(`${API_BASE}/api/save-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          zip: result.zip,
          category: result.category,
        }),
      });
      setEmailSaved(true);
    } catch {
      // silent — not a blocker
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleWaitlist() {
    if (!result) return;
    try {
      await fetch(`${API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: result.zip, category: result.category }),
      });
    } catch {
      // silent
    }
    setWaitlistSent(true);
  }

  const ctaUrl = result
    ? `https://ziplicit.com/report?zip=${result.zip}&cat=${result.category}&band=${result.band_low}-${result.band_high}&src=dayblip_band`
    : null;

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Free ZIP Market Score
      </h1>
      <p className="text-gray-600 mb-6 text-sm">
        Enter a business category and US ZIP code to see your free market
        viability band.
      </p>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            US ZIP code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 53202"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm disabled:opacity-60 transition"
        >
          {loading ? "Scoring…" : "Get free score →"}
        </button>
      </form>

      {/* Rate limit wall */}
      {rateLimited && (
        <div className="border border-amber-300 bg-amber-50 rounded-lg p-5 space-y-3">
          <p className="font-semibold text-gray-900">
            You&apos;ve used your 3 free scores today.
          </p>
          <a
            href={`https://ziplicit.com/report`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            Save your email for 25 free scores/day
          </a>
          <a
            href="https://ziplicit.com/report"
            className="block w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2 rounded-md text-sm transition"
          >
            Get the full report → $99
          </a>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {result.insufficient ? (
            /* Insufficient data state */
            <div className="border border-gray-200 rounded-lg p-5 space-y-3">
              <p className="font-semibold text-gray-900">
                {result.zip} doesn&apos;t have enough data for a full score.
              </p>
              {result.reason && (
                <p className="text-sm text-gray-500">{result.reason}</p>
              )}
              {!waitlistSent ? (
                <button
                  onClick={handleWaitlist}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Notify me when {result.zip} is covered
                </button>
              ) : (
                <p className="text-sm text-green-600">
                  You&apos;re on the list. We&apos;ll email you when it&apos;s
                  covered.
                </p>
              )}
            </div>
          ) : (
            /* Score result */
            <>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <p className="text-sm text-gray-600">
                  {result.zip} · {categoryLabel(result.category)}
                </p>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Score band
                  </span>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.band_low} – {result.band_high}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">
                      Strongest signal
                    </span>
                    <p className="font-medium text-gray-900">
                      {criterionLabel(result.strongest_criterion)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      Weakest signal
                    </span>
                    <p className="font-medium text-gray-900">
                      {criterionLabel(result.weakest_criterion)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {result.competitor_count !== null && (
                    <div>
                      <span className="text-xs text-gray-500">Competitors found</span>
                      <p className="font-medium text-gray-900">
                        {result.competitor_count} in {result.zip}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-gray-500">Higher-scoring ZIPs nearby</span>
                    <p className="font-medium text-gray-900">
                      {result.higher_scoring_zips_count} score higher than {result.zip}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-xs text-gray-500">Confidence</span>
                  <p className="font-medium text-gray-900">
                    Free score uses 5 of 6 criteria. Full report adds live competitor data.
                  </p>
                </div>
                {result.alternate_zip &&
                  result.alternate_band_low !== null &&
                  result.alternate_band_high !== null && (
                    <div className="text-sm border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500">
                        Nearest higher-scoring ZIP
                      </span>
                      <p className="font-medium text-gray-900">
                        {result.alternate_zip} · {result.alternate_band_low} –{" "}
                        {result.alternate_band_high}
                      </p>
                    </div>
                  )}
              </div>

              {/* Email capture */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  Save this score and get a breakdown of what&apos;s holding it
                  back.
                </p>
                {emailSaved ? (
                  <p className="text-sm text-green-600">
                    Saved. Check your email for the breakdown.
                  </p>
                ) : (
                  <form onSubmit={handleSaveEmail} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-60 transition whitespace-nowrap"
                    >
                      {emailLoading ? "Saving…" : "Save my score →"}
                    </button>
                  </form>
                )}
              </div>

              {/* CTA */}
              <div className="border border-blue-100 bg-blue-50 rounded-lg p-5 space-y-3">
                <p className="text-sm text-gray-800">
                  The full report names every competitor in {result.zip}, shows
                  the revenue math, and tells you the 3 nearby ZIPs that score
                  higher.
                </p>
                <a
                  href={ctaUrl ?? "#"}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                  See the full {result.zip} report →
                </a>
                <p className="text-xs text-center text-gray-500">
                  $99 · Ready in 60 seconds
                </p>
              </div>

              {/* Powered by */}
              <p className="text-xs text-center text-gray-400">
                Powered by{" "}
                <a
                  href="https://ziplicit.com?src=dayblip_powered"
                  className="underline hover:text-gray-600"
                >
                  Ziplicit
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
