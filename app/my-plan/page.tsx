"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function MyPlan() {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "saved">(
    "plan"
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data: Workout[] = await response.json();

        const storedPlan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const storedSaved = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        const storedDone = JSON.parse(
          localStorage.getItem("fitlog-done") || "[]"
        );

        const planIds = storedPlan
          .map((item: any) =>
            typeof item === "number" ? item : item?.id
          )
          .filter(Boolean);

        const savedIds = storedSaved
          .map((item: any) =>
            typeof item === "number" ? item : item?.id
          )
          .filter(Boolean);

        const realPlan = data.filter((workout) =>
          planIds.includes(workout.id)
        );

        const realSaved = data.filter((workout) =>
          savedIds.includes(workout.id)
        );

        setPlan(realPlan);
        setSaved(realSaved);
        setDone(storedDone);

        localStorage.setItem(
          "fitlog-plan",
          JSON.stringify(realPlan)
        );

        localStorage.setItem(
          "fitlog-saved",
          JSON.stringify(realSaved)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function showMessage(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function removeFromPlan(id: number) {
    const updated = plan.filter(
      (workout) => workout.id !== id
    );

    setPlan(updated);

    localStorage.setItem(
      "fitlog-plan",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("storage"));

    showMessage("Removed from today's plan!");
  }

  function removeFromSaved(id: number) {
    const updated = saved.filter(
      (workout) => workout.id !== id
    );

    setSaved(updated);

    localStorage.setItem(
      "fitlog-saved",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("storage"));

    showMessage("Removed from saved!");
  }

  function markAsDone(id: number) {
    if (done.includes(id)) {
      showMessage("Workout already completed!");
      return;
    }

    const updated = [...done, id];

    setDone(updated);

    localStorage.setItem(
      "fitlog-done",
      JSON.stringify(updated)
    );

    showMessage("Workout marked as done!");
  }

  const currentWorkouts =
    activeTab === "plan" ? plan : saved;

  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-[#ccff00]" />

          <p className="mt-5 font-bold text-zinc-500">
            Loading workouts...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

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
              className="rounded-full bg-[#ccff00] px-5 py-2 text-sm font-black text-black"
            >
              MY PLAN
            </Link>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setActiveTab("plan")}
              className="rounded-full bg-[#ccff00] px-4 py-2 text-xs font-black text-black"
            >
              PLAN {plan.length}
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className="hidden rounded-full border border-zinc-700 px-4 py-2 text-xs font-black sm:block"
            >
              SAVED {saved.length}
            </button>

          </div>

        </div>

      </nav>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20">

        <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
          FITLOG
        </p>

        <h1 className="mt-3 text-5xl font-black uppercase md:text-7xl">
          MY PLAN
        </h1>

        <p className="mt-5 max-w-2xl text-zinc-500">
          Cap of five lifts for today. Finish them, then load
          more.
        </p>

        {/* METRICS */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

            <p className="text-xs font-black text-zinc-600">
              EXERCISES
            </p>

            <p className="mt-2 text-4xl font-black">
              {plan.length}
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

            <p className="text-xs font-black text-zinc-600">
              MINUTES
            </p>

            <p className="mt-2 text-4xl font-black">
              {totalMinutes}
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

            <p className="text-xs font-black text-zinc-600">
              CALORIES
            </p>

            <p className="mt-2 text-4xl font-black">
              {totalCalories}
            </p>

          </div>

        </div>

        {/* TABS */}
        <div className="mt-12 flex gap-3 border-b border-zinc-800 pb-5">

          <button
            onClick={() => setActiveTab("plan")}
            className={`rounded-full px-5 py-3 text-sm font-black ${
              activeTab === "plan"
                ? "bg-[#ccff00] text-black"
                : "border border-zinc-700 text-zinc-400"
            }`}
          >
            TODAY'S PLAN
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`rounded-full px-5 py-3 text-sm font-black ${
              activeTab === "saved"
                ? "bg-[#ccff00] text-black"
                : "border border-zinc-700 text-zinc-400"
            }`}
          >
            SAVED
          </button>

        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-6 rounded-2xl border border-[#ccff00]/30 bg-[#ccff00]/10 px-5 py-4 text-sm font-bold text-[#ccff00]">
            {message}
          </div>
        )}

        {/* EMPTY */}
        {currentWorkouts.length === 0 ? (

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center">

            <p className="text-sm font-black tracking-[0.25em] text-[#ccff00]">
              NOTHING HERE YET
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase">
              Your list is empty
            </h2>

            <p className="mx-auto mt-4 max-w-md leading-7 text-zinc-500">
              Browse the library and add a lift to get today
              moving.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-full bg-[#ccff00] px-7 py-4 font-black text-black"
            >
              GO TO WORKOUTS
            </Link>

          </div>

        ) : (

          /* WORKOUT CARDS */
          <div className="mt-8 space-y-5">

            {currentWorkouts.map((workout) => {

              const muscles = workout.muscleGroups || [];

              return (
                <div
                  key={workout.id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
                >

                  <div className="flex flex-col md:flex-row">

                    {/* IMAGE */}
                    <div className="relative h-64 w-full md:h-auto md:w-72">

                      <Image
                        src={workout.image}
                        alt={workout.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 288px"
                        className="object-cover"
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6 md:p-8">

                      <div className="flex flex-col gap-4 md:flex-row md:justify-between">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                            {muscles.length > 0
                              ? muscles.join(" • ")
                              : "FULL BODY"}
                          </p>

                          <h2 className="mt-2 text-2xl font-black uppercase">
                            {workout.name}
                          </h2>

                          <p className="mt-2 text-zinc-500">
                            {workout.equipment}
                          </p>

                        </div>

                        {activeTab === "plan" &&
                          done.includes(workout.id) && (
                            <span className="h-fit w-fit rounded-full bg-[#ccff00] px-4 py-2 text-xs font-black text-black">
                              ✓ DONE
                            </span>
                          )}

                      </div>

                      {/* STATS */}
                      <div className="mt-6 flex flex-wrap gap-5 text-sm font-bold text-zinc-500">

                        <span>
                          ⏱ {workout.duration} min
                        </span>

                        <span>
                          🔥 {workout.caloriesBurned} kcal
                        </span>

                        <span>
                          <span className="text-[#ccff00]">
                            ★
                          </span>{" "}
                          {workout.rating}
                        </span>

                      </div>

                      {/* BUTTONS */}
                      <div className="mt-7 flex flex-wrap gap-3">

                        <Link
                          href={`/workout/${workout.id}`}
                          className="rounded-full bg-[#ccff00] px-5 py-3 text-sm font-black text-black"
                        >
                          VIEW DETAILS
                        </Link>

                        {activeTab === "plan" && (
                          <>
                            <button
                              onClick={() =>
                                markAsDone(workout.id)
                              }
                              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black hover:border-[#ccff00] hover:text-[#ccff00]"
                            >
                              ✓ MARK AS DONE
                            </button>

                            <button
                              onClick={() =>
                                removeFromPlan(workout.id)
                              }
                              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black hover:border-red-500 hover:text-red-400"
                            >
                              ✕ REMOVE
                            </button>
                          </>
                        )}

                        {activeTab === "saved" && (
                          <button
                            onClick={() =>
                              removeFromSaved(workout.id)
                            }
                            className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black hover:border-red-500 hover:text-red-400"
                          >
                            ✕ REMOVE
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 md:flex-row md:px-10">

          <div className="flex items-center gap-3">

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