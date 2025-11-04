"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBilling } from "@/contexts/BillingContext";
import { useState } from "react";

export function BillingSection() {
  const { status, loadingStatus: loading, openPricing } = useBilling();
  const [opening, setOpening] = useState(false);

  const handleOpenPricing = async () => {
    try {
      setOpening(true);
      await openPricing();
    } finally {
      setOpening(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">AI Credits & Subscription</h2>
        <p className="text-sm text-slate-600">
          Manage credits and Pro subscription to create AI lessons.
        </p>
      </div>
      <Card className="p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm text-slate-600">Status</div>
              <div className="text-lg font-medium">
                {status?.currentPlanName ?? "Standard"}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Remaining credits:{" "}
                {status?.isPro ? "Unlimited" : status?.remainingCredits ?? 0}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                onClick={handleOpenPricing}
                disabled={opening}>
                {opening ? "Opening..." : "Buy more / Upgrade"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
