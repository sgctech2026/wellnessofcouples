import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · DESIRE Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminDashboard,
});

type Order = {
  id: string; name: string; email: string; phone: string | null;
  street_address: string | null; province_code: string | null; province_name: string | null;
  city_code: string | null; city_name: string | null; barangay_code: string | null;
  barangay_name: string | null; country: string | null;
  variant: string; quantity: number | null; total_amount: number | null; status: string | null; created_at: string;
};
type Subscriber = { id: string; email: string; source: string | null; created_at: string };
type Contact = { id: string; name: string; email: string; message: string; created_at: string };

const STATUSES = ["pending", "confirmed", "shipped", "delivered"] as const;

function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) {
    toast("Nothing to export");
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v == null) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function fmtDate(s: string) { return new Date(s).toLocaleString(); }

function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const loadAll = useCallback(async () => {
    const [o, s, c] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    ]);
    if (o.data) setOrders(o.data as Order[]);
    if (s.data) setSubs(s.data as Subscriber[]);
    if (c.data) setContacts(c.data as Contact[]);
  }, []);

  useEffect(() => { if (authChecked) loadAll(); }, [authChecked, loadAll]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("Update failed", { description: error.message }); return; }
    setOrders((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    toast(`Status → ${status}`);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (!authChecked) {
    return <div className="flex min-h-screen items-center justify-center bg-cream text-ink">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="flex items-center justify-between border-b border-line bg-white/70 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-red">DESIRE Admin</p>
          <h1 className="font-serif text-xl text-ink">Dashboard</h1>
        </div>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </header>

      <main className="mx-auto max-w-[1300px] px-6 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers ({subs.length})</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
          </TabsList>

          {/* ORDERS */}
          <TabsContent value="orders" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={() => downloadCSV(orders, `orders-${Date.now()}.csv`)}>Export CSV</Button>
            </div>
            <div className="rounded-lg border border-line bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-mute py-8">No orders yet.</TableCell></TableRow>
                  ) : orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-xs text-mute whitespace-nowrap">{fmtDate(o.created_at)}</TableCell>
                      <TableCell>{o.name}</TableCell>
                      <TableCell className="text-xs">{o.email}</TableCell>
                      <TableCell className="text-xs">{o.phone || ","}</TableCell>
                      <TableCell>{o.variant}</TableCell>
                      <TableCell>{o.quantity ?? 1}</TableCell>
                      <TableCell>{o.total_amount ? `₱${Number(o.total_amount).toLocaleString()}` : ","}</TableCell>
                      <TableCell>
                        <Select value={o.status ?? "pending"} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* SUBSCRIBERS */}
          <TabsContent value="subscribers" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={() => downloadCSV(subs, `subscribers-${Date.now()}.csv`)}>Export CSV</Button>
            </div>
            <div className="rounded-lg border border-line bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Date</TableHead><TableHead>Email</TableHead><TableHead>Source</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {subs.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-mute py-8">No subscribers yet.</TableCell></TableRow>
                  ) : subs.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-xs text-mute whitespace-nowrap">{fmtDate(s.created_at)}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell className="text-xs">{s.source || ","}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* CONTACTS */}
          <TabsContent value="contacts" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={() => downloadCSV(contacts, `contacts-${Date.now()}.csv`)}>Export CSV</Button>
            </div>
            <div className="rounded-lg border border-line bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Message</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-mute py-8">No messages yet.</TableCell></TableRow>
                  ) : contacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs text-mute whitespace-nowrap">{fmtDate(c.created_at)}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="text-xs">{c.email}</TableCell>
                      <TableCell className="text-xs max-w-[400px]">{c.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
