import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone, MapPin, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, type Cliente, type OrdemServico } from "@/integrations/supabase/client";
import { useAuthContext } from "@/components/AuthProvider";
import { maskTelefone, maskCPFCNPJ, maskCEP } from "@/lib/masks";

export const Route = createFileRoute("/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Cliente — W3-Gotecnologia" },
      { name: "description", content: "Visualize os dados completos do cliente e o histórico de ordens de serviço da W3-Gotecnologia." },
      { property: "og:title", content: "Detalhes do Cliente — W3-Gotecnologia" },
      { property: "og:description", content: "Visualize os dados completos do cliente e o histórico de ordens de serviço da W3-Gotecnologia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClienteDetalhePage,
});

const STATUS_COLORS: Record<string, string> = {
  Aguardando: "bg-warning/15 text-warning-foreground border border-warning/30",
  Diagnóstico: "bg-info/15 text-info border border-info/30",
  "Em andamento": "bg-primary/15 text-primary border border-primary/30",
  "Em Andamento": "bg-primary/15 text-primary border border-primary/30",
  Concluída: "bg-success/15 text-success border border-success/30",
  Concluido: "bg-success/15 text-success border border-success/30",
  Cancelada: "bg-destructive/15 text-destructive border border-destructive/30",
};

function ClienteDetalhePage() {
  const { id } = Route.useParams();
  const { user } = useAuthContext();

  const { data: cliente, isLoading: loadingCliente } = useQuery({
    queryKey: ["cliente", id, user?.id],
    enabled: !!user && !!id,
    queryFn: async (): Promise<Cliente | null> => {
      const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: ordens = [], isLoading: loadingOrdens } = useQuery({
    queryKey: ["ordens-cliente", cliente?.nome, user?.id],
    enabled: !!user && !!cliente?.nome,
    queryFn: async (): Promise<OrdemServico[]> => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*")
        .eq("cliente", cliente!.nome)
        .order("numero_os", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loadingCliente) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Carregando cliente...</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Cliente não encontrado</h1>
        <Button asChild variant="outline">
          <Link to="/clientes">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para clientes
          </Link>
        </Button>
      </div>
    );
  }

  const enderecoCompleto = [cliente.endereco, cliente.cidade, cliente.estado, cliente.cep]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/clientes">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{cliente.nome}</h1>
            <p className="text-muted-foreground mt-1">Detalhes do cliente</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">{cliente.nome}</p>
              <p className="text-sm text-muted-foreground">{cliente.cpf ? maskCPFCNPJ(cliente.cpf) : "CPF/CNPJ não informado"}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">E-mail</p>
                <p className="text-sm">{cliente.email || "seuemail@gmail.com.br"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Telefone</p>
                <p className="text-sm">{cliente.telefone ? maskTelefone(cliente.telefone) : "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Endereço</p>
                <p className="text-sm">{enderecoCompleto || "Não informado"}</p>
                {cliente.cep && <p className="text-xs text-muted-foreground mt-1">CEP: {maskCEP(cliente.cep)}</p>}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Ordens de Serviço</h2>
            </div>
            <Badge variant="secondary">{ordens.length} OS(s)</Badge>
          </div>

          {loadingOrdens ? (
            <p className="text-sm text-muted-foreground">Carregando ordens...</p>
          ) : ordens.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma ordem de serviço vinculada a este cliente.</p>
          ) : (
            <div className="space-y-2">
              {ordens.map((os) => (
                <div
                  key={os.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">
                      OS #{os.numero_os} · {os.equipamento}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Entrada: {os.data_entrada ? new Date(os.data_entrada + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[os.status ?? "Aguardando"] ?? "bg-secondary text-secondary-foreground"}>
                    {os.status || "Aguardando"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
