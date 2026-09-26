"use client";

import Image from "next/image";
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

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Workout data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === "duration") {
      return a.duration - b.duration;
    }

    if (sortBy === "calories") {
      return a.caloriesBurned - b.caloriesBurned;
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 md:px-12">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FitLog logo"
            width={42}
            height={42}
          />

          <span className="text-2xl font-bold tracking-wider">
            FIT<span className="text-[#ccff00]">LOG</span>
          </span>
        </a>

        <div className="hidden gap-8 md:flex">
          <a
            href="/"
            className="font-semibold text-[#ccff00]"
          >
            WORKOUT
          </a>

          <a
            href="/my-plan"
            className="text-zinc-400 transition hover:text-white"
          >
            MY PLAN
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/my-plan"
            className="rounded-full bg-[#ccff00] px-4 py-2 text-sm font-bold text-black"
          >
            PLAN 0
          </a>

          <a
            href="/my-plan"
            className="rounded-full border border-zinc-600 px-4 py-2 text-sm font-bold"
          >
            SAVED 0
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-12 md:py-24">
        <div>
          <p className="mb-5 text-sm font-bold tracking-[0.3em] text-[#ccff00]">
            WORKOUT LIBRARY
          </p>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            FitLog is a dark, no-nonsense gym companion: pick a lift,
            lock it into today&apos;s plan, and watch the week&apos;s work
            add up.
          </p>

          <a
            href="#library"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-6 py-3 font-bold text-black transition hover:scale-105"
          >
            BROWSE WORKOUTS
            <span>→</span>
          </a>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-zinc-800">
          <Image
            src="/banner.png"
            alt="FitLog workout banner"
            width={800}
            height={600}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </section>

      {/* Library */}
      <section
        id="library"
        className="mx-auto max-w-7xl px-6 py-20 md:px-12"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-[#ccff00]">
              WORKOUTS
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              THE LIBRARY
            </h2>

            <p className="mt-3 text-zinc-400">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Sort By</span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white outline-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-[#ccff00]" />
          </div>
        )}

        {/* Workout Cards */}
        {!loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => (
              <a
                key={workout.id}
                href={`/workout/${workout.id}`}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-[#ccff00]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-zinc-900">
                  <Image
                    src={workout.image}
                    alt={workout.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {workout.muscleGroups.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-[#ccff00] px-3 py-1 text-xs font-bold text-black"
                      >
                        {muscle.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Name */}
                  <h3 className="mt-4 text-xl font-black uppercase">
                    {workout.name}
                  </h3>

                  {/* Equipment */}
                  <p className="mt-2 text-sm text-zinc-400">
                    {workout.equipment}
                  </p>

                  {/* Stats */}
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                    <span>⏱ {workout.duration} min</span>
                    <span>🔥 {workout.caloriesBurned} kcal</span>
                    <span>★ {workout.rating}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FitLog logo"
              width={32}
              height={32}
            />

            <span className="font-bold tracking-wider">FITLOG</span>
          </div>

          <p className="text-sm text-zinc-500">
            © 2026 FitLog — Workout Library. Train hard, log honest.
          </p>
        </div>
      </footer>
    </main>
  );
}