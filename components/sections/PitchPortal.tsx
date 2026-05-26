"use client";
// components/sections/PitchPortal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Futuristic, animated multi-step pitch submission form.
// Uses React Hook Form + Zod for validation, Framer Motion for transitions.
// Submits via Next.js Server Action — zero client-side API keys exposed.
// ─────────────────────────────────────────────────────────────────────────────
import { motion, AnimatePresence, Variants } from "framer-motion";
import React, { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertTriangle } from "lucide-react";

import { submitPitch } from "@/actions/pitch";
import { pitchFormSchema, type PitchFormValues } from "@/config/pitch-schema";
import { siteConfig } from "@/config/site";

// ── Step Definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    title: "Who are you?",
    subtitle: "Let's start with the founder.",
    fields: ["name", "email"] as const,
  },
  {
    id: 2,
    title: "The Big Idea",
    subtitle: "Name your venture and its current stage.",
    fields: ["ideaName", "stage"] as const,
  },
  {
    id: 3,
    title: "The Problem",
    subtitle: "What pain are you solving? Be specific.",
    fields: ["problem"] as const,
  },
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

function FieldWrapper({ label, error, children, hint }: FieldWrapperProps) {
  return (
    <div className="group flex flex-col gap-2">
      <label className="text-xs font-mono uppercase tracking-[0.15em] text-white/50 group-focus-within:text-cyan-400 transition-colors duration-300">
        {label}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-rose-400 font-mono"
          >
            <AlertTriangle size={12} />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/30 font-mono"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputBase =
  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 " +
  "outline-none transition-all duration-300 " +
  "focus:border-cyan-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08),0_0_20px_rgba(34,211,238,0.05)] " +
  "hover:border-white/20 hover:bg-white/[0.04] " +
  "aria-[invalid=true]:border-rose-500/50 aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgba(244,63,94,0.08)]";

// ── Stage Selector ────────────────────────────────────────────────────────────

interface StageSelectorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function StageSelector({ value, onChange, error }: StageSelectorProps) {
  const { stages } = siteConfig.pitchPortal;
  return (
    <FieldWrapper label="Current Stage" error={error}>
      <div className="grid grid-cols-2 gap-2">
        {stages.map((stage) => (
          <motion.button
            key={stage.value}
            type="button"
            onClick={() => onChange(stage.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={[
              "relative px-4 py-3 rounded-xl border text-sm font-mono transition-all duration-300 text-left overflow-hidden",
              value === stage.value
                ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.1)]"
                : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/70 hover:bg-white/[0.04]",
            ].join(" ")}
          >
            {value === stage.value && (
              <motion.span
                layoutId="stage-pill"
                className="absolute inset-0 bg-cyan-400/5 rounded-xl"
              />
            )}
            <span className="relative z-10">{stage.label}</span>
          </motion.button>
        ))}
      </div>
    </FieldWrapper>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: i < step ? 1 : 1,
                backgroundColor: i < step ? "rgb(34,211,238)" : i === step - 1 ? "rgb(34,211,238)" : "rgba(255,255,255,0.1)",
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors"
              style={{
                borderColor: i < step ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.1)",
              }}
            >
              {i < step - 1 ? (
                <CheckCircle size={14} className="text-black" />
              ) : (
                <span className={`text-xs font-mono ${i === step - 1 ? "text-black font-bold" : "text-white/30"}`}>
                  {i + 1}
                </span>
              )}
            </motion.div>
            {i === step - 1 && (
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/40"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-violet-500"
                animate={{ width: i < step - 1 ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      <span className="text-xs font-mono text-white/30 ml-1">
        {step} / {total}
      </span>
    </div>
  );
}

// ── Success State ─────────────────────────────────────────────────────────────

function SuccessState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 0 0 rgba(52,211,153,0.3)", "0 0 0 20px rgba(52,211,153,0)", "0 0 0 0 rgba(52,211,153,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle size={36} className="text-emerald-400" />
        </motion.div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white tracking-tight">Pitch Received!</h3>
        <p className="text-sm text-white/60 leading-relaxed max-w-sm">{message}</p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20">
        <Sparkles size={14} className="text-emerald-400" />
        <span className="text-xs font-mono text-emerald-300">Welcome to the founding cohort</span>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PitchPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { sectionLabel, headline, subheadline } = siteConfig.pitchPortal;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PitchFormValues>({
    resolver: zodResolver(pitchFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      ideaName: "",
      stage: undefined,
      problem: "",
    },
  });

  const stageValue = watch("stage");
  const problemValue = watch("problem");

  const currentStepConfig = STEPS[currentStep - 1];

  // Navigate forward: validate current step fields first
  const handleNext = async () => {
    const valid = await trigger(currentStepConfig.fields as unknown as (keyof PitchFormValues)[]);
    if (!valid) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit: SubmitHandler<PitchFormValues> = (data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitPitch(data);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <section id="pitch" className="relative py-32 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {headline}
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            {subheadline}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Glass border gradient */}
            <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-white/15 via-white/5 to-white/10 pointer-events-none" />
            <div className="relative rounded-2xl bg-[#0d0d0f]/80 backdrop-blur-xl p-8 md:p-10">
              {/* Subtle inner grid */}
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.03]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="relative z-10">
                {successMessage ? (
                  <SuccessState message={successMessage} />
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <ProgressBar step={currentStep} total={STEPS.length} />

                    {/* Step header */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`header-${currentStep}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                      >
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {currentStepConfig.title}
                        </h3>
                        <p className="text-sm text-white/40 mt-1 font-mono">
                          {currentStepConfig.subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Step fields */}
                    <div className="relative overflow-hidden min-h-[200px]">
                      <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="flex flex-col gap-5"
                        >
                          {currentStep === 1 && (
                            <>
                              <FieldWrapper label="Full Name" error={errors.name?.message}>
                                <input
                                  {...register("name")}
                                  className={inputBase}
                                  placeholder="Aarav Sharma"
                                  autoComplete="name"
                                  aria-invalid={!!errors.name}
                                />
                              </FieldWrapper>
                              <FieldWrapper
                                label="Email Address"
                                error={errors.email?.message}
                                hint="Use your @iiserbhopal.ac.in email for priority review."
                              >
                                <input
                                  {...register("email")}
                                  type="email"
                                  className={inputBase}
                                  placeholder="aarav@iiserbhopal.ac.in"
                                  autoComplete="email"
                                  aria-invalid={!!errors.email}
                                />
                              </FieldWrapper>
                            </>
                          )}

                          {currentStep === 2 && (
                            <>
                              <FieldWrapper label="Idea / Venture Name" error={errors.ideaName?.message}>
                                <input
                                  {...register("ideaName")}
                                  className={inputBase}
                                  placeholder="e.g. NeuroGrid, SolarMesh, BioTrace..."
                                  aria-invalid={!!errors.ideaName}
                                />
                              </FieldWrapper>
                              <StageSelector
                                value={stageValue ?? ""}
                                onChange={(val) =>
                                  setValue("stage", val as PitchFormValues["stage"], {
                                    shouldValidate: true,
                                  })
                                }
                                error={errors.stage?.message}
                              />
                            </>
                          )}

                          {currentStep === 3 && (
                            <FieldWrapper
                              label="The Problem You're Solving"
                              error={errors.problem?.message}
                              hint={`${problemValue?.length ?? 0} / 2000 characters (min 50)`}
                            >
                              <textarea
                                {...register("problem")}
                                rows={6}
                                className={`${inputBase} resize-none`}
                                placeholder="Describe the problem clearly: who faces it, how often, and why existing solutions fall short..."
                                aria-invalid={!!errors.problem}
                              />
                            </FieldWrapper>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Server error */}
                    <AnimatePresence>
                      {serverError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 font-mono"
                        >
                          <AlertTriangle size={14} className="shrink-0" />
                          {serverError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 gap-4">
                      {currentStep > 1 ? (
                        <motion.button
                          type="button"
                          onClick={handleBack}
                          whileHover={{ x: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/70 transition-all duration-200 font-mono"
                        >
                          <ArrowLeft size={14} />
                          Back
                        </motion.button>
                      ) : (
                        <div />
                      )}

                      {currentStep < STEPS.length ? (
                        <motion.button
                          type="button"
                          onClick={handleNext}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all duration-200 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                        >
                          Continue
                          <ArrowRight size={14} />
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={isPending}
                          whileHover={!isPending ? { scale: 1.02 } : {}}
                          whileTap={!isPending ? { scale: 0.98 } : {}}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_32px_rgba(34,211,238,0.2)]"
                        >
                          {isPending ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              Submit Pitch
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-white/20 font-mono mt-6">
            Your idea is safe with us. We don&apos;t share submissions with third parties.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
