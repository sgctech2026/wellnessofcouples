import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin · DESIRE" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("desire_admin_email");
    if (saved) setEmail(saved);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.session) {
      setLoading(false);
      toast.error("Mali ang email o password", {
        description: "Pakicheck ang iyong credentials at subukan ulit.",
      });
      return;
    }
    if (remember) localStorage.setItem("desire_admin_email", email.trim());
    else localStorage.removeItem("desire_admin_email");
    toast.success("Welcome back");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--cream)" }}
    >
      <Card
        className="w-full max-w-md shadow-2xl"
        style={{
          background: "#fff",
          border: "1px solid color-mix(in oklab, var(--ink) 10%, transparent)",
          borderRadius: 16,
        }}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-semibold tracking-[0.3em] uppercase"
                style={{ color: "var(--red)", fontFamily: "Montserrat, sans-serif" }}
              >
                DESIRE Admin
              </p>
              <CardTitle
                className="text-2xl"
                style={{ color: "var(--ink)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
              >
                Sign in
              </CardTitle>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-md border transition-colors hover:bg-black/5"
              style={{ color: "var(--ink)", borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)", fontFamily: "Montserrat, sans-serif" }}
            >
              Home
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <div className="space-y-1.5">
              <Label htmlFor="email" style={{ color: "var(--ink)" }}>Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" style={{ color: "var(--ink)" }}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1.5 hover:bg-black/5 transition-colors z-10"
                  style={{ color: "var(--ink)", opacity: 0.7 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: "var(--ink)" }}>
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <span className="text-sm">Remember me</span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{
                background: "var(--red)",
                color: "var(--cream)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                height: 44,
                borderRadius: 10,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
