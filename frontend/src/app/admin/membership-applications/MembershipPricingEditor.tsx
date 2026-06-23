"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Toast } from "@/components/ui/toast";
import {
  membershipTierIds,
  type MembershipPricingConfig,
  type MembershipTierId,
  type MembershipTierRecord,
} from "@/lib/membership/pricing-types";

type PeriodForm = {
  id: string;
  label: string;
  start_month: number;
  start_day: number;
  end_month: number;
  end_day: number;
  active: boolean;
  display_order: number;
  rates: Record<MembershipTierId, string>;
  isNew?: boolean;
};

type PricingFormState = {
  tiers: MembershipTierRecord[];
  periods: PeriodForm[];
};

function formatRateInput(amount: number | undefined): string {
  if (amount == null) return "";
  return String(amount);
}

function parseRateInput(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function createEmptyPeriod(displayOrder: number): PeriodForm {
  const rates = Object.fromEntries(
    membershipTierIds.map((tierId) => [tierId, ""])
  ) as Record<MembershipTierId, string>;

  return {
    id: `new-${crypto.randomUUID()}`,
    label: "",
    start_month: 7,
    start_day: 1,
    end_month: 12,
    end_day: 31,
    active: true,
    display_order: displayOrder,
    rates,
    isNew: true,
  };
}

function normalizeConfig(config: MembershipPricingConfig): PricingFormState {
  return {
    tiers: [...config.tiers].sort((a, b) => a.display_order - b.display_order),
    periods: [...config.periods]
      .sort((a, b) => a.display_order - b.display_order)
      .map((period) => ({
        id: period.id,
        label: period.label,
        start_month: period.start_month,
        start_day: period.start_day,
        end_month: period.end_month,
        end_day: period.end_day,
        active: period.active,
        display_order: period.display_order,
        rates: Object.fromEntries(
          membershipTierIds.map((tierId) => [
            tierId,
            formatRateInput(period.rates[tierId]),
          ])
        ) as Record<MembershipTierId, string>,
      })),
  };
}

export default function MembershipPricingEditor({
  initialConfig,
}: {
  initialConfig: MembershipPricingConfig;
}) {
  const [form, setForm] = useState(() => normalizeConfig(initialConfig));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<string | null>(null);

  const tierById = useMemo(
    () => new Map(form.tiers.map((tier) => [tier.id, tier])),
    [form.tiers]
  );

  function updateTier(
    tierId: MembershipTierId,
    patch: Partial<MembershipTierRecord>
  ) {
    setForm((current) => ({
      ...current,
      tiers: current.tiers.map((tier) =>
        tier.id === tierId ? { ...tier, ...patch } : tier
      ),
    }));
  }

  function updatePeriod(periodId: string, patch: Partial<PeriodForm>) {
    setForm((current) => ({
      ...current,
      periods: current.periods.map((period) =>
        period.id === periodId ? { ...period, ...patch } : period
      ),
    }));
  }

  function updatePeriodRate(
    periodId: string,
    tierId: MembershipTierId,
    amount: string
  ) {
    setForm((current) => ({
      ...current,
      periods: current.periods.map((period) =>
        period.id === periodId
          ? {
              ...period,
              rates: {
                ...period.rates,
                [tierId]: amount,
              },
            }
          : period
      ),
    }));
  }

  function addPeriod() {
    setForm((current) => ({
      ...current,
      periods: [
        ...current.periods,
        createEmptyPeriod(current.periods.length),
      ],
    }));
  }

  function removePeriod(periodId: string) {
    setForm((current) => ({
      ...current,
      periods: current.periods.filter((period) => period.id !== periodId),
    }));
    setPeriodToDelete(null);
  }

  async function savePricing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("Saving pricing...");

    const payload = {
      tiers: form.tiers.map((tier, index) => ({
        ...tier,
        display_order: index,
        highlights: tier.highlights.filter((item) => item.trim().length > 0),
      })),
      periods: form.periods.map((period, index) => ({
        ...(period.isNew ? {} : { id: period.id }),
        label: period.label.trim(),
        start_month: period.start_month,
        start_day: period.start_day,
        end_month: period.end_month,
        end_day: period.end_day,
        active: period.active,
        display_order: index,
        rates: Object.fromEntries(
          membershipTierIds.map((tierId) => [
            tierId,
            parseRateInput(period.rates[tierId]),
          ])
        ) as Record<MembershipTierId, number>,
      })),
    };

    const response = await fetch("/api/admin/membership-pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Pricing save failed");
      return;
    }

    setForm(normalizeConfig(result.data));
    setStatus(null);
    setToastMessage("Pricing saved");
  }

  return (
    <>
      <Toast
        message={toastMessage ?? ""}
        open={toastMessage !== null}
        onClose={() => setToastMessage(null)}
      />

      <form onSubmit={savePricing} className="space-y-6">
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-dark-teal">
              Annual membership prices
            </h2>
            <p className="mt-1 text-sm text-muted-teal">
              These prices appear on the public membership page and application
              form. Membership year runs 1 January to 31 December.
            </p>
          </div>

          <div className="space-y-5">
            {membershipTierIds.map((tierId) => {
              const tier = tierById.get(tierId);
              if (!tier) return null;

              return (
                <div
                  key={tierId}
                  className="rounded-md border border-muted-teal/30 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-teal">
                        {tierId.replace(/_/g, " ")}
                      </p>
                      <input
                        type="text"
                        value={tier.title}
                        onChange={(event) =>
                          updateTier(tierId, { title: event.target.value })
                        }
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal sm:max-w-md"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-dark-teal">
                      <span>Annual (K)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.annual_amount}
                        onChange={(event) =>
                          updateTier(tierId, {
                            annual_amount: Number(event.target.value),
                          })
                        }
                        className="w-28 rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                  </div>

                  <textarea
                    value={tier.description}
                    onChange={(event) =>
                      updateTier(tierId, { description: event.target.value })
                    }
                    rows={2}
                    className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-sm text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  />

                  <textarea
                    value={tier.highlights.join("\n")}
                    onChange={(event) =>
                      updateTier(tierId, {
                        highlights: event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={2}
                    placeholder="Highlights (one per line)"
                    className="mt-3 w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-sm text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dark-teal">
                Pro rata periods
              </h2>
              <p className="mt-1 text-sm text-muted-teal">
                Set fixed reduced prices for date windows within each calendar
                year. When today falls in an active window, that amount replaces
                the annual price on the public form.
              </p>
            </div>
            <button
              type="button"
              onClick={addPeriod}
              className="rounded-md border border-dark-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
            >
              Add period
            </button>
          </div>

          {form.periods.length === 0 ? (
            <p className="rounded-md border border-dashed border-muted-teal/40 px-4 py-6 text-sm text-muted-teal">
              No pro rata periods configured. Annual prices apply all year.
            </p>
          ) : (
            <div className="space-y-4">
              {form.periods.map((period) => (
                <div
                  key={period.id}
                  className="rounded-md border border-muted-teal/30 p-4"
                >
                  <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="block text-sm text-dark-teal lg:col-span-2">
                      Label
                      <input
                        type="text"
                        value={period.label}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            label: event.target.value,
                          })
                        }
                        placeholder="Jul–Dec pro rata"
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-dark-teal">
                      <input
                        type="checkbox"
                        checked={period.active}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            active: event.target.checked,
                          })
                        }
                        className="rounded border-muted-teal text-dark-teal focus:ring-dark-teal"
                      />
                      Active
                    </label>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setPeriodToDelete(period.id)}
                        className="rounded-md border border-deep-red px-3 py-2 text-sm font-semibold text-deep-red hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <label className="block text-sm text-dark-teal">
                      Start month
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={period.start_month}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            start_month: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                    <label className="block text-sm text-dark-teal">
                      Start day
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={period.start_day}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            start_day: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                    <label className="block text-sm text-dark-teal">
                      End month
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={period.end_month}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            end_month: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                    <label className="block text-sm text-dark-teal">
                      End day
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={period.end_day}
                        onChange={(event) =>
                          updatePeriod(period.id, {
                            end_day: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </label>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-muted-teal/30 text-left text-dark-teal">
                          <th className="py-2 pr-4 font-semibold">Tier</th>
                          <th className="py-2 font-semibold">Amount (K)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membershipTierIds.map((tierId) => (
                          <tr
                            key={tierId}
                            className="border-b border-muted-teal/20"
                          >
                            <td className="py-2 pr-4 text-dark-teal">
                              {tierById.get(tierId)?.title ??
                                tierId.replace(/_/g, " ")}
                            </td>
                            <td className="py-2">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={period.rates[tierId]}
                                onChange={(event) =>
                                  updatePeriodRate(
                                    period.id,
                                    tierId,
                                    event.target.value
                                  )
                                }
                                placeholder="0"
                                className="w-28 rounded-md border border-muted-teal bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-teal"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && <p className="text-sm text-deep-red">{error}</p>}
        {status && <p className="text-sm text-muted-teal">{status}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
          >
            Save pricing
          </button>
        </div>
      </form>

      {periodToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-dark-teal">
              Delete pro rata period?
            </h3>
            <p className="mt-2 text-sm text-muted-teal">
              This will remove the period and its tier amounts.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPeriodToDelete(null)}
                className="rounded-md border border-dark-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removePeriod(periodToDelete)}
                className="rounded-md bg-deep-red px-4 py-2 text-sm font-semibold text-light-cream hover:bg-deep-red/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
