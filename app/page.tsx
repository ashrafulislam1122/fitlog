"use client";

import Image from "next/image";
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

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("duration");
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();

        setWorkouts(data);
        setFilteredWorkouts(data);
      } catch (error) {
        console.error("Workout loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  useEffect(() => {
    const plan = JSON.parse(
      localStorage.getItem("fitlog-plan") || "[]"
    );

    const saved = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    setPlanCount(plan.length);
    setSavedCount(saved.length);

    function updateCounts() {
      const updatedPlan = JSON.parse(
        localStorage.getItem("fitlog-plan") || "[]"
      );

      const updatedSaved = JSON.parse(
        localStorage.getItem("fitlog-saved") || "[]"
      );

      setPlanCount(updatedPlan.length);
      setSavedCount(updatedSaved.length);
    }

    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  useEffect(() => {
    const sorted = [...workouts];

    if (sortBy === "duration") {
      sorted.sort((a, b) => a.duration - b.duration);
    }

    if (sortBy === "calories") {
      sorted.sort(
        (a, b) => b.caloriesBurned - a.caloriesBurned
      );
    }

    if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    setFilteredWorkouts(sorted);
  }, [sortBy, workouts]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Image
              src="/logho.png"
              alt="FitLog"
              width={42}
              height={42}
            />

            <span className="text-2xl font-black tracking-tight">
              FIT<span className="text-[#ccff00]">LOG</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="rounded-full bg-[#ccff00] px-5 py-2 text-sm font-black text-black"
            >
              WORKOUT
            </Link>

            <Link
              href="/my-plan"
              className="text-sm font-bold text-zinc-400 transition hover:text-white"
            >
              MY PLAN
            </Link>

          </div>

          {/* BADGES */}
          <div className="flex items-center gap-2">

            <Link
              href="/my-plan"
              className="rounded-full bg-[#ccff00] px-4 py-2 text-xs font-black text-black"
            >
              PLAN {planCount}
            </Link>

            <Link
              href="/my-plan"
              className="hidden rounded-full border border-zinc-600 px-4 py-2 text-xs font-black sm:block"
            >
              SAVED {savedCount}
            </Link>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">

        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10 lg:grid-cols-2">

          {/* HERO TEXT */}
          <div>

            <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
              WORKOUT LIBRARY
            </p>

            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
              TRAIN WITH
              <br />
              INTENT.
              <br />
              <span className="text-[#ccff00]">
                LOG EVERY SET.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
              FitLog is a dark, no-nonsense gym companion:
              pick a lift, lock it into today's plan, and watch
              the week's work add up.
            </p>

            <Link
              href="#library"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 font-black text-black transition hover:scale-105"
            >
              BROWSE WORKOUTS
              <span className="text-xl">→</span>
            </Link>

          </div>

          {/* HERO IMAGE */}
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-zinc-800 md:h-[450px]">

            <Image
              src="/banner.png"
              alt="FitLog workout"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-black/80 px-4 py-2 text-xs font-bold backdrop-blur">
              TRAIN HARD • LOG HONEST
            </div>

          </div>

        </div>
      </section>

      {/* LIBRARY */}
      <section
        id="library"
        className="mx-auto max-w-7xl px-5 pb-20 md:px-10"
      >

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
              THE LIBRARY
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
              PICK YOUR LIFT.
            </h2>

            <p className="mt-3 text-zinc-500">
              Twelve lifts covering every major muscle group.
            </p>

          </div>

          {/* SORT */}
          <div className="relative">

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-full border border-zinc-700 bg-zinc-950 px-6 py-3 pr-12 text-sm font-bold text-white outline-none focus:border-[#ccff00]"
            >
              <option value="duration">
                Sort by Duration
              </option>

              <option value="calories">
                Sort by Calories
              </option>

              <option value="rating">
                Sort by Rating
              </option>
            </select>

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
              ↓
            </span>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-[#ccff00]" />

              <p className="mt-5 font-bold text-zinc-500">
                Loading workouts...
              </p>

            </div>

          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredWorkouts.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-16 text-center">

            <h3 className="text-3xl font-black">
              NO WORKOUTS FOUND
            </h3>

            <p className="mt-3 text-zinc-500">
              Please try again later.
            </p>

          </div>
        )}

        {/* WORKOUT GRID */}
        {!loading && filteredWorkouts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredWorkouts.map((workout) => (

              <Link
                key={workout.id}
                href={`/workout/${workout.id}`}
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-[#ccff00]"
              >

                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">

                  <Image
                    src={workout.image}
                    alt={workout.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  {/* DIFFICULTY */}
                  <div className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-[10px] font-black uppercase backdrop-blur">
                    {workout.difficulty}
                  </div>

                  {/* RATING */}
                  <div className="absolute right-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-black backdrop-blur">
                    <span className="text-[#ccff00]">
                      ★
                    </span>{" "}
                    {workout.rating}
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  {/* TAGS */}
                  <div className="mb-4 flex flex-wrap gap-2">

                    {workout.muscleGroups
                      .slice(0, 3)
                      .map((muscle) => (
                        <span
                          key={muscle}
                          className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase text-zinc-400"
                        >
                          {muscle}
                        </span>
                      ))}

                  </div>

                  <h3 className="text-2xl font-black uppercase leading-tight">
                    {workout.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {workout.equipment}
                  </p>

                  {/* STATS */}
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">

                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-600">
                        Duration
                      </p>

                      <p className="mt-1 font-bold">
                        {workout.duration} min
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-600">
                        Calories
                      </p>

                      <p className="mt-1 font-bold">
                        {workout.caloriesBurned} kcal
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-zinc-600">
                        Rating
                      </p>

                      <p className="mt-1 font-bold text-[#ccff00]">
                        ★ {workout.rating}
                      </p>
                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 md:flex-row md:px-10">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <Image
              src="/logho.png"
              alt="FitLog"
              width={34}
              height={34}
            />

            <span className="font-black tracking-wider">
              FIT<span className="text-[#ccff00]">
                LOG
              </span>
            </span>

          </Link>

          <p className="text-center text-sm text-zinc-600">
            © 2026 FitLog — Workout Library. Train hard,
            log honest.
          </p>

        </div>

      </footer>

    </main>
  );
}