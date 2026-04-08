import { useState } from "react";

type RowDef =
  | { type: "row"; label: string; value: string; valueColor?: string; bold?: boolean; highlight?: boolean }
  | { type: "toggle"; label: string; on: boolean };

type Section = {
  title: string;
  dot: string;
  accent: string;
  headerBg: string;
  headerText: string;
  rows: RowDef[];
};

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CAIXA_INICIAL = 3000;
const RETIRADA = 0;

function ToggleSwitch({ on }: { on: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <div
      onClick={() => setActive(p => !p)}
      className="w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200"
      style={{ background: active ? "#3b82f6" : "#d1d5db" }}
    >
      <div className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all duration-200 ${active ? "right-[3px]" : "left-[3px]"}`} />
    </div>
  );
}

export function RelatorioFinanceiro({
  onBack,
  totalDespesas = 0,
  totalRendimentos = 0,
  totalClientes = 0,
  clientesParaCobranca = 0,
  cobradosCount = 0,
  ausentesCount = 0,
  novosCount = 0,
  renovacoesCount = 0,
  cobrancaDiaria = 0,
  cobrancaEsperada = 0,
  novosEmprestimos = 0,
  onSemPagamentos,
}: {
  onBack: () => void;
  totalDespesas?: number;
  totalRendimentos?: number;
  totalClientes?: number;
  clientesParaCobranca?: number;
  cobradosCount?: number;
  ausentesCount?: number;
  novosCount?: number;
  renovacoesCount?: number;
  cobrancaDiaria?: number;
  cobrancaEsperada?: number;
  novosEmprestimos?: number;
  onSemPagamentos?: () => void;
}) {
  const [modalFechamento, setModalFechamento] = useState(false);
  const [caixaFechado, setCaixaFechado] = useState(false);
  const [modalSemPag, setModalSemPag] = useState(false);
  const [modalRelatorio, setModalRelatorio] = useState(false);

  const saldo = CAIXA_INICIAL + cobrancaDiaria + totalRendimentos - novosEmprestimos - RETIRADA - totalDespesas;
  const todosCorados = clientesParaCobranca > 0 && cobradosCount >= clientesParaCobranca;

  const hoje = new Date();
  const dataStr = hoje.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const imprimirPDF = () => {
    const conteudo = document.getElementById("relatorio-pdf-content");
    if (!conteudo) return;
    const estilo = `
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color:#1e293b; padding:24px; }
        .rt { font-size:18px; font-weight:800; color:#3A5F82; text-align:center; margin-bottom:4px; }
        .rs { font-size:10px; color:#64748b; text-align:center; margin-bottom:20px; }
        .sec-title { font-size:12px; font-weight:700; margin:14px 0 6px; }
        .row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #f1f5f9; }
        .row:last-child { border-bottom:none; }
        .rl { font-size:11px; color:#475569; }
        .rv { font-size:11px; font-weight:600; color:#1e293b; }
        .rv.g { color:#16a34a; }
        .divider { height:1px; background:#e2e8f0; margin:10px 0; }
        .saldo { background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; }
        .sl { font-size:12px; font-weight:700; color:#15803d; }
        .sv { font-size:14px; font-weight:800; color:#15803d; }
        .meta { font-size:9px; color:#94a3b8; text-align:center; margin-top:18px; }
        @page { margin:12mm; }
      </style>
    `;
    const janela = window.open("", "", "width=480,height=700");
    if (!janela) return;
    janela.document.write(`<html><head><meta charset="UTF-8"/>${estilo}</head><body>${conteudo.innerHTML}</body></html>`);
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  const handleFecharCaixa = () => {
    setCaixaFechado(true);
    setModalFechamento(false);
    setTimeout(() => setModalRelatorio(true), 200);
  };

  const sections: Section[] = [
    {
      title: "Clientes",
      dot: "bg-indigo-500", accent: "#6366f1",
      headerBg: "bg-indigo-50", headerText: "text-indigo-700",
      rows: [
        { type: "row", label: "Número de Clientes",  value: String(totalClientes) },
        { type: "row", label: "Clientes Novos",       value: String(novosCount),  valueColor: "text-emerald-600" },
        { type: "row", label: "Clientes Ausentes",    value: String(ausentesCount) },
        { type: "row", label: "Renovação de Cliente", value: String(renovacoesCount) },
        { type: "row", label: "Cobranças Feitas",     value: `${cobradosCount} / ${clientesParaCobranca}  —  Adicionais: 0` },
      ],
    },
    {
      title: "Cobranças",
      dot: "bg-emerald-500", accent: "#10b981",
      headerBg: "bg-emerald-50", headerText: "text-emerald-700",
      rows: [
        { type: "row", label: "Cobrança Esperada",        value: `R$ ${fmt(cobrancaEsperada)} (100%)` },
        { type: "row", label: "Cobrança Diária",          value: `R$ ${fmt(cobrancaDiaria)} (${cobrancaEsperada > 0 ? (cobrancaDiaria / cobrancaEsperada * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : 0}%)`, valueColor: "text-emerald-600" },
        { type: "row", label: "Dinheiro / Transferência", value: `R$ ${fmt(cobrancaDiaria)} / R$ 0,00` },
      ],
    },
    {
      title: "Financeiro",
      dot: "bg-blue-500", accent: "#3b82f6",
      headerBg: "bg-blue-50", headerText: "text-blue-700",
      rows: [
        { type: "row", label: "Caixa Inicial",      value: `R$ ${fmt(CAIXA_INICIAL)}` },
        { type: "row", label: "Total de Empréstimos", value: `R$ ${fmt(novosEmprestimos)}` },
        { type: "row", label: "Retirada de Caixa",  value: `R$ ${fmt(RETIRADA)}` },
        { type: "row", label: "Despesas",            value: `R$ ${fmt(totalDespesas)}`, valueColor: "text-red-500" },
        { type: "row", label: "Rendimento",          value: `R$ ${fmt(totalRendimentos)}`, valueColor: "text-emerald-600" },
        { type: "row", label: "Saldo de Caixa",      value: `R$ ${fmt(saldo)}`, bold: true, highlight: true },
      ],
    },
    {
      title: "Sistema",
      dot: "bg-slate-400", accent: "#94a3b8",
      headerBg: "bg-slate-100", headerText: "text-slate-600",
      rows: [{ type: "toggle", label: "Sincronização Automática", on: true }],
    },
  ];

  return (
    <div className="flex flex-col bg-slate-100" style={{ flex: 1, overflowY: "auto", paddingBottom: 80, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div className="px-3 pt-3 space-y-2">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
            <div className="h-[2px]" style={{ background: section.accent }} />
            <div className={`${section.headerBg} px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-100`}>
              <div className={`w-2 h-2 rounded-full ${section.dot}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${section.headerText}`}>{section.title}</span>
            </div>
            {section.rows.map((row, ri) => {
              if (row.type === "toggle") {
                return (
                  <div key={ri} className="flex items-center justify-between px-3 py-2">
                    <span className="text-[11px] text-slate-600">{row.label}</span>
                    <ToggleSwitch on={row.on} />
                  </div>
                );
              }
              const bg = row.highlight ? "bg-blue-50" : ri % 2 === 0 ? "bg-white" : "bg-slate-50/60";
              return (
                <div key={ri} className={`flex items-center justify-between px-3 py-[5px] border-t border-slate-100 ${bg}`}>
                  <span className="text-[10px] text-slate-500 w-[55%]">{row.label}</span>
                  <span className={`text-[10px] text-right tabular-nums ${row.bold ? "font-bold text-blue-700" : "font-medium"} ${row.valueColor ?? "text-slate-700"}`}>
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={() => onSemPagamentos && setModalSemPag(true)}
            disabled={!onSemPagamentos}
            className="bg-slate-900 text-white rounded-lg py-1.5 text-[10px] font-semibold shadow-sm flex items-center justify-center gap-1.5"
            style={{ opacity: !onSemPagamentos ? 0.5 : 1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Sem Pagamentos
          </button>
          <button className="bg-slate-900 text-white rounded-lg py-1.5 text-[10px] font-semibold shadow-sm flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            Configurações
          </button>
        </div>

        {todosCorados && (
          <div className="grid grid-cols-1 gap-2 pt-0">
            {!caixaFechado ? (
              <button
                onClick={() => setModalFechamento(true)}
                className="bg-slate-900 text-white rounded-lg py-1.5 text-[10px] font-semibold shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                Fechar Caixa
              </button>
            ) : (
              <div className="rounded-lg py-1.5 text-[10px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#16a34a" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <polyline points="4,12 9,17 20,7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Caixa Fechado
              </div>
            )}
          </div>
        )}
      </div>

      {modalSemPag && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", borderRadius: 13, padding: "13px 15px 12px", width: 248, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="2" /><path d="M12 7v5l3 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Sem Pagamentos</span>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 11px", lineHeight: 1.45, paddingLeft: 34 }}>
              Registrar <strong>Sem pagamento</strong> para todos os clientes não cobrados?
            </p>
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => setModalSemPag(false)} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => { onSemPagamentos?.(); setModalSemPag(false); }} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #86efac", background: "#fff", fontSize: 11, fontWeight: 700, color: "#16a34a", cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {modalFechamento && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", borderRadius: 13, padding: "13px 15px 12px", width: 248, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#dc2626" strokeWidth="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Fechar Caixa</span>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 11px", lineHeight: 1.45, paddingLeft: 34 }}>
              Todos os {clientesParaCobranca} clientes cobrados. Confirma o fechamento?
            </p>
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => setModalFechamento(false)} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleFecharCaixa} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff", fontSize: 11, fontWeight: 700, color: "#dc2626", cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {modalRelatorio && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "#fff", borderRadius: "18px 18px 0 0", width: "100%", maxWidth: 430, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 -4px 24px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Relatório Diário</span>
              </div>
              <button onClick={() => setModalRelatorio(false)} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1, padding: "14px 16px" }}>
              <div id="relatorio-pdf-content">
                <div className="rt" style={{ fontSize: 15, fontWeight: 800, color: "#3A5F82", textAlign: "center", marginBottom: 2 }}>📊 Resumo de Caixa</div>
                <div className="rs" style={{ fontSize: 10, color: "#64748b", textAlign: "center", marginBottom: 14 }}>Rota Cred Bank · Sistema de Cobrança</div>

                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                  {[
                    { l: "Status de Liquidação", v: "✓ Correto", g: true },
                    { l: "Sincronização", v: "Rota Cred Bank", g: false },
                    { l: "Data", v: dataStr, g: false },
                  ].map(r => (
                    <div key={r.l} className="row" style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span className="rl" style={{ fontSize: 11, color: "#475569" }}>{r.l}</span>
                      <span className="rv" style={{ fontSize: 11, fontWeight: 600, color: r.g ? "#16a34a" : "#1e293b" }}>{r.v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} className="divider" />

                <div style={{ marginBottom: 12 }}>
                  <div className="sec-title" style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>💰 Movimentação Financeira</div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                    {[
                      { l: "Caixa Inicial", v: `R$ ${fmt(CAIXA_INICIAL)}` },
                      { l: "Novos Clientes", v: String(novosCount) },
                      { l: "Renovação de Clientes", v: "R$ 0,00" },
                      { l: "Total de Empréstimos", v: `R$ ${fmt(novosEmprestimos)}` },
                      { l: "Retiradas de Caixa", v: `R$ ${fmt(RETIRADA)}` },
                      { l: "Despesas", v: `R$ ${fmt(totalDespesas)}` },
                      { l: "Rendimentos", v: `R$ ${fmt(totalRendimentos)}` },
                    ].map(r => (
                      <div key={r.l} className="row" style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <span className="rl" style={{ fontSize: 11, color: "#475569" }}>{r.l}</span>
                        <span className="rv" style={{ fontSize: 11, fontWeight: 600, color: "#1e293b" }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} className="divider" />

                <div style={{ marginBottom: 12 }}>
                  <div className="sec-title" style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>📥 Cobranças</div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                    <div className="row" style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                      <span className="rl" style={{ fontSize: 11, color: "#475569" }}>Total Cobrado</span>
                      <span className="rv g" style={{ fontSize: 11, fontWeight: 600, color: "#16a34a" }}>R$ {fmt(cobrancaDiaria)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} className="divider" />

                <div style={{ marginBottom: 8 }}>
                  <div className="sec-title" style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>📦 Saldo Final</div>
                  <div className="saldo" style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="sl" style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Caixa Final</span>
                    <span className="sv" style={{ fontSize: 15, fontWeight: 800, color: "#15803d" }}>R$ {fmt(saldo)}</span>
                  </div>
                </div>

                <div className="meta" style={{ fontSize: 9, color: "#94a3b8", textAlign: "center", marginTop: 14 }}>
                  Gerado em {hoje.toLocaleString("pt-BR")} · Sistema de Cobrança
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
              <button
                onClick={imprimirPDF}
                style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "none", background: "#3A5F82", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16l-4-4h2.5V4h3v8H16l-4 4z" fill="#fff"/><path d="M4 18h16v2H4v-2z" fill="#fff"/></svg>
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
