import { createFileRoute } from "@tanstack/react-router";

import pcStationImg from "../assets/pc-station.jpg";
import laptopProImg from "../assets/laptop-pro.jpg";
import mobileLabImg from "../assets/mobile-lab.jpg";
import tabTechImg from "../assets/tab-tech.jpg";
import printSysImg from "../assets/print-sys.jpg";
import workbenchImg from "../assets/workbench.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "W3-Gotecnologia — Assistência Técnica Especializada em São Paulo" },
      { name: "description", content: "Bem-vindo à W3-Gotecnologia. Reparos especializados em computadores, notebooks, celulares, tablets e impressoras com garantia, peças premium e agilidade técnica." },
      { property: "og:title", content: "W3-Gotecnologia — Assistência Técnica Especializada" },
      { property: "og:description", content: "Reparos especializados em computadores, notebooks, celulares, tablets e impressoras com garantia e agilidade técnica." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Gostaria de um orçamento para assistência técnica."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const PHONE_LABEL = "+55 (11) 9999-9999";

const services = [
  {
    title: "Computadores",
    description: "Montagem, limpeza e upgrade de performance.",
    label: "PC_STATION",
    image: pcStationImg,
    offset: false,
  },
  {
    title: "Notebooks",
    description: "Reparos em placa-mãe, telas e baterias originais.",
    label: "LAPTOP_PRO",
    image: laptopProImg,
    offset: true,
  },
  {
    title: "Celulares",
    description: "Troca de tela frontal e conectores de carga.",
    label: "MOBILE_LAB",
    image: mobileLabImg,
    offset: false,
  },
  {
    title: "Tablets",
    description: "Recuperação de software e touch screen.",
    label: "TAB_TECH",
    image: tabTechImg,
    offset: true,
  },
  {
    title: "Impressoras",
    description: "Manutenção preventiva e laser-jet repair.",
    label: "PRINT_SYS",
    image: printSysImg,
    offset: false,
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex justify-between items-center">
        <div className="font-mono text-sm font-bold tracking-tighter">
          W3-GOTECNOLOGIA<span className="text-primary">_</span>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="#services"
            className="text-xs font-medium uppercase tracking-widest hover:text-primary transition-colors"
          >
            Serviços
          </a>
          <a
            href="#contact"
            className="bg-foreground text-background text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-primary transition-colors"
          >
            Orçamento
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-6 pt-20 pb-12 max-w-7xl mx-auto border-x border-border">
        <div className="absolute top-0 right-0 p-6 font-mono text-[10px] text-muted flex flex-col items-end opacity-50">
          <span>REV. 2024.3</span>
          <span>PRECISION_REPAIR_LAB</span>
        </div>

        <div className="max-w-3xl animate-reveal">
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary font-mono text-[10px] font-bold mb-6 rounded">
            LABORATÓRIO ESPECIALIZADO
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-balance mb-8">
            W3-Go
            <br />
            tecnologia
          </h1>
          <p className="text-xl text-muted max-w-[45ch] leading-relaxed text-pretty">
            Restauração técnica de dispositivos com precisão milimétrica. Onde a
            engenharia encontra o cuidado artesanal.
          </p>
        </div>

        {/* Confidence Bar */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border-y border-border">
          <div className="bg-background py-8 flex flex-col gap-2">
            <span className="font-mono text-primary text-xs">[01]</span>
            <h3 className="font-bold">Garantia Estendida</h3>
            <p className="text-xs text-muted">
              90 dias de cobertura total em todos os serviços realizados.
            </p>
          </div>
          <div className="bg-background py-8 md:px-8 flex flex-col gap-2">
            <span className="font-mono text-primary text-xs">[02]</span>
            <h3 className="font-bold">Agilidade Técnica</h3>
            <p className="text-xs text-muted">
              Diagnósticos precisos em até 24h para emergências corporativas.
            </p>
          </div>
          <div className="bg-background py-8 flex flex-col gap-2 items-end text-right">
            <span className="font-mono text-primary text-xs">[03]</span>
            <h3 className="font-bold">Peças Premium</h3>
            <p className="text-xs text-muted">
              Utilizamos apenas componentes de alta performance e procedência.
            </p>
          </div>
        </div>
      </header>

      {/* Service Grid */}
      <section id="services" className="px-6 py-24 max-w-7xl mx-auto border-x border-border">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tighter">
              Nossas Especialidades
            </h2>
            <p className="text-muted mt-2">Hardware, Software e Recuperação.</p>
          </div>
          <div className="hidden md:block h-px flex-1 mx-12 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {services.map((service) => (
            <div
              key={service.label}
              className={`group bg-card p-6 border border-border rounded-2xl hover:border-primary transition-all ${
                service.offset ? "md:translate-y-8" : ""
              }`}
            >
              <div className="w-full aspect-square bg-muted/10 rounded-lg mb-4 grid place-items-center overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  width={600}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <h4 className="font-bold mb-1">{service.title}</h4>
              <p className="text-[11px] text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section
        id="contact"
        className="px-6 py-24 max-w-7xl mx-auto border-x border-border border-b border-border"
      >
        <div className="bg-foreground rounded-[2rem] p-8 md:p-16 text-background flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="relative z-10 md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
              Pronto para o seu reparo?
            </h2>
            <p className="text-background/60 mb-8 max-w-[40ch]">
              Fale diretamente com nossa equipe técnica via WhatsApp e receba um
              pré-orçamento em minutos.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-transform"
              >
                WhatsApp Direct
              </a>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="block text-[10px] text-white/40 uppercase font-mono">
                  Telefone
                </span>
                <span className="font-bold text-lg">{PHONE_LABEL}</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="w-full aspect-[4/3] bg-white/5 outline outline-1 outline-white/10 rounded-2xl grid place-items-center overflow-hidden">
              <img
                src={workbenchImg}
                alt="Bancada técnica organizada com ferramentas de precisão e laptop aberto"
                width={1024}
                height={768}
                loading="lazy"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 max-w-7xl mx-auto border-x border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="font-mono text-[10px] text-muted">
          © 2024 W3-GOTECNOLOGIA — TODOS OS DIREITOS RESERVADOS.
        </div>
        <div className="flex flex-col md:items-end">
          <span className="text-xs font-bold">São Paulo, Brasil</span>
          <span className="text-xs text-muted">
            Segunda a Sexta: 08:00 – 18:00
          </span>
        </div>
      </footer>
    </div>
  );
}
