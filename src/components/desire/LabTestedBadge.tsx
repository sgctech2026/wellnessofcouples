import { useState } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import lightLabsLogo from "@/assets/lightlabs-logo.png";
import labSignature from "@/assets/lab-signature.png";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductVariant = "him" | "her" | "couple";
type Formula = "him" | "her";
type Tab = "actives" | "heavy-metals" | "microbials";

type Ingredient = { name: string; claim: string };
type MetalRow = { name: string; value: string };
type MicrobialRow = { name: string; value: string };

// ─── ACTIVES: variant-specific (Men vs Women differ) ────────────────
const INGREDIENTS: Record<Formula, Ingredient[]> = {
  him: [
    { name: "Tongkat Ali Extract", claim: "250 mg/serving" },
    { name: "Maca Root Extract", claim: "300 mg/serving" },
    { name: "Panax Ginseng Extract", claim: "200 mg/serving" },
    { name: "L-Arginine", claim: "400 mg/serving" },
    { name: "Lactobacillus rhamnosus", claim: "1 Billion CFU" },
    { name: "Zinc", claim: "5 mg/serving" },
  ],
  her: [
    { name: "Ashwagandha", claim: "300 mg/serving" },
    { name: "Red Maca Root", claim: "300 mg/serving" },
    { name: "Dong Quai", claim: "200 mg/serving" },
    { name: "Chaste Berry", claim: "150 mg/serving" },
    { name: "Lactobacillus rhamnosus", claim: "1 Billion CFU" },
    { name: "Zinc", claim: "5 mg/serving" },
  ],
};

// ─── HEAVY METALS: shared across both variants ──────────────────────
const HEAVY_METALS: MetalRow[] = [
  { name: "Arsenic", value: "< 0.5 micrograms" },
  { name: "Cadmium", value: "< 0.5 micrograms" },
  { name: "Lead", value: "< 0.5 micrograms" },
  { name: "Mercury", value: "< 0.5 micrograms" },
];

// ─── MICROBIALS: shared across both variants ────────────────────────
const MICROBIALS: MicrobialRow[] = [
  { name: "Total Plate Count", value: "Not detected" },
  { name: "E. Coli", value: "Not detected" },
  { name: "Salmonella", value: "Not detected" },
  { name: "Staphylococcus Aureus", value: "Not detected" },
  { name: "Total Mold", value: "Not detected" },
];

const TABS: { id: Tab; label: string }[] = [
  { id: "actives", label: "Actives" },
  { id: "heavy-metals", label: "Heavy Metals" },
  { id: "microbials", label: "Microbials" },
];

const LAST_TESTED: Record<Tab, string> = {
  actives: "MARCH 09, 2026",
  "heavy-metals": "NOVEMBER 19, 2025",
  microbials: "FEBRUARY 06, 2026",
};

export function LabTestedBadge({ variant }: { variant: ProductVariant }) {
  const [open, setOpen] = useState(false);
  const [formula, setFormula] = useState<Formula>(
    variant === "her" ? "her" : "him",
  );
  const [tab, setTab] = useState<Tab>("actives");

  const activeRows = INGREDIENTS[formula];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lab-badge"
        aria-label="View third-party verified ingredients"
      >
        <span className="lab-badge-main" aria-hidden>
          <span className="lab-badge-check">
            <img
              src={lightLabsLogo}
              alt=""
              width={18}
              height={18}
              className="lab-badge-logo"
              aria-hidden
            />
          </span>
          <span className="lab-badge-text">
            <span className="lab-badge-line1">
              Tested by Light Labs in{" "}
              <span className="lab-badge-pill">MARCH 2026</span>
            </span>
            <span className="lab-badge-line2">
              6 active ingredients verified for purity
            </span>
          </span>
        </span>
        <span className="lab-badge-arrow" aria-hidden>
          <ChevronRight size={18} strokeWidth={2.5} />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="lab-modal">
          <div className="lab-modal-inner">
            {/* Header */}
            <div className="lab-modal-header">
              <a
                href="https://www.lightlabs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="lab-modal-brand-link"
                aria-label="Visit Light Labs website"
              >
                <div className="lab-modal-brand">
                  <span className="lab-badge-check" aria-hidden>
                    <img
                      src={lightLabsLogo}
                      alt=""
                      width={16}
                      height={16}
                      className="lab-badge-logo"
                      aria-hidden
                    />
                  </span>
                  <span>LIGHT LABS</span>
                </div>
              </a>
            </div>

            {/* Title */}
            <DialogTitle className="lab-modal-title">Desire</DialogTitle>
            <DialogDescription className="lab-modal-sub">
              Desire partners with Light Labs, an independent testing lab, to
              verify the purity, potency, and safety of every batch.
            </DialogDescription>

            {/* Variant dropdown */}
            <Select value={formula} onValueChange={(v) => setFormula(v as Formula)}>
              <SelectTrigger className="lab-modal-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="him">Desire for Men</SelectItem>
                <SelectItem value="her">Desire for Women</SelectItem>
              </SelectContent>
            </Select>

            {/* Tab pills */}
            <div className="lab-tabs" role="tablist" aria-label="Test categories">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`lab-tab${tab === t.id ? " is-active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="lab-panel">
              {tab === "actives" && (
                <>
                  <div className="lab-modal-table">
                    <div className="lab-modal-thead">
                      <span>ACTIVE</span>
                      <span>STATUS</span>
                      <span>LABEL CLAIM</span>
                    </div>
                    {activeRows.map((r) => (
                      <div key={r.name} className="lab-modal-row">
                        <span className="lab-modal-active">{r.name}</span>
                        <span className="lab-modal-status">WITHIN LABEL SPECS</span>
                        <span className="lab-modal-claim">{r.claim}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lab-modal-foot">
                    LAST TESTED {LAST_TESTED.actives}
                  </div>
                </>
              )}

              {tab === "heavy-metals" && (
                <>
                  <p className="lab-panel-intro">
                    Elements like lead and mercury occur in nature. We monitor
                    levels closely to help promote product quality and
                    transparency.
                  </p>
                  <div className="lab-check-list">
                    {HEAVY_METALS.map((r) => (
                      <div key={r.name} className="lab-check-row">
                        <span className="lab-check-name">
                          <CheckCircle2 size={18} className="lab-check-icon" />
                          {r.name}
                        </span>
                        <span className="lab-check-value">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="lab-panel-note">
                    Tested against Desire's safety &amp; quality standards
                  </p>
                  <div className="lab-modal-foot">
                    LAST TESTED {LAST_TESTED["heavy-metals"]}
                  </div>
                </>
              )}

              {tab === "microbials" && (
                <>
                  <p className="lab-panel-intro">
                    Microorganisms like bacteria, mold, or yeast that spoil
                    products, reduce freshness, and cause infection or food
                    poisoning.
                  </p>
                  <div className="lab-check-list">
                    {MICROBIALS.map((r) => (
                      <div key={r.name} className="lab-check-row">
                        <span className="lab-check-name">
                          <CheckCircle2 size={18} className="lab-check-icon" />
                          {r.name}
                        </span>
                        <span className="lab-check-value lab-check-value--muted">
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="lab-modal-foot">
                    LAST TESTED {LAST_TESTED.microbials}
                  </div>
                </>
              )}
            </div>

            {/* Approval box */}
            <div className="lab-modal-approval">
              <div className="lab-modal-approval-header">
                <span>Results approved by</span>
                <span className="lab-modal-iso">
                  <strong>ISO</strong>
                  <span>
                    17025
                    <br />
                    Accredited lab
                  </span>
                </span>
              </div>
              <img
                src={labSignature}
                alt=""
                className="lab-modal-signature"
                aria-hidden
              />
              <div className="lab-modal-approval-name">
                LEV SPIVAK-BIRNDORF, LAB DIRECTOR
              </div>
            </div>

            <p className="lab-modal-disclaimer">
              Results reflect laboratory analysis of submitted samples at the time
              of testing as reported by the testing laboratory. Results do not
              guarantee future performance, stability, or shelf life. Product
              labeling and regulatory compliance remain the responsibility of the
              brand.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
