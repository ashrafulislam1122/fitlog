"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups?: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions?: string[];
};

export default function WorkoutDetails() {
  const params = useParams();
  const id = params.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [planAdded, setPlanAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadWorkout() {
      try {
        const response = await fetch(
          `https://api.api-store.workers.dev/api/fitlog/${id}`
        );

        if (!response.ok) {
          throw new Error("Workout not found");
        }

        const data = await response.json();

        setWorkout(data);

        const plan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const savedItems = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        setPlanAdded(
          plan.some((item: any) => {
            const itemId =
              typeof item === "number" ? item : item.id;

            return itemId === data.id;
          })
        );

        setSaved(
          savedItems.some((item: any) => {
            const itemId =
              typeof item === "number" ? item : item.id;

            return itemId === data.id;
          })
        );
      } catch (error) {
        console.error(error);
        setWorkout(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadWorkout();
    }
  }, [id]);

  function addToPlan() {
    if (!workout) return;

    const oldPlan = JSON.parse(
      localStorage.getItem("fitlog-plan") || "[]"
    );

    const plan = oldPlan
      .map((item: any) => {
        if (typeof item === "number") {
          return null;
        }

        return item;
      })
      .filter(Boolean);

    if (
      plan.some(
        (item: Workout) => item.id === workout.id
      )
    ) {
      toast.info("Already added to today's plan!");
      setPlanAdded(true);
      return;
    }

    if (plan.length >= 5) {
      toast.warning(
        "Today's plan can contain maximum 5 workouts."
      );
      return;
    }

    const updatedPlan = [...plan, workout];

    localStorage.setItem(
      "fitlog-plan",
      JSON.stringify(updatedPlan)
    );

    setPlanAdded(true);

    window.dispatchEvent(new Event("storage"));

    toast.success("Added to today's plan!");
  }

  function saveForLater() {
    if (!workout) return;

    const oldSaved = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    const savedItems = oldSaved
      .map((item: any) => {
        if (typeof item === "number") {
          return null;
        }

        return item;
      })
      .filter(Boolean);

    if (
      savedItems.some(
        (item: Workout) => item.id === workout.id
      )
    ) {
      toast.info("Already saved for later!");
      setSaved(true);
      return;
    }

    const updatedSaved = [...savedItems, workout];

    localStorage.setItem(
      "fitlog-saved",
      JSON.stringify(updatedSaved)
    );

    setSaved(true);

    window.dispatchEvent(new Event("storage"));

    toast.success("Saved for later!");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-[#ccff00]" />

          <p className="mt-5 font-bold text-zinc-500">
            Loading workout...
          </p>
        </div>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <p className="text-[#ccff00]">404</p>

        <h1 className="mt-3 text-4xl font-black">
          WORKOUT NOT FOUND
        </h1>

        <Link
          href="/"
          className="mt-7 rounded-full bg-[#ccff00] px-7 py-3 font-black text-black"
        >
          BACK TO WORKOUTS
        </Link>
      </main>
    );
  }

  const muscles = workout.muscleGroups || [];

  const instructions = workout.instructions || [];

  return (
    <main className="min-h-screen bg-black text-white">

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />

      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="FitLog"
              width={42}
              height={42}
            />

            <span className="text-2xl font-black">
              FIT<span className="text-[#ccff00]">
                LOG
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="text-sm font-bold text-zinc-400 hover:text-white"
            >
              WORKOUT
            </Link>

            <Link
              href="/my-plan"
              className="text-sm font-bold text-[#ccff00]"
            >
              MY PLAN
            </Link>

          </div>

          <div className="flex gap-2">

            <Link
              href="/my-plan"
              className="rounded-full bg-[#ccff00] px-4 py-2 text-xs font-black text-black"
            >
              PLAN
            </Link>

            <Link
              href="/my-plan"
              className="hidden rounded-full border border-zinc-700 px-4 py-2 text-xs font-black sm:block"
            >
              SAVED
            </Link>

          </div>

        </div>
      </nav>

      {/* DETAILS */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 lg:min-h-[620px]">

            <Image
              src={workout.image}
              alt={workout.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

          </div>

          {/* CONTENT */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
              WORKOUT DETAILS
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
              {workout.name}
            </h1>

            <p className="mt-6 leading-8 text-zinc-400">
              {workout.description}
            </p>

            {/* TAGS */}
            <div className="mt-6 flex flex-wrap gap-2">

              {muscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-[#ccff00] px-4 py-2 text-xs font-black uppercase text-black"
                >
                  {muscle}
                </span>
              ))}

            </div>

            {/* SPECS */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800">

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  EQUIPMENT
                </p>
                <p className="mt-2 font-bold">
                  {workout.equipment}
                </p>
              </div>

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  DIFFICULTY
                </p>
                <p className="mt-2 font-bold">
                  {workout.difficulty}
                </p>
              </div>

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  SETS
                </p>
                <p className="mt-2 font-bold">
                  {workout.sets}
                </p>
              </div>

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  REPS
                </p>
                <p className="mt-2 font-bold">
                  {workout.reps}
                </p>
              </div>

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  DURATION
                </p>
                <p className="mt-2 font-bold">
                  {workout.duration} min
                </p>
              </div>

              <div className="bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  CALORIES
                </p>
                <p className="mt-2 font-bold">
                  {workout.caloriesBurned} kcal
                </p>
              </div>

              <div className="col-span-2 bg-zinc-950 p-5">
                <p className="text-xs text-zinc-600">
                  RATING
                </p>

                <p className="mt-2 font-bold">
                  <span className="text-[#ccff00]">
                    ★
                  </span>{" "}
                  {workout.rating} / 5
                </p>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={addToPlan}
                className={`rounded-full px-6 py-4 font-black ${
                  planAdded
                    ? "bg-zinc-800 text-zinc-500"
                    : "bg-[#ccff00] text-black hover:scale-[1.02]"
                }`}
              >
                {planAdded
                  ? "✓ ADDED TO TODAY'S PLAN"
                  : "+ ADD TO TODAY'S PLAN"}
              </button>

              <button
                type="button"
                onClick={saveForLater}
                className={`rounded-full border px-6 py-4 font-black ${
                  saved
                    ? "border-zinc-800 text-zinc-500"
                    : "border-zinc-700 hover:border-[#ccff00] hover:text-[#ccff00]"
                }`}
              >
                {saved
                  ? "✓ SAVED FOR LATER"
                  : "♡ SAVE FOR LATER"}
              </button>

            </div>

          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="mt-20">

          <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
            HOW TO DO IT
          </p>

          <h2 className="mt-3 text-4xl font-black">
            INSTRUCTIONS
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            {instructions.map(
              (instruction, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                >

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#ccff00] font-black text-black">
                    {index + 1}
                  </div>

                  <p className="leading-7 text-zinc-400">
                    {instruction}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 md:flex-row md:px-10">

          <div className="flex items-center gap-3">

            <Image
              src="/logo.png"
              alt="FitLog"
              width={34}
              height={34}
            />

            <span className="font-black tracking-wider">
              FIT<span className="text-[#ccff00]">
                LOG
              </span>
            </span>

          </div>

          <p className="text-center text-sm text-zinc-600">
            © 2026 FitLog — Workout Library. Train hard, log
            honest.
          </p>

        </div>

      </footer>

    </main>
  );
}