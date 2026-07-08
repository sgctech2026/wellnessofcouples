import { useState } from "react";
import { ChevronRight } from "lucide-react";
import lightLabsLogo from "@/assets/lightlabs-logo.png.asset.json";

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

type Ingredient = { name: string; claim: string };

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


export function LabTestedBadge({ variant }: { variant: ProductVariant }) {
  const [open, setOpen] = useState(false);
  const [formula, setFormula] = useState<Formula>(
    variant === "her" ? "her" : "him",
  );

  const rows = INGREDIENTS[formula];

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
              src={lightLabsLogo.url}
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
                      src={lightLabsLogo.url}
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

            <DialogTitle className="lab-modal-title">Desire</DialogTitle>
            <DialogDescription className="lab-modal-sub">
              Desire partners with Light Labs, an independent testing lab, to
              verify the purity, potency, and safety of every batch.
            </DialogDescription>

            <Select value={formula} onValueChange={(v) => setFormula(v as Formula)}>
              <SelectTrigger className="lab-modal-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="him">Desire for Men</SelectItem>
                <SelectItem value="her">Desire for Women</SelectItem>
              </SelectContent>
            </Select>

            <div className="lab-modal-table">
              <div className="lab-modal-thead">
                <span>ACTIVE</span>
                <span>STATUS</span>
                <span>LABEL CLAIM</span>
              </div>
              {rows.map((r) => (
                <div key={r.name} className="lab-modal-row">
                  <span className="lab-modal-active">{r.name}</span>
                  <span className="lab-modal-status">WITHIN LABEL SPECS</span>
                  <span className="lab-modal-claim">{r.claim}</span>
                </div>
              ))}
            </div>

            <div className="lab-modal-foot">LAST TESTED MARCH 09, 2026</div>

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
              <svg
                viewBox="0 0 240 36"
                className="lab-modal-signature"
                aria-hidden
              >
                <g transform="translate(-10, -12) scale(1.08, 0.68)">
                  <path
                    d="M4,36 C12,16 28,12 24,34 C22,46 16,44 30,36 C44,28 64,20 82,18 C100,16 108,24 102,36 C96,48 78,50 68,44 C60,40 64,32 76,30 C88,28 104,34 116,40 C128,46 142,48 154,42 C166,36 174,24 176,14 M168,16 C164,28 166,42 178,46 C190,50 204,44 214,34 C224,24 226,12 222,6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </svg>
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
