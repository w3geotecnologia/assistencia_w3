import { useState } from "react";
import { format } from "date-fns";
import { Printer, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type OrdemServico } from "@/integrations/supabase/client";
import { FotoLightbox } from "@/components/FotoLightbox";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  os: OrdemServico | null;
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  try {
    return format(new Date(d), "dd/MM/yyyy");
  } catch {
    return d;
  }
}

function fmtBRL(v: number | null) {
  return Number(v ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function OrdemServicoDetalheModal({ open, onOpenChange, os }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!os) return null;

  function handlePrint() {
    if (!os) return;
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return;
    const fotos = (os.fotos ?? []).map(
      (u) =>
        `<img src="${u}" style="width:300px;height:274px;object-fit:cover;border:1px solid #ddd;border-radius:6px;margin:4px;" />`,
    ).join("");

    w.document.write(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"/>
<title>OS #${os.numero_os} — ${os.cliente}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color:#111; padding:32px; max-width:820px; margin:0 auto; }
  h1 { font-size:26px; letter-spacing:1px; margin:0 0 2px; }
  h2 { font-size:14px; margin:24px 0 8px; padding-bottom:4px; border-bottom:1px solid #ddd; color:#444; text-transform:uppercase; letter-spacing:.5px; }
  .header { text-align:center; border-bottom:2px solid #111; padding-bottom:12px; margin-bottom:16px; }
  .meta { font-size:12px; color:#666; }
  .os-numero { font-size:13px; font-weight:600; margin:0 0 2px; }
  .cliente { font-size:18px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin:0 0 14px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  td { padding:6px 8px; vertical-align:top; }
  td.label { width:160px; color:#555; font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:.5px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:0 16px; }
  .box { border:1px solid #ddd; padding:10px 12px; border-radius:6px; font-size:13px; min-height:48px; white-space:pre-wrap; }
  .fotos { display:flex; flex-wrap:wrap; gap:8px; }
  .badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; background:#eef; color:#225; }
  .total { font-size:20px; margin:0; }
  .footer { margin-top:48px; display:flex; justify-content:space-between; gap:32px; }
  .sign { flex:1; border-top:1px solid #111; padding-top:6px; text-align:center; font-size:12px; color:#444; }
  @media print { body { padding:0; } button { display:none; } }
</style>
</head><body>
  <div class="header">
    <h1>SmarTech</h1>
    <div class="meta">Assistência Técnica — Emitido em ${format(new Date(), "dd/MM/yyyy HH:mm")}</div>
  </div>

  <p class="os-numero">Nº O.S.: ${String(os.numero_os).padStart(4, "0")}</p>
  <p class="cliente">${escapeHtml(os.cliente)}</p>

  <table class="grid">
    <tr><td class="label">EQUIPAMENTO</td><td>${escapeHtml(os.equipamento)}</td>
        <td class="label">Nº DE SÉRIE</td><td>${escapeHtml(os.numero_serie ?? "—")}</td></tr>
    <tr><td class="label">DATA DE ENTRADA</td><td>${fmtDate(os.data_entrada)}</td>
        <td class="label">STATUS</td><td>${escapeHtml(os.status ?? "—")}</td></tr>
  </table>

  <h2>Defeito informado</h2>
  <div class="box">${escapeHtml(os.defeito_informado ?? "—")}</div>

  <h2>Defeito constatado</h2>
  <div class="box">${escapeHtml(os.defeito_constatado ?? "—")}</div>

  <h2>Observações</h2>
  <div class="box">${escapeHtml(os.observacoes ?? "—")}</div>

  ${fotos ? `<h2>Fotos do equipamento</h2><div class="fotos">${fotos}</div>` : ""}

  <h2>Valor total dos serviços</h2>
  <p class="total"><strong>${fmtBRL(os.valor)}</strong></p>

  <div class="footer">
    <div class="sign">Assinatura do cliente</div>
    <div class="sign">Assinatura do técnico</div>
  </div>

  <script>
    window.onload = () => { setTimeout(() => window.print(), 350); };
  </script>
</body></html>`);
    w.document.close();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/95 backdrop-blur px-6 py-4">
            <div>
              <h2 className="text-xl font-bold">SmarTech</h2>
              <p className="text-sm text-muted-foreground">Ordem de Serviço</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" /> Imprimir / PDF
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            <section className="border-b border-border pb-6">
              <p className="text-sm font-semibold">Nº O.S.: {String(os.numero_os).padStart(4, "0")}</p>
              <h3 className="text-lg font-bold uppercase tracking-wide mt-0.5">{os.cliente}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Equipamento" value={os.equipamento} />
                <Field label="Nº de série" value={os.numero_serie ?? "—"} />
                <Field label="Data de entrada" value={fmtDate(os.data_entrada)} />
                <Field label="Status" value={os.status ?? "—"} />
              </div>
            </section>

            <Block label="Defeito informado">{os.defeito_informado ?? "—"}</Block>
            <Block label="Defeito constatado">{os.defeito_constatado ?? "—"}</Block>
            <Block label="Observações">{os.observacoes ?? "—"}</Block>

            {os.fotos && os.fotos.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Fotos do equipamento
                </h3>
                <div className="flex flex-wrap gap-3">
                  {os.fotos.map((url, idx) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setLightbox(idx)}
                      className="rounded-md overflow-hidden border border-border hover:ring-2 hover:ring-primary transition"
                      style={{ width: 150, height: 137 }}
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Valor total dos serviços:
              </span>
              <span className="text-lg font-bold">{fmtBRL(os.valor)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {lightbox !== null && os.fotos && (
        <FotoLightbox
          fotos={os.fotos}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </h3>
      <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap min-h-[40px]">
        {children}
      </div>
    </section>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
