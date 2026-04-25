"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, question: "What's your company name?", field: "companyName", placeholder: "e.g. Example Corp", type: "text" },
  { id: 2, question: "What's your company email?", field: "companyEmail", placeholder: "e.g. Name@ExampleCorp.com", type: "email" },
  { id: 3, question: "Where is your company located?", field: "companyLocation", placeholder: "e.g. Doha, Qatar", type: "text" },
  { id: 4, question: "What is your primary company activity?", field: "primaryActivity", placeholder: "e.g. Software Development", type: "text" },
  { id: 5, question: "Who are your shareholders?", field: "shareholders", placeholder: "", type: "shareholders" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyLocation: "",
    primaryActivity: "",
    shareholders: [] as { name: string; percentage: number }[],
  });

  useEffect(() => {
  fetch("/api/assessment")
    .then((res) => res.json())
    .then((data) => {
      if (data.assessment) {
        setFormData({
          companyName: data.assessment.companyName,
          companyEmail: data.assessment.companyEmail,
          companyLocation: data.assessment.companyLocation,
          primaryActivity: data.assessment.primaryActivity,
          shareholders: JSON.parse(data.assessment.shareholders),
        });
      } else {
        setFormData({
          companyName: "",
          companyEmail: "",
          companyLocation: "",
          primaryActivity: "",
          shareholders: [],
        });
      }
    });
}, []);

  const step = steps[currentStep];
  const progress = (currentStep / steps.length) * 100;

  const handleContinue = async () => {
    if (currentStep === steps.length - 1) {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push("/chat");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="w-full h-1 rounded-full bg-surface">
            <div className="h-1 rounded-full transition-all duration-500 bg-primary"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 space-y-6 bg-surface">
          <h2 className="text-2xl font-bold text-primary">{step.question}</h2>

          {step.type === "shareholders" ? (
            <div className="space-y-3">
              {formData.shareholders.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={s.name}
                    onChange={(e) => {
                      const updated = [...formData.shareholders];
                      updated[i].name = e.target.value;
                      setFormData({ ...formData, shareholders: updated });
                    }}
                    className="flex-1 rounded-xl px-4 py-3 text-primary outline-none bg-background border border-primary/10 placeholder:text-muted focus:border-primary/30 transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="%"
                    min="0"
                    max="100"
                    value={s.percentage}
                    onChange={(e) => {
                      const updated = [...formData.shareholders];
                      updated[i].percentage = Number(e.target.value);
                      setFormData({ ...formData, shareholders: updated });
                    }}
                    className="w-20 rounded-xl px-4 py-3 text-primary outline-none bg-background border border-primary/10 placeholder:text-muted focus:border-primary/30 transition-all duration-200"
                  />
                  <button
                    onClick={() => {
                      const updated = formData.shareholders.filter((_, idx) => idx !== i);
                      setFormData({ ...formData, shareholders: updated });
                    }}
                    className="text-muted hover:text-primary transition-colors">
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, shareholders: [...formData.shareholders, { name: "", percentage: 0 }] })}
                className="text-sm text-muted hover:text-primary transition-colors">
                + Add shareholder
              </button>
            </div>
          ) : (
            <input
              type={step.type}
              placeholder={step.placeholder}
              value={formData[step.field as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-primary outline-none bg-background border border-primary/10 placeholder:text-muted focus:border-primary/30 transition-all duration-200"
            />
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 border border-primary/20 text-primary">
                ← Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={step.type !== "shareholders" && !formData[step.field as keyof typeof formData]}
              className="flex-1 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 bg-primary text-background">
              {currentStep === steps.length - 1 ? "Complete →" : "Continue →"}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}