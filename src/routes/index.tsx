import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  DollarSign,
  Clock,
  AlertTriangle,
  CalendarDays,
  LogOut,
  KeyRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, type OrdemServico } from "@/integrations/supabase/client";
import { useAuthContext } from "@/components/AuthProvider";
import { OrdemServicoDetalheModal } from "@/components/OrdemServicoDetalheModal";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Dashboard() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const [detalheOS, setDetalheOS] = useState<OrdemServico | null>(null);
  const [detalheOpen, setDetalheOpen] = useState(false);

  const anos = Array.from(
    { length: hoje.getFullYear() - 2020 + 2 },
    (_, i) => 2020 + i,
  );

  // Filtra por mês E ano selecionados — usa data_entrada
  const isMesSelecionado = (dataStr: string | null) => {
    if (!dataStr) return false;
    const data = new Date(dataStr + "T00:00:00");
    return (
      data.getMonth() === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  };

  const handleHoje = () => {
    setMostrarTodos(false);
    setMesSelecionado(hoje.getMonth());
    setAnoSelecionado(hoje.getFullYear());
  };

  const handleToggleTodos = () => {
    setMostrarTodos((v) => !v);
  };

  const handleSair = async () => {
    await supabase.auth.signOut();
  };

  const handleAbrirOS = (os: OrdemServico) => {
    setDetalheOS(os);
    setDetalheOpen(true);
  };

  const handleDetalheOpenChange = (open: boolean) => {
    setDetalheOpen(open);
    if (!open) {
      queryClient.invalidateQueries({ queryKey: ["ordens", user?.id] });
    }
  };

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrdemServico[]> => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: clientesCount = 0 } = useQuery({
    queryKey: ["clientes-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  // ✅ FIX 2: "Todos" mostra TODAS as ordens sem filtro de ano
  const ordensDoPeriodo = mostrarTodos
    ? ordens
    : ordens.filter((o) => isMesSelecionado(o.data_entrada));

  // Faturamento: soma OS concluídas dentro do período já filtrado (ordensDoPeriodo).
  // Não depende de data_saida — o critério é a OS pertencer ao período selecionado
  // e ter status concluído. Quando "Todos", usa todas as ordens sem filtro.
  const calcFaturamento = () =>
    ordensDoPeriodo
      .filter((o) => o.status === "Concluída" || o.status === "Concluido")
      .reduce((sum, o) => sum + Number(o.valor ?? 0), 0);

  const stats = {
    total: ordensDoPeriodo.length,
    aguardando: ordensDoPeriodo.filter(
      (o) => o.status === "Aguardando" || o.status === "Diagnóstico",
    ).length,
    andamento: ordensDoPeriodo.filter(
      (o) => o.status === "Em andamento" || o.status === "Em Andamento",
    ).length,
    concluidas: ordensDoPeriodo.filter(
      (o) => o.status === "Concluída" || o.status === "Concluido",
    ).length,
    urgentes: ordensDoPeriodo.filter(
      (o) => o.prioridade === "Alta" || o.prioridade === "Urgente",
    ).length,
    faturamento: calcFaturamento(),
  };

  const cards = [
    { label: mostrarTodos ? "Faturamento total" : `Faturamento ${MESES[mesSelecionado].slice(0, 3)}/${anoSelecionado}`,
      value: stats.faturamento.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
     icon: DollarSign,
      color: "text-success",
    },
    { label: "Total de Ordens", value: stats.total, icon: ClipboardList, color: "text-info" },
    { label: "Aguardando", value: stats.aguardando, icon: Clock, color: "text-warning" },
    { label: "Em andamento", value: stats.andamento, icon: Wrench, color: "text-primary" },
    { label: "Concluídas", value: stats.concluidas, icon: CheckCircle2, color: "text-success" },
    { label: "Urgentes", value: stats.urgentes, icon: AlertTriangle, color: "text-destructive" },
    ];

  return (
    <div className="space-y-6">
      {/* ✅ FIX 1: Topo com email do usuário e botão Sair */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral da sua operação · {clientesCount} cliente(s) cadastrado(s)
          </p>
        </header>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSair}
            className="flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </Button>
        </div>
      </div>

      {/* Filtro de período */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Período:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(mesSelecionado)}
            onValueChange={(v) => {
              setMostrarTodos(false);
              setMesSelecionado(Number(v));
            }}
          >
            <SelectTrigger className="w-[140px]" disabled={mostrarTodos}>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m, i) => (
                <SelectItem key={i} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(anoSelecionado)}
            onValueChange={(v) => {
              setMostrarTodos(false);
              setAnoSelecionado(Number(v));
            }}
          >
            <SelectTrigger className="w-[100px]" disabled={mostrarTodos}>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleHoje}>
            Hoje
          </Button>

          <Button
            variant={mostrarTodos ? "default" : "outline"}
            size="sm"
            onClick={handleToggleTodos}
          >
            Todos
          </Button>
        </div>
      </div>

      {/* ✅ FIX 1: Cards com texto menor para caber o faturamento no label */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-3">
            <div className="flex items-start justify-between mb-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-tight">
                {label}
              </p>
              <Icon className={`h-3.5 w-3.5 shrink-0 ml-1 ${color}`} />
            </div>
            <p className="text-xl font-bold leading-tight">{isLoading ? "—" : value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ordens recentes ·{" "}
          {mostrarTodos
            ? "Todas as ordens"
            : `${MESES[mesSelecionado]} ${anoSelecionado}`}
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : ordensDoPeriodo.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma ordem de serviço neste período.
          </p>
        ) : (
          <div className="divide-y">
            {(mostrarTodos ? ordensDoPeriodo : ordensDoPeriodo.slice(0, 5)).map((os) => (
              <button
                key={os.id}
                type="button"
                onClick={() => handleAbrirOS(os)}
                className="w-full text-left py-3 flex items-center justify-between hover:bg-accent/50 rounded-md px-2 -mx-2 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    OS #{os.numero_os} · {os.cliente}
                  </p>
                  <p className="text-sm text-muted-foreground">{os.equipamento}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  {os.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <OrdemServicoDetalheModal
        open={detalheOpen}
        onOpenChange={handleDetalheOpenChange}
        os={detalheOS}
      />
    </div>
  );
}
