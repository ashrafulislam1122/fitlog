"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const API_URL = "https://api.api-store.workers.dev/api/fitlog";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("duration");
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await res.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
        toast.error("Failed to load workouts");
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();

    const savedPlan = localStorage.getItem("fitlog-plan");
    const savedList = localStorage.getItem("fitlog-saved");

    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }

    if (savedList) {
      setSaved(JSON.parse(savedList));
    }
  }, []);

  const sortedWorkouts = useMemo(() => {
    const list = [...workouts];

    if (sortBy === "duration") {
      list.sort((a, b) => a.duration - b.duration);
    }

    if (sortBy === "calories") {
      list.sort((a, b) => b.caloriesBurned - a.caloriesBurned);
    }

    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [workouts, sortBy]);

  const addToPlan = (id: number) => {
    if (plan.includes(id)) {
      toast.warning("Already in your plan!");
      return;
    }

    if (plan.length >= 5) {
      toast.warning("Maximum 5 workouts allowed!");
      return;
    }

    const newPlan = [...plan, id];

    setPlan(newPlan);
    localStorage.setItem("fitlog-plan", JSON.stringify(newPlan));

    toast.success("Added to today's plan!");
  };

  const saveWorkout = (id: number) => {
    if (saved.includes(id)) {
      toast.warning("Already saved!");
      return;
    }

    const newSaved = [...saved, id];

    setSaved(newSaved);
    localStorage.setItem("fitlog-saved", JSON.stringify(newSaved));

    toast.success("Saved for later!");
  };

  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="text-2xl font-black">
            FITLOG
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="font-semibold text-lime-600"
            >
              Workout
            </Link>

            <Link
              href="/my-plan"
              className="font-semibold hover:text-lime-600"
            >
              My Plan
            </Link>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/my-plan"
              className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold"
            >
              Plan {plan.length}
            </Link>

            <Link
              href="/my-plan"
              className="hidden rounded-lg border border-black px-4 py-2 text-sm font-bold sm:block"
            >
              Saved {saved.length}
            </Link>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid overflow-hidden rounded-3xl bg-black lg:grid-cols-2">

          <div className="flex flex-col justify-center px-8 py-14 text-white md:px-12 lg:px-16">

            <p className="mb-5 text-sm font-bold tracking-[3px] text-lime-400">
              WORKOUT LIBRARY
            </p>

            <h1 className="text-5xl font-black leading-[0.95] md:text-6xl lg:text-7xl">
              TRAIN WITH
              <br />
              INTENT.
              <br />
              LOG EVERY SET.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
              Build your training routine with focused workouts,
              track every session, and stay consistent with FitLog.
            </p>

            <a
              href="#library"
              className="mt-8 w-fit rounded-lg bg-lime-400 px-7 py-4 font-black text-black hover:bg-lime-300"
            >
              BROWSE WORKOUTS
            </a>

          </div>

          <div className="relative min-h-[350px] lg:min-h-[520px]">

            <Image
              src="/banner.png"
              alt="Workout banner"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute bottom-6 left-6 right-6 flex justify-between">

              <Link
                href="/my-plan"
                className="rounded-xl bg-white px-5 py-3"
              >
                <span className="block text-xs font-bold text-gray-400">
                  PLAN
                </span>
                <span className="text-2xl font-black">
                  {plan.length}
                </span>
              </Link>

              <Link
                href="/my-plan"
                className="rounded-xl bg-lime-400 px-5 py-3"
              >
                <span className="block text-xs font-bold">
                  SAVED
                </span>
                <span className="text-2xl font-black">
                  {saved.length}
                </span>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* LIBRARY */}
      <section
        id="library"
        className="mx-auto max-w-7xl px-6 py-14"
      >

        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="mb-2 text-sm font-bold tracking-[3px] text-lime-600">
              WORKOUT COLLECTION
            </p>

            <h2 className="text-4xl font-black md:text-5xl">
              THE LIBRARY
            </h2>

            <p className="mt-3 text-gray-500">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>

        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-lime-500" />
              <p className="mt-4 font-semibold">
                Loading workouts...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {sortedWorkouts.map((workout) => (

              <article
                key={workout.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >

                <Link href={`/workout/${workout.id}`}>

                  <div className="relative h-56 overflow-hidden bg-gray-100">

                    <Image
                      src={workout.image}
                      alt={workout.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-300 hover:scale-105"
                    />

                    <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold">
                      ★ {workout.rating}
                    </span>

                  </div>

                </Link>

                <div className="p-5">

                  <div className="mb-3 flex flex-wrap gap-2">

                    {workout.muscleGroups.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold"
                      >
                        {muscle}
                      </span>
                    ))}

                  </div>

                  <Link href={`/workout/${workout.id}`}>
                    <h3 className="text-xl font-black hover:text-lime-600">
                      {workout.name}
                    </h3>
                  </Link>

                  <p className="mt-2 text-sm text-gray-500">
                    {workout.equipment}
                  </p>

                  <div className="mt-5 grid grid-cols-3 border-t pt-4 text-center">

                    <div>
                      <p className="text-xs text-gray-400">
                        DURATION
                      </p>
                      <p className="font-bold">
                        {workout.duration}m
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        CALORIES
                      </p>
                      <p className="font-bold">
                        {workout.caloriesBurned}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        RATING
                      </p>
                      <p className="font-bold">
                        {workout.rating}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() => addToPlan(workout.id)}
                      className="flex-1 rounded-lg bg-lime-400 py-3 text-sm font-black hover:bg-lime-300"
                    >
                      ADD TO PLAN
                    </button>

                    <button
                      onClick={() => saveWorkout(workout.id)}
                      className="rounded-lg border border-black px-4 text-xl hover:bg-black hover:text-white"
                    >
                      ♡
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="bg-black px-6 py-10 text-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row">

          <div>
            <h3 className="text-2xl font-black">
              FITLOG
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Train with intent. Log every set.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 FitLog. All rights reserved.
          </p>

        </div>

      </footer>

      <ToastContainer position="top-right" autoClose={2000} />

    </main>
  );
}