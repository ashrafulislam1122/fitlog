"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Workout = {
  id: number;
  name: string;
  image: string;
  equipment: string;
  duration: number;
  caloriesBurned: number;
  rating: number;
};

export default function MyPlan() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);

        const storedPlan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const storedSaved = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        setPlanIds(storedPlan);
        setSavedIds(storedSaved);
      } catch (error) {
        console.error("Error loading workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const plan = workouts.filter((workout) =>
    planIds.includes(workout.id)
  );

  const saved = workouts.filter((workout) =>
    savedIds.includes(workout.id)
  );

  const currentList = activeTab === "plan" ? plan : saved;

  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  const removeFromPlan = (id: number) => {
    const updatedIds = planIds.filter((item) => item !== id);

    setPlanIds(updatedIds);
    localStorage.setItem("fitlog-plan", JSON.stringify(updatedIds));

    setMessage("Removed from today's plan!");
    setTimeout(() => setMessage(""), 2500);
  };

  const removeFromSaved = (id: number) => {
    const updatedIds = savedIds.filter((item) => item !== id);

    setSavedIds(updatedIds);
    localStorage.setItem("fitlog-saved", JSON.stringify(updatedIds));

    setMessage("Removed from saved!");
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
      {/* NAVBAR */}
      <nav className="border-b border-black/10 bg-[#f5f5f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FitLog"
              className="h-10 w-10 object-contain"
            />

            <div>
              <h1 className="text-xl font-black tracking-tight">FITLOG</h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500">
                WORKOUT LIBRARY
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
            >
              Workout
            </Link>

            <Link
              href="/my-plan"
              className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white"
            >
              My Plan
            </Link>
          </div>
        </div>
      </nav>

      {/* TOAST */}
      {message && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {message}
        </div>
      )}

      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <p className="mb-3 text-sm font-black tracking-[0.2em] text-gray-500">
          YOUR WORKOUTS
        </p>

        <h2 className="text-4xl font-black tracking-tight md:text-6xl">
          MY PLAN
        </h2>

        <p className="mt-4 max-w-xl text-gray-600">
          Track your selected workouts and keep your training organized.
        </p>
      </section>

      {/* METRICS */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-black p-6 text-white">
          <p className="text-xs font-bold tracking-widest text-gray-400">
            EXERCISES
          </p>
          <p className="mt-2 text-4xl font-black">{plan.length}</p>
        </div>

        <div className="rounded-2xl bg-black p-6 text-white">
          <p className="text-xs font-bold tracking-widest text-gray-400">
            MINUTES
          </p>
          <p className="mt-2 text-4xl font-black">{totalMinutes}</p>
        </div>

        <div className="rounded-2xl bg-black p-6 text-white">
          <p className="text-xs font-bold tracking-widest text-gray-400">
            CALORIES
          </p>
          <p className="mt-2 text-4xl font-black">{totalCalories}</p>
        </div>
      </section>

      {/* TABS */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex gap-3 border-b border-black/10 pb-4">
          <button
            onClick={() => setActiveTab("plan")}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              activeTab === "plan"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Today&apos;s Plan ({plan.length})
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              activeTab === "saved"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="py-20 text-center">
            <p className="font-bold text-gray-500">Loading workouts...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-sm font-black tracking-[0.2em] text-gray-400">
              NOTHING HERE YET
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Start building your workout.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Browse the workout library and add exercises to your plan.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((workout) => (
              <div
                key={workout.id}
                className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center"
              >
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="h-40 w-full rounded-2xl object-cover md:h-28 md:w-44"
                />

                <div className="flex-1">
                  <h3 className="text-2xl font-black">{workout.name}</h3>

                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {workout.equipment}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-gray-600">
                    <span>{workout.duration} min</span>
                    <span>{workout.caloriesBurned} kcal</span>
                    <span>★ {workout.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="rounded-full border border-black px-5 py-3 text-sm font-bold hover:bg-black hover:text-white"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() =>
                      activeTab === "plan"
                        ? removeFromPlan(workout.id)
                        : removeFromSaved(workout.id)
                    }
                    className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-16 bg-black px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FitLog"
              className="h-9 w-9 object-contain"
            />
            <span className="font-black">FITLOG</span>
          </div>

          <p className="text-sm text-gray-400">
            © 2026 FITLOG. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}