import "server-only";

import { z } from "zod";
import {
  getSupabaseAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase/server";
import {
  DEFAULT_MEMBERSHIP_PRICING,
  membershipTierIds,
  type MembershipPricingConfig,
  type MembershipProrataPeriodRecord,
  type MembershipTierId,
  type MembershipTierRecord,
} from "./pricing-types";

function isMissingRelationError(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

function parseHighlights(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function parseAmount(value: unknown): number {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
  return amount;
}

function mapTierRow(row: Record<string, unknown>): MembershipTierRecord {
  return {
    id: row.id as MembershipTierId,
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    highlights: parseHighlights(row.highlights),
    annual_amount: parseAmount(row.annual_amount),
    display_order: Number(row.display_order ?? 0),
    active: Boolean(row.active ?? true),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function mapPeriodRow(
  row: Record<string, unknown>,
  rates: Partial<Record<MembershipTierId, number>>
): MembershipProrataPeriodRecord {
  return {
    id: String(row.id),
    label: String(row.label ?? ""),
    start_month: Number(row.start_month),
    start_day: Number(row.start_day),
    end_month: Number(row.end_month),
    end_day: Number(row.end_day),
    active: Boolean(row.active ?? true),
    display_order: Number(row.display_order ?? 0),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
    rates,
  };
}

export async function getMembershipPricing(): Promise<MembershipPricingConfig> {
  if (!hasSupabaseAdminConfig()) {
    return DEFAULT_MEMBERSHIP_PRICING;
  }

  const supabase = getSupabaseAdminClient();

  const [tiersResult, periodsResult, ratesResult] = await Promise.all([
    supabase
      .from("membership_tiers")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("membership_prorata_periods")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("membership_prorata_rates").select("*"),
  ]);

  if (
    isMissingRelationError(tiersResult.error ?? {}) ||
    isMissingRelationError(periodsResult.error ?? {}) ||
    isMissingRelationError(ratesResult.error ?? {})
  ) {
    return DEFAULT_MEMBERSHIP_PRICING;
  }

  if (tiersResult.error || periodsResult.error || ratesResult.error) {
    console.error("Failed to read membership pricing from Supabase", {
      tiers: tiersResult.error?.message,
      periods: periodsResult.error?.message,
      rates: ratesResult.error?.message,
    });
    return DEFAULT_MEMBERSHIP_PRICING;
  }

  const tiers = (tiersResult.data ?? []).map((row) =>
    mapTierRow(row as Record<string, unknown>)
  );

  if (tiers.length === 0) {
    return DEFAULT_MEMBERSHIP_PRICING;
  }

  const ratesByPeriod = new Map<
    string,
    Partial<Record<MembershipTierId, number>>
  >();
  for (const row of ratesResult.data ?? []) {
    const periodId = String((row as Record<string, unknown>).period_id);
    const tierId = (row as Record<string, unknown>).tier_id as MembershipTierId;
    const amount = parseAmount((row as Record<string, unknown>).amount);
    const existing = ratesByPeriod.get(periodId) ?? {};
    existing[tierId] = amount;
    ratesByPeriod.set(periodId, existing);
  }

  const periods = (periodsResult.data ?? []).map((row) =>
    mapPeriodRow(
      row as Record<string, unknown>,
      ratesByPeriod.get(String((row as Record<string, unknown>).id)) ?? {}
    )
  );

  return { tiers, periods };
}

const tierInputSchema = z.object({
  id: z.enum(membershipTierIds),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  highlights: z.array(z.string().trim()).default([]),
  annual_amount: z.coerce.number().min(0, "Annual amount must be zero or greater"),
  display_order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});

const periodInputSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1, "Period label is required"),
  start_month: z.coerce.number().int().min(1).max(12),
  start_day: z.coerce.number().int().min(1).max(31),
  end_month: z.coerce.number().int().min(1).max(12),
  end_day: z.coerce.number().int().min(1).max(31),
  active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
  rates: z
    .record(z.enum(membershipTierIds), z.coerce.number().min(0))
    .default({}),
});

export const membershipPricingUpdateSchema = z.object({
  tiers: z.array(tierInputSchema).length(4),
  periods: z.array(periodInputSchema).default([]),
});

export type MembershipPricingUpdate = z.infer<
  typeof membershipPricingUpdateSchema
>;

export async function saveMembershipPricing(
  payload: MembershipPricingUpdate
): Promise<MembershipPricingConfig> {
  const supabase = getSupabaseAdminClient();
  const validated = membershipPricingUpdateSchema.parse(payload);

  for (const tier of validated.tiers) {
    const { error } = await supabase.from("membership_tiers").upsert(
      {
        id: tier.id,
        title: tier.title,
        description: tier.description,
        highlights: tier.highlights,
        annual_amount: tier.annual_amount,
        display_order: tier.display_order,
        active: tier.active,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: existingPeriods, error: existingPeriodsError } = await supabase
    .from("membership_prorata_periods")
    .select("id");

  if (existingPeriodsError) {
    throw new Error(existingPeriodsError.message);
  }

  const incomingIds = validated.periods
    .map((period) => period.id)
    .filter((id): id is string => Boolean(id));

  const idsToDelete = (existingPeriods ?? [])
    .map((row) => String((row as Record<string, unknown>).id))
    .filter((id) => !incomingIds.includes(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("membership_prorata_periods")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  for (const period of validated.periods) {
    const periodPayload = {
      label: period.label,
      start_month: period.start_month,
      start_day: period.start_day,
      end_month: period.end_month,
      end_day: period.end_day,
      active: period.active,
      display_order: period.display_order,
      updated_at: new Date().toISOString(),
    };

    let periodId = period.id;

    if (periodId) {
      const { error } = await supabase
        .from("membership_prorata_periods")
        .update(periodPayload)
        .eq("id", periodId);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("membership_prorata_periods")
        .insert(periodPayload)
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      periodId = String((data as Record<string, unknown>).id);
    }

    const { error: deleteRatesError } = await supabase
      .from("membership_prorata_rates")
      .delete()
      .eq("period_id", periodId);

    if (deleteRatesError) {
      throw new Error(deleteRatesError.message);
    }

    const rateRows = membershipTierIds
      .filter((tierId) => period.rates[tierId] != null)
      .map((tierId) => ({
        period_id: periodId,
        tier_id: tierId,
        amount: period.rates[tierId],
      }));

    if (rateRows.length > 0) {
      const { error: insertRatesError } = await supabase
        .from("membership_prorata_rates")
        .insert(rateRows);

      if (insertRatesError) {
        throw new Error(insertRatesError.message);
      }
    }
  }

  return getMembershipPricing();
}
