"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

export default function MyPlan() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();

        setWorkouts(data);

        const savedPlan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const savedLater = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        const completed = JSON.parse(
          localStorage.getItem("fitlog-done") || "[]"
        );

        setPlan(savedPlan);
        setSaved(savedLater);
        setDone(completed);
      } catch (error) {
        console.error("Error loading workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const removeFromPlan = (id: number) => {
    const updatedPlan = plan.filter((item) => item !== id);

    setPlan(updatedPlan);
    localStorage.setItem("fitlog-plan", JSON.stringify(updatedPlan));

    showMessage("Removed from today's plan");
  };

  const removeFromSaved = (id: number) => {
    const updatedSaved = saved.filter((item) => item !== id);

    setSaved(updatedSaved);
    localStorage.setItem("fitlog-saved", JSON.stringify(updatedSaved));

    showMessage("Removed from saved");
  };

  const markAsDone = (id: number) => {
    if (done.includes(id)) {
      showMessage("Workout already completed");
      return;
    }

    const updatedDone = [...done, id];

    setDone(updatedDone);
    localStorage.setItem("fitlog-done", JSON.stringify(updatedDone));

    showMessage("Workout marked as done!");
  };

  const currentIds = activeTab === "plan" ? plan : saved;

  const currentWorkouts = workouts.filter((workout) =>
    currentIds.includes(workout.id)
  );

  const totalMinutes = currentWorkouts.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const totalCalories = currentWorkouts.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="font-semibold text-black/50">Loading workouts…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="flex flex-col gap-5 border-b border-black/10 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12">
        <Link href="/" className="text-2xl font-black">
          FITLOG
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-black/60 hover:bg-black/5"
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            My Plan
          </Link>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("plan")}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Plan {plan.length}
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold"
          >
            Saved {saved.length}
          </button>
        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-black/40">
            FITLOG
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">
            MY PLAN
          </h1>

          <p className="mt-5 max-w-2xl text-black/60">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        {/* Metrics */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm font-bold text-black/40">EXERCISES</p>
            <p className="mt-2 text-4xl font-black">
              {plan.length}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm font-bold text-black/40">MINUTES</p>
            <p className="mt-2 text-4xl font-black">
              {totalMinutes}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm font-bold text-black/40">CALORIES</p>
            <p className="mt-2 text-4xl font-black">
              {totalCalories}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex gap-3 border-b border-black/10 pb-4">
          <button
            onClick={() => setActiveTab("plan")}
            className={`rounded-full px-5 py-3 text-sm font-bold ${
              activeTab === "plan"
                ? "bg-black text-white"
                : "border border-black/20"
            }`}
          >
            Today&apos;s Plan
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`rounded-full px-5 py-3 text-sm font-bold ${
              activeTab === "saved"
                ? "bg-black text-white"
                : "border border-black/20"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white">
            {message}
          </div>
        )}

        {/* Empty State */}
        {currentWorkouts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-black/10 px-6 py-20 text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-black/40">
              NOTHING HERE YET
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Your list is empty
            </h2>

            <p className="mx-auto mt-4 max-w-md text-black/60">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-full bg-black px-7 py-4 font-bold text-white"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          /* Workout Cards */
          <div className="mt-8 space-y-4">
            {currentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="overflow-hidden rounded-3xl border border-black/10"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="h-64 w-full object-cover md:h-auto md:w-72"
                  />

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] text-black/40">
                          {workout.muscleGroups.join(" • ")}
                        </p>

                        <h2 className="mt-2 text-2xl font-black uppercase">
                          {workout.name}
                        </h2>

                        <p className="mt-2 text-black/60">
                          {workout.equipment}
                        </p>
                      </div>

                      {activeTab === "plan" && done.includes(workout.id) && (
                        <span className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
                          DONE
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-black/60">
                      <span>⏱ {workout.duration} min</span>
                      <span>🔥 {workout.caloriesBurned} kcal</span>
                      <span>★ {workout.rating}</span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/workout/${workout.id}`}
                        className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
                      >
                        View Details
                      </Link>

                      {activeTab === "plan" && (
                        <>
                          <button
                            onClick={() => markAsDone(workout.id)}
                            className="rounded-full border border-black px-5 py-3 text-sm font-bold hover:bg-black hover:text-white"
                          >
                            ✓ Mark as Done
                          </button>

                          <button
                            onClick={() => removeFromPlan(workout.id)}
                            className="rounded-full border border-black/20 px-5 py-3 text-sm font-bold hover:bg-black hover:text-white"
                          >
                            ✕ Remove
                          </button>
                        </>
                      )}

                      {activeTab === "saved" && (
                        <button
                          onClick={() => removeFromSaved(workout.id)}
                          className="rounded-full border border-black/20 px-5 py-3 text-sm font-bold hover:bg-black hover:text-white"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-white md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-black">FITLOG</p>

            <p className="mt-1 text-sm text-white/50">
              Train hard, log honest.
            </p>
          </div>

          <p className="text-sm text-white/40">
            © 2026 FitLog — Workout Library. Train hard, log honest.
          </p>
        </div>
      </footer>
    </main>
  );
}