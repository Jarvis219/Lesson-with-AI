"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequireAuth } from "@/hooks/useAuth";
import { BillingService } from "@/lib/billing-service";
import { PlanService } from "@/lib/plan-service";
import type { BillingStatusDTO, PricingPlanDTO } from "@/types/billing";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BillingContextValue = {
  status: BillingStatusDTO | null;
  loadingStatus: boolean;
  plans: PricingPlanDTO[];
  loadingPlans: boolean;
  purchasing: boolean;
  fetchStatus: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  purchase: (planId: string) => Promise<void>;
  openPricing: () => Promise<void>;
  closePricing: () => void;
  requireCredits: (min?: number) => boolean;
};

const BillingContext = createContext<BillingContextValue | undefined>(
  undefined
);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRequireAuth();
  const [status, setStatus] = useState<BillingStatusDTO | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [plans, setPlans] = useState<PricingPlanDTO[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [pricingOpen, setPricingOpen] = useState<boolean>(false);

  const fetchStatus = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const data = await BillingService.getStatus();
      setStatus(data);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      setLoadingPlans(true);
      const list = await PlanService.getPlans();
      setPlans(list);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const purchase = useCallback(
    async (planId: string) => {
      try {
        setPurchasing(true);
        await PlanService.purchase(planId);
        isAuthenticated && (await fetchStatus());
      } finally {
        setPurchasing(false);
      }
    },
    [fetchStatus, isAuthenticated]
  );

  useEffect(() => {
    isAuthenticated && fetchStatus();
  }, [isAuthenticated, fetchStatus]);

  const openPricing = useCallback(async () => {
    setPricingOpen(true);
    if (plans.length === 0 && !loadingPlans) {
      await fetchPlans();
    }
  }, [plans.length, loadingPlans, fetchPlans]);

  const closePricing = useCallback(() => {
    setPricingOpen(false);
  }, []);

  const requireCredits = useCallback(
    (min: number = 1) => {
      if (!status) return false;
      if (status.isPro) return true;
      if ((status.remainingCredits ?? 0) >= min) return true;
      void openPricing();
      return false;
    },
    [status, openPricing]
  );

  const value = useMemo<BillingContextValue>(
    () => ({
      status,
      loadingStatus,
      plans,
      loadingPlans,
      purchasing,
      fetchStatus,
      fetchPlans,
      purchase,
      openPricing,
      closePricing,
      requireCredits,
    }),
    [
      status,
      loadingStatus,
      plans,
      loadingPlans,
      purchasing,
      fetchStatus,
      fetchPlans,
      purchase,
      openPricing,
      closePricing,
      requireCredits,
    ]
  );

  function formatPrice(cents: number, currency: string) {
    const amount = (cents / 100).toFixed(2);
    return `${amount} ${currency}`;
  }

  function getPlanVisuals(plan: PricingPlanDTO) {
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

  return (
    <BillingContext.Provider value={value}>
      {children}
      <Dialog open={pricingOpen} onOpenChange={setPricingOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upgrade your AI access</DialogTitle>
            <DialogDescription>
              Choose a plan to buy credits or go Pro for unlimited AI lessons.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingPlans
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="p-5 animate-pulse">
                    <div className="h-5 w-1/2 bg-slate-200 rounded mb-3" />
                    <div className="h-7 w-1/3 bg-slate-200 rounded mb-4" />
                    <div className="h-9 w-full bg-slate-200 rounded" />
                  </Card>
                ))
              : plans.map((plan) => {
                  const v = getPlanVisuals(plan);
                  return (
                    <div
                      key={plan._id}
                      className={"relative rounded-xl p-[1px] " + v.wrapper}>
                      <Card
                        className={
                          "relative justify-between h-full p-5 flex flex-col bg-white/90 backdrop-blur rounded-[11px] shadow-sm " +
                          v.ring
                        }>
                        <div>
                          {v.ribbon ? (
                            <div
                              className={`absolute -top-3 right-4 text-[10px] font-medium text-white px-2 py-0.5 rounded-full shadow-sm ${v.ribbon.className}`}>
                              {v.ribbon.text}
                            </div>
                          ) : null}
                          <div className="mb-4 flex items-center gap-3">
                            <div
                              className={
                                "h-8 w-8 rounded-full grid place-items-center " +
                                v.iconBg
                              }>
                              <span className="text-sm">{v.icon}</span>
                            </div>
                            <div>
                              <h3 className="text/base font-semibold">
                                {plan.name}
                              </h3>
                              {plan.description && (
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {plan.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="text-2xl font-bold">
                              {plan.price === 0
                                ? "Free"
                                : formatPrice(plan.price, plan.currency)}
                              {plan.type === "subscription" && plan.interval
                                ? ` / ${plan.interval}`
                                : ""}
                            </div>
                            {plan.type === "credits" && plan.creditsIncluded ? (
                              <div className="text-xs text-slate-600 mt-1">
                                Includes {plan.creditsIncluded} credits
                              </div>
                            ) : null}
                            {plan.isUnlimitedCredits ? (
                              <div className="text-xs text-slate-600 mt-1">
                                Unlimited credits
                              </div>
                            ) : null}
                            {plan.type === "subscription" &&
                            plan.interval === "year" ? (
                              <div className="inline-block mt-2 text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                10% off vs monthly
                              </div>
                            ) : null}
                            {plan.type === "credits" && plan.creditsIncluded ? (
                              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
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
                            <ul className="mb-4 space-y-1 text-xs text-slate-700">
                              {plan.features.map((f, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="mt-0.5 h-3.5 w-3.5 text-blue-600">
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
                        </div>
                        <Button
                          disabled={
                            !!purchasing ||
                            status?.currentPlanName === plan.name
                          }
                          onClick={() => purchase(plan._id)}
                          className={getPlanVisuals(plan).ctaClass}>
                          {status?.currentPlanName === plan.name
                            ? "Current plan"
                            : purchasing
                            ? "Processing..."
                            : plan.price === 0
                            ? "Get started"
                            : plan.type === "subscription"
                            ? plan.interval === "year"
                              ? "Go Pro yearly"
                              : "Go Pro monthly"
                            : "Buy credit pack"}
                        </Button>
                      </Card>
                    </div>
                  );
                })}
          </div>
        </DialogContent>
      </Dialog>
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const ctx = useContext(BillingContext);
  if (!ctx) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return ctx;
}
