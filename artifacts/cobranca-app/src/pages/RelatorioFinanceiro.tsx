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

  const saldo = CAIXA_INICIAL + cobrancaDiaria + totalRendimentos - novosEmprestimos - RETIRADA - totalDespesas;
  const todosCorados = clientesParaCobranca > 0 && cobradosCount >= clientesParaCobranca;

  const handleFecharCaixa = () => {
    setCaixaFechado(true);
    setModalFechamento(false);
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
        { type: "row", label: "Novos Empréstimos",   value: `R$ ${fmt(novosEmprestimos)}` },
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
    </div>
  );
}
