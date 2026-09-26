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
  reps: number;
  rating: number;
  description: string;
  instructions: string[];
};

export default function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const { id } = await params;

        const response = await fetch(
          `https://api.abcz.workers.dev/api/fitlog/${id}`
        );

        if (!response.ok) {
          throw new Error("Workout not found");
        }

        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [params]);

  const addToPlan = () => {
    if (!workout) return;

    const currentPlan: number[] = JSON.parse(
      localStorage.getItem("fitlog-plan") || "[]"
    );

    if (currentPlan.includes(workout.id)) {
      setMessage("Already added to today's plan!");
      return;
    }

    const updatedPlan = [...currentPlan, workout.id];

    localStorage.setItem("fitlog-plan", JSON.stringify(updatedPlan));
    setMessage("Added to today's plan!");
  };

  const saveForLater = () => {
    if (!workout) return;

    const currentSaved: number[] = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    if (currentSaved.includes(workout.id)) {
      setMessage("Already saved!");
      return;
    }

    const updatedSaved = [...currentSaved, workout.id];

    localStorage.setItem("fitlog-saved", JSON.stringify(updatedSaved));
    setMessage("Saved for later!");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-semibold text-black/50">
          Loading workout…
        </p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-black">Workout not found</h1>

        <Link
          href="/"
          className="mt-6 rounded-full bg-black px-6 py-3 font-bold text-white"
        >
          Back to workouts
        </Link>
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
          <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            Plan
          </span>

          <span className="rounded-full border border-black px-4 py-2 text-sm font-semibold">
            Saved
          </span>
        </div>
      </nav>

      {/* Workout Details */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl bg-black/5">
            <img
              src={workout.image}
              alt={workout.name}
              className="h-[400px] w-full object-cover md:h-[600px]"
            />
          </div>

          {/* Information */}
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-black/40">
              WORKOUT DETAILS
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {workout.name}
            </h1>

            <p className="mt-6 leading-7 text-black/60">
              {workout.description}
            </p>

            {/* Muscle Groups */}
            <div className="mt-6 flex flex-wrap gap-2">
              {workout.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold"
                >
                  {muscle}
                </span>
              ))}
            </div>

            {/* Specs */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">
                  EQUIPMENT
                </p>
                <p className="mt-2 font-bold">{workout.equipment}</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">
                  DIFFICULTY
                </p>
                <p className="mt-2 font-bold">{workout.difficulty}</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">SETS</p>
                <p className="mt-2 font-bold">{workout.sets}</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">REPS</p>
                <p className="mt-2 font-bold">{workout.reps}</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">
                  DURATION
                </p>
                <p className="mt-2 font-bold">{workout.duration} min</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">
                  CALORIES
                </p>
                <p className="mt-2 font-bold">
                  {workout.caloriesBurned} kcal
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-6 text-lg font-bold">
              ★ {workout.rating}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addToPlan}
                className="rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-black/80"
              >
                Add to today&apos;s plan
              </button>

              <button
                onClick={saveForLater}
                className="rounded-full border border-black px-7 py-4 font-bold transition hover:bg-black hover:text-white"
              >
                Save for later
              </button>
            </div>

            {/* Message */}
            {message && (
              <p className="mt-4 rounded-xl bg-black/5 px-4 py-3 text-sm font-semibold">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-20">
          <p className="text-sm font-bold tracking-[0.2em] text-black/40">
            HOW TO DO IT
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Instructions
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workout.instructions.map((instruction, index) => (
              <div
                key={index}
                className="rounded-2xl border border-black/10 p-6"
              >
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <p className="leading-7 text-black/70">
                    {instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-white md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-black">FITLOG</p>

            <p className="mt-1 text-sm text-white/50">
              Train with intent. Log every set.
            </p>
          </div>

          <p className="text-sm text-white/40">
            © 2026 FITLOG. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}