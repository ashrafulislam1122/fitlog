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
    description:
      "A classic upper-body pressing exercise targeting the chest and arms.",
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
    description:
      "A bodyweight pulling exercise that targets the back and arms.",
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
    description:
      "A compound lower-body exercise focusing on the legs and core.",
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
    description:
      "A pressing movement that develops the shoulders and arms.",
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
    description:
      "A simple isolation exercise for the biceps.",
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
    description:
      "A core-focused bodyweight exercise.",
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
    description:
      "A full-body conditioning exercise combining strength and cardio.",
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
    description:
      "A compound lift targeting the posterior chain.",
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
    description:
      "A classic bodyweight exercise for the chest, arms, and core.",
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
    description:
      "A lower-body movement that works the legs and improves balance.",
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
    description:
      "A rotational core exercise.",
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
    description:
      "A dynamic full-body exercise using a kettlebell.",
    instructions: [
      "Stand with the kettlebell between your feet.",
      "Hinge at your hips and grip the kettlebell.",
      "Drive your hips forward to swing the kettlebell.",
      "Control the kettlebell as it returns between your legs.",
    ],
  },
];

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

        const foundWorkout = workoutData.find(
          (item) => item.id === Number(id)
        );

        if (!foundWorkout) {
          throw new Error("Workout not found");
        }

        setWorkout(foundWorkout);
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
                <p className="text-xs font-bold text-black/40">
                  SETS
                </p>
                <p className="mt-2 font-bold">{workout.sets}</p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs font-bold text-black/40">
                  REPS
                </p>
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