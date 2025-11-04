"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlanService } from "@/lib/plan-service";
import { PricingPlanDTO } from "@/types/billing";
import { useEffect, useState } from "react";

type Plan = PricingPlanDTO;

function formatPrice(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return `${amount} ${currency}`;
}

function getPlanVisuals(plan: Plan) {
  const isFree = plan.price === 0;
  const isCredits = plan.type === "credits" && !isFree;
  const isMonthly = plan.type === "subscription" && plan.interval === "month";
  const isYearly = plan.type === "subscription" && plan.interval === "year";

  if (isYearly) {
    return {
      wrapper:
        "bg-gradient-to-br from-purple-500/40 via-fuchsia-400/30 to-indigo-500/40",
      ring: "ring-1 ring-purple-500/30",
      iconBg: "bg-purple-50 text-purple-600",
      icon: "🌟",
      ribbon: { text: "Best value", className: "bg-purple-600" },
      ctaClass: "bg-purple-600 hover:bg-purple-700",
    } as const;
  }
  if (isMonthly) {
    return {
      wrapper:
        "bg-gradient-to-br from-blue-500/40 via-sky-400/30 to-indigo-500/40",
      ring: "ring-1 ring-blue-500/30",
      iconBg: "bg-blue-50 text-blue-600",
      icon: "🚀",
      ribbon: { text: "Most popular", className: "bg-blue-600" },
      ctaClass: "bg-blue-600 hover:bg-blue-700",
    } as const;
  }
  if (isCredits) {
    return {
      wrapper:
        "bg-gradient-to-br from-emerald-500/30 via-teal-400/20 to-green-500/30",
      ring: "ring-1 ring-emerald-500/30",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: "⚡",
      ribbon: null,
      ctaClass: "bg-emerald-600 hover:bg-emerald-700",
    } as const;
  }
  return {
    wrapper: "bg-gradient-to-br from-slate-200/60 to-slate-100/40",
    ring: "ring-1 ring-slate-300/50",
    iconBg: "bg-slate-100 text-slate-700",
    icon: "✨",
    ribbon: { text: "Starter", className: "bg-slate-600" },
    ctaClass: "bg-slate-800 hover:bg-slate-900",
  } as const;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoadingPlans(true);
        const list = await PlanService.getPlans();
        setPlans(list);
      } catch (e) {
        toast({ title: "Error", description: "Failed to load plans" });
      } finally {
        setLoadingPlans(false);
      }
    })();
  }, [toast]);

  const onPurchase = async (planId: string) => {
    try {
      setLoading(true);
      await PlanService.purchase(planId);
      toast({ title: "Success", description: "Purchase successful" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Purchase failed" });
    } finally {
      setLoading(false);
    }
  };

  const featuredPlanId = plans.find(
    (p) => p.type === "subscription" && p.interval === "year"
  )?._id;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1000px_300px_at_80%_-10%,rgba(59,130,246,0.10),transparent_70%),radial-gradient(800px_300px_at_10%_10%,rgba(99,102,241,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium mb-3">
            <span>AI Credits & Pro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Buy credits as you go or get unlimited with Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingPlans
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} className="p-6 animate-pulse">
                  <div className="h-6 w-1/2 bg-slate-200 rounded mb-4" />
                  <div className="h-8 w-1/3 bg-slate-200 rounded mb-6" />
                  <div className="space-y-2 mb-8">
                    <div className="h-3 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-2/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  </div>
                  <div className="h-10 w-full bg-slate-200 rounded" />
                </Card>
              ))
            : plans.map((plan) => {
                const isFeatured = plan._id === featuredPlanId;
                const visuals = getPlanVisuals(plan);
                return (
                  <div
                    key={plan._id}
                    className={
                      "relative rounded-xl p-[1px] transition hover:-translate-y-0.5 " +
                      visuals.wrapper
                    }>
                    <Card
                      className={
                        "relative h-full p-6 flex flex-col border-slate-200 bg-white/90 backdrop-blur shadow-sm hover:shadow-lg rounded-[11px] " +
                        visuals.ring
                      }>
                      {visuals.ribbon ? (
                        <div
                          className={`absolute -top-3 right-4 text-xs font-medium text-white px-2 py-0.5 rounded-full shadow-sm ${visuals.ribbon.className}`}>
                          {visuals.ribbon.text}
                        </div>
                      ) : null}

                      <div className="mb-5 flex items-center gap-3">
                        <div
                          className={
                            "h-10 w-10 rounded-full grid place-items-center " +
                            visuals.iconBg
                          }>
                          <span className="text-base">{visuals.icon}</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold tracking-tight">
                            {plan.name}
                          </h2>
                          {plan.description && (
                            <p className="text-xs text-slate-600 mt-0.5">
                              {plan.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="text-3xl font-bold">
                          {plan.price === 0
                            ? "Free"
                            : formatPrice(plan.price, plan.currency)}
                          {plan.type === "subscription" && plan.interval
                            ? ` / ${plan.interval}`
                            : ""}
                        </div>
                        {plan.type === "credits" && plan.creditsIncluded ? (
                          <div className="text-sm text-slate-600 mt-1">
                            Includes {plan.creditsIncluded} credits
                          </div>
                        ) : null}
                        {plan.isUnlimitedCredits ? (
                          <div className="text-sm text-slate-600 mt-1">
                            Unlimited credits
                          </div>
                        ) : null}
                        {plan.type === "subscription" &&
                        plan.interval === "year" ? (
                          <div className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                            10% off vs monthly
                          </div>
                        ) : null}
                        {plan.price === 0 ? (
                          <div className="inline-block mt-2 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            Great to start
                          </div>
                        ) : null}
                        {plan.type === "credits" && plan.creditsIncluded ? (
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              Pay-as-you-go
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              No subscription
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {plan.features && plan.features.length > 0 && (
                        <ul className="mb-6 space-y-2 text-sm text-slate-700">
                          {plan.features.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="mt-0.5 h-4 w-4 text-blue-600">
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-7.5 10a.75.75 0 0 1-1.127.075l-4-4a.75.75 0 1 1 1.06-1.06l3.353 3.353 6.973-9.297a.75.75 0 0 1 1.098-.123z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto">
                        <Button
                          disabled={loading}
                          onClick={() => onPurchase(plan._id)}
                          className={"w-full " + visuals.ctaClass}>
                          {plan.price === 0
                            ? "Get started"
                            : plan.type === "subscription"
                            ? plan.interval === "year"
                              ? "Go Pro yearly"
                              : "Go Pro monthly"
                            : "Buy credit pack"}
                        </Button>
                        <p className="mt-2 text-[11px] text-slate-500">
                          No hidden fees. Cancel anytime.
                        </p>
                      </div>
                    </Card>
                  </div>
                );
              })}
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          Prices in {plans[0]?.currency || "USD"}. Taxes may apply.
        </div>
      </div>
    </div>
  );
}
