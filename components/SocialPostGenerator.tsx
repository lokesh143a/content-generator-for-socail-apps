"use client";

import React, { useState } from "react";

type Platform = "LinkedIn" | "Instagram" | "Twitter";

interface GeneratedPosts {
  LinkedIn?: string;
  Instagram?: string;
  Twitter?: string;
}

export default function SocialPostGenerator() {
  const [rawText, setRawText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [platforms, setPlatforms] = useState<Record<Platform, boolean>>({
    LinkedIn: true,
    Instagram: true,
    Twitter: true,
  });

  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPosts | null>(
    null,
  );

  const handleCheckboxChange = (platform: Platform) => {
    setPlatforms((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleReset = () => {
    setRawText("");
    setPlatforms({ LinkedIn: false, Instagram: false, Twitter: false });
    setGeneratedPosts(null);
  };

  // Direct fetch call to Gemini endpoint
  const handleGenerate = async () => {
    if (!rawText.trim()) return;

    const selectedPlatforms = (Object.keys(platforms) as Platform[]).filter(
      (key) => platforms[key],
    );

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    setLoading(true);

    // Custom instruction telling Gemini to return standard JSON matching our structure
    const systemPrompt = `You are an expert social media manager. Take this raw text 
    input and generate tailored posts for these specific platforms: ${selectedPlatforms.join(", ")}. 
    Raw Text: "${rawText}". Return the output strictly as a single valid JSON object where keys are the 
    platform names exactly (e.g., "LinkedIn", "Instagram", "Twitter") and values are the generated content strings. 
    Do not include markdown blocks or backticks.`;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("API rate limit reached. Please wait a minute and try again.");
        }
        throw new Error(`Gemini API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Raw Gemini Response:", data);

      // Extract text content response from Gemini JSON structure
      const rawResponseText = data.candidates[0].content.parts[0].text;

      // Clean up potential markdown formatting wrapping the JSON string
      const cleanJsonString = rawResponseText
        .replace(/```json|```/g, "")
        .trim();
      const parsedPosts = JSON.parse(cleanJsonString);

      setGeneratedPosts(parsedPosts);
    } catch (error) {
      console.error("Direct Gemini Error:", error);
      alert(error instanceof Error ? error.message : "Failed to get response from Gemini. Check your API key or console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-100 p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-white">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
            Content Generator For Social Media Posts
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Generate tailored social posts quickly — pick platforms, paste raw
            text, and hit Gemini.
          </p>
        </div>

        {/* Input Form Section */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Raw Text Input */}
          <div className="space-y-2">
            <label
              htmlFor="raw-text"
              className="block text-sm font-semibold text-slate-700"
            >
              Enter Raw Text
            </label>
            <textarea
              id="raw-text"
              rows={5}
              className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y"
              placeholder="Type or paste your project concept here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Platforms
            </label>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {(Object.keys(platforms) as Platform[]).map((platform) => (
                <label
                  key={platform}
                  className="inline-flex items-center gap-2.5 cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    checked={platforms[platform]}
                    onChange={() => handleCheckboxChange(platform)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 transition-colors"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !rawText.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-600/10 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                "Get Content"
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium text-sm rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Generated Output Section */}
        {generatedPosts && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">
              Generated Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.keys(generatedPosts) as Platform[]).map((key) => {
                if (!platforms[key] || !generatedPosts[key]) return null;

                return (
                  <div
                    key={key}
                    className="flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/70 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {key}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    <div className="p-4 flex-1">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100">
                        {generatedPosts[key]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
