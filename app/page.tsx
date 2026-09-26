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

const workoutData: Workout[] = [
  {
    id: 1,
    name: "Barbell Bench Press",
    image:
      "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740",
    muscleGroups: ["Chest", "Arms"],
    equipment: "Barbell, Bench",
    difficulty: "Intermediate",
    duration: 25,
    caloriesBurned: 180,
    sets: 4,
    reps: "6-8",
    rating: 4.8,
    description: "A classic upper-body pressing exercise targeting the chest and arms.",
    instructions: [
      "Lie flat on the bench and grip the bar slightly wider than shoulder width.",
      "Lower the bar toward your chest with control.",
      "Press the bar upward until your arms are extended.",
      "Repeat for the required reps.",
    ],
  },
  {
    id: 2,
    name: "Pull-Up",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691400.jpg?w=740",
    muscleGroups: ["Back", "Arms"],
    equipment: "Pull-up Bar",
    difficulty: "Intermediate",
    duration: 15,
    caloriesBurned: 120,
    sets: 4,
    reps: "6-10",
    rating: 4.7,
    description: "A bodyweight pulling exercise that targets the back and arms.",
    instructions: [
      "Grip the pull-up bar with your hands slightly wider than your shoulders.",
      "Pull your body upward toward the bar.",
      "Keep your body controlled throughout the movement.",
      "Lower yourself slowly and repeat.",
    ],
  },
  {
    id: 3,
    name: "Back Squat",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691401.jpg?w=740",
    muscleGroups: ["Legs", "Core"],
    equipment: "Barbell, Rack",
    difficulty: "Advanced",
    duration: 30,
    caloriesBurned: 240,
    sets: 5,
    reps: "5-8",
    rating: 4.9,
    description: "A compound lower-body exercise focusing on the legs and core.",
    instructions: [
      "Position the barbell securely across your upper back.",
      "Stand with your feet around shoulder width apart.",
      "Lower your body by bending your knees and hips.",
      "Drive through your feet to return to the starting position.",
    ],
  },
  {
    id: 4,
    name: "Overhead Press",
    image:
      "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666703.jpg?w=740",
    muscleGroups: ["Shoulders", "Arms"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    duration: 20,
    caloriesBurned: 150,
    sets: 4,
    reps: "6-8",
    rating: 4.6,
    description: "A pressing movement that develops the shoulders and arms.",
    instructions: [
      "Hold the barbell at shoulder level.",
      "Brace your core and keep your body stable.",
      "Press the barbell overhead.",
      "Lower it back to shoulder level with control.",
    ],
  },
  {
    id: 5,
    name: "Dumbbell Bicep Curl",
    image:
      "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666702.jpg?w=740",
    muscleGroups: ["Arms"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    duration: 12,
    caloriesBurned: 80,
    sets: 3,
    reps: "10-12",
    rating: 4.3,
    description: "A simple isolation exercise for the biceps.",
    instructions: [
      "Hold a dumbbell in each hand.",
      "Keep your elbows close to your body.",
      "Curl the dumbbells upward.",
      "Lower them slowly to the starting position.",
    ],
  },
  {
    id: 6,
    name: "Hollow-Body Plank",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691489.jpg?w=740",
    muscleGroups: ["Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    duration: 10,
    caloriesBurned: 60,
    sets: 3,
    reps: "30-45s",
    rating: 4.4,
    description: "A core-focused bodyweight exercise.",
    instructions: [
      "Lie on your back and engage your core.",
      "Lift your shoulders and legs slightly from the floor.",
      "Keep your lower back controlled.",
      "Hold the position for the required time.",
    ],
  },
  {
    id: 7,
    name: "Burpee",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-business-character_1048-16544.jpg?w=740",
    muscleGroups: ["Full Body"],
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    duration: 12,
    caloriesBurned: 160,
    sets: 4,
    reps: "8-12",
    rating: 4.2,
    description: "A full-body conditioning exercise combining strength and cardio.",
    instructions: [
      "Start standing with your feet shoulder width apart.",
      "Squat down and place your hands on the floor.",
      "Move your feet back into a plank position.",
      "Return to standing and repeat.",
    ],
  },
  {
    id: 8,
    name: "Conventional Deadlift",
    image:
      "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666704.jpg?w=740",
    muscleGroups: ["Back", "Legs"],
    equipment: "Barbell",
    difficulty: "Advanced",
    duration: 28,
    caloriesBurned: 260,
    sets: 4,
    reps: "3-5",
    rating: 4.9,
    description: "A compound lift targeting the posterior chain.",
    instructions: [
      "Stand with the barbell over your mid-foot.",
      "Bend your hips and knees while keeping your back controlled.",
      "Lift the bar by driving through your feet.",
      "Lower the bar with control.",
    ],
  },
  {
    id: 9,
    name: "Push-Up",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691429.jpg?w=740",
    muscleGroups: ["Chest", "Arms", "Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    duration: 10,
    caloriesBurned: 90,
    sets: 3,
    reps: "12-15",
    rating: 4.5,
    description: "A classic bodyweight exercise for the chest, arms, and core.",
    instructions: [
      "Start in a high plank position.",
      "Keep your body straight.",
      "Lower your chest toward the floor.",
      "Push yourself back up.",
    ],
  },
  {
    id: 10,
    name: "Walking Lunge",
    image:
      "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666701.jpg?w=740",
    muscleGroups: ["Legs"],
    equipment: "Dumbbells (optional)",
    difficulty: "Beginner",
    duration: 18,
    caloriesBurned: 170,
    sets: 3,
    reps: "10-12/leg",
    rating: 4.4,
    description: "A lower-body movement that works the legs and improves balance.",
    instructions: [
      "Stand tall with your feet together.",
      "Step forward with one leg.",
      "Lower your body into a lunge.",
      "Push through the front foot and step forward with the other leg.",
    ],
  },
  {
    id: 11,
    name: "Russian Twist",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691487.jpg?w=740",
    muscleGroups: ["Core"],
    equipment: "Medicine Ball",
    difficulty: "Beginner",
    duration: 8,
    caloriesBurned: 70,
    sets: 3,
    reps: "16-20",
    rating: 4.1,
    description: "A rotational core exercise.",
    instructions: [
      "Sit with your knees bent and feet supported.",
      "Lean your upper body back slightly.",
      "Hold the medicine ball in front of you.",
      "Rotate your torso from side to side.",
    ],
  },
  {
    id: 12,
    name: "Kettlebell Swing",
    image:
      "https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691505.jpg?w=740",
    muscleGroups: ["Full Body", "Shoulders"],
    equipment: "Kettlebell",
    difficulty: "Intermediate",
    duration: 16,
    caloriesBurned: 200,
    sets: 5,
    reps: "12-15",
    rating: 4.7,
    description: "A dynamic full-body exercise using a kettlebell.",
    instructions: [
      "Stand with the kettlebell between your feet.",
      "Hinge at your hips and grip the kettlebell.",
      "Drive your hips forward to swing the kettlebell.",
      "Control the kettlebell as it returns between your legs.",
    ],
  },
];

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    setWorkouts(workoutData);
    setLoading(false);
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
                    unoptimized
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