import { ChecklistItemConfig } from '@/types'

export const PRE_SESSION_ITEMS: ChecklistItemConfig[] = [
  { key: 'spot_hh_ll',        label: '1H new HH or LL identified',                            group: 'S — SPOT THE IMPULSE',           section: 'pre' },
  { key: 'ext_high_marked',   label: 'External High marked on chart',                          group: 'S — SPOT THE IMPULSE',           section: 'pre' },
  { key: 'ext_low_marked',    label: 'External Low marked on chart',                           group: 'S — SPOT THE IMPULSE',           section: 'pre' },
  { key: 'impulse_confirmed', label: 'Impulse direction confirmed (red arrow)',                group: 'S — SPOT THE IMPULSE',           section: 'pre' },
  { key: 'range_defined',     label: 'Trading range fully defined',                            group: 'S — SPOT THE IMPULSE',           section: 'pre' },
  { key: 'fib_drawn',         label: 'Fibonacci drawn Ext High → Ext Low',                    group: 'C — CALCULATE PREMIUM/DISCOUNT', section: 'pre' },
  { key: 'midpoint_marked',   label: '0.5 midpoint level marked on chart',                    group: 'C — CALCULATE PREMIUM/DISCOUNT', section: 'pre' },
  { key: 'premium_id',        label: 'Premium zone identified (above 0.5)',                    group: 'C — CALCULATE PREMIUM/DISCOUNT', section: 'pre' },
  { key: 'discount_id',       label: 'Discount zone identified (below 0.5)',                   group: 'C — CALCULATE PREMIUM/DISCOUNT', section: 'pre' },
  { key: 'zone_confirmed',    label: 'Correct zone confirmed for today bias',                  group: 'C — CALCULATE PREMIUM/DISCOUNT', section: 'pre' },
  { key: 'extreme_ob_id',     label: 'Extreme OB identified on 1H',                           group: 'A — ASSESS POIs',                section: 'pre' },
  { key: 'decisional_id',     label: 'Decisional zone identified on 1H',                      group: 'A — ASSESS POIs',                section: 'pre' },
  { key: 'pois_refined',      label: 'Both POIs refined to OB/RIFC on M5',                    group: 'A — ASSESS POIs',                section: 'pre' },
  { key: 'extreme_bip',       label: 'M5 Buildup → Inducement → Push at Extreme POI',        group: 'A — ASSESS POIs',                section: 'pre' },
  { key: 'decisional_bip',    label: 'M5 Buildup → Inducement → Push at Decisional POI',     group: 'A — ASSESS POIs',                section: 'pre' },
]

export const LONDON_LIQ_ITEMS: ChecklistItemConfig[] = [
  { key: 'ldn_poi_reached',     label: 'Price reached the marked POI (Extreme or Decisional)', group: 'L — LIQUIDITY GRAB', section: 'london_liq' },
  { key: 'ldn_hopd',            label: 'High/Low of Previous Day (HOPD) swept',                group: 'L — LIQUIDITY GRAB', section: 'london_liq' },
  { key: 'ldn_hopw',            label: 'High/Low of Previous Week (HOPW) swept',               group: 'L — LIQUIDITY GRAB', section: 'london_liq' },
  { key: 'ldn_smc_trap',        label: 'SMC Trap / Trendline Liquidity swept',                 group: 'L — LIQUIDITY GRAB', section: 'london_liq' },
  { key: 'ldn_session_hl',      label: 'Frankfurt / London Session High or Low swept',         group: 'L — LIQUIDITY GRAB', section: 'london_liq' },
  { key: 'ldn_sweep_confirmed', label: 'Sweep confirmed within 30-min window',                 group: 'L — LIQUIDITY GRAB', section: 'london_liq',
    warning: '✗ Asia High alone is NOT a valid liquidity pool — do not enter on Asia High sweep only' },
]

export const LONDON_ENTRY_ITEMS: ChecklistItemConfig[] = [
  { key: 'ldn_m1_dropped', label: 'Dropped to M1 after sweep confirmed',      group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_m1_bos',     label: 'M1 Break of Structure seen',               group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_m1_twoleg',  label: 'M1 Two-Leg Protocol seen',                 group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_m1_bib',     label: 'M1 Buildup → Inducement → BOS seen',      group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_ifc_entry',  label: 'Entry taken on refined IFC',               group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_sl_set',     label: 'SL set: 3–7 pips (no wider)',              group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_tp_set',     label: 'TP set: 1:3 fixed RR',                    group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
  { key: 'ldn_be_ready',   label: 'BE rule ready — move to BE on M1 shift',  group: 'P — POSITION ENTRY (M1)', section: 'london_entry' },
]

export const NY_LIQ_ITEMS: ChecklistItemConfig[] = [
  { key: 'ny_poi_reached',     label: 'Price reached the marked POI (same POIs from morning)', group: 'L — LIQUIDITY GRAB', section: 'ny_liq' },
  { key: 'ny_hopd',            label: 'High/Low of Previous Day (HOPD) swept',                 group: 'L — LIQUIDITY GRAB', section: 'ny_liq' },
  { key: 'ny_hopw',            label: 'High/Low of Previous Week (HOPW) swept',                group: 'L — LIQUIDITY GRAB', section: 'ny_liq' },
  { key: 'ny_smc_trap',        label: 'SMC Trap / Trendline Liquidity swept',                  group: 'L — LIQUIDITY GRAB', section: 'ny_liq' },
  { key: 'ny_london_hl',       label: 'London Session High or Low swept ✓ (now valid)',        group: 'L — LIQUIDITY GRAB', section: 'ny_liq' },
  { key: 'ny_sweep_confirmed', label: 'Sweep confirmed within 30-min window',                  group: 'L — LIQUIDITY GRAB', section: 'ny_liq',
    warning: '✗ Asia High alone is NOT a valid liquidity pool — do not enter on Asia High sweep only' },
]

export const NY_ENTRY_ITEMS: ChecklistItemConfig[] = [
  { key: 'ny_m1_dropped', label: 'Dropped to M1 after sweep confirmed',      group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_m1_bos',     label: 'M1 Break of Structure seen',               group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_m1_twoleg',  label: 'M1 Two-Leg Protocol seen',                 group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_m1_bib',     label: 'M1 Buildup → Inducement → BOS seen',      group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_ifc_entry',  label: 'Entry taken on refined IFC',               group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_sl_set',     label: 'SL set: 3–7 pips (no wider)',              group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_tp_set',     label: 'TP set: 1:3 fixed RR',                    group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
  { key: 'ny_be_ready',   label: 'BE rule ready — move to BE on M1 shift',  group: 'P — POSITION ENTRY (M1)', section: 'ny_entry' },
]

export const SUMMARY_ITEMS: ChecklistItemConfig[] = [
  { key: 'sum_max_1_trade', label: 'Took max 1 trade per session',         group: 'DAY SUMMARY', section: 'summary' },
  { key: 'sum_risk_1pct',   label: 'Risk was 1% per trade',                group: 'DAY SUMMARY', section: 'summary' },
  { key: 'sum_no_revenge',  label: 'Did NOT revenge trade after a loss',   group: 'DAY SUMMARY', section: 'summary' },
  { key: 'sum_no_sl_wide',  label: 'Did NOT widen SL beyond 7 pips',      group: 'DAY SUMMARY', section: 'summary' },
  { key: 'sum_reviewed',    label: 'Reviewed the trade after close',       group: 'DAY SUMMARY', section: 'summary' },
  { key: 'sum_logged',      label: 'Logged result in journal',             group: 'DAY SUMMARY', section: 'summary' },
]

export const ALL_CHECKLIST_ITEMS: ChecklistItemConfig[] = [
  ...PRE_SESSION_ITEMS,
  ...LONDON_LIQ_ITEMS,
  ...LONDON_ENTRY_ITEMS,
  ...NY_LIQ_ITEMS,
  ...NY_ENTRY_ITEMS,
  ...SUMMARY_ITEMS,
]

export function getItemsBySection(section: ChecklistItemConfig['section']): ChecklistItemConfig[] {
  return ALL_CHECKLIST_ITEMS.filter(item => item.section === section)
}

export function getGroupedItems(items: ChecklistItemConfig[]): Record<string, ChecklistItemConfig[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, ChecklistItemConfig[]>)
}
