import React, { useEffect, useRef } from "react";

interface TeleprompterViewProps {
  content: string;
  fontSize: number;
  speed: number;
  isScrolling: boolean;
  theme: "dark" | "light";
  onToggleScroll: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onFontSizeChange: (size: number) => void;
  onFullscreenToggle: () => void;
  isFullscreen?: boolean;
}

export default function TeleprompterView({
  content,
  fontSize,
  speed,
  isScrolling,
  theme,
  onToggleScroll,
  onReset,
  onSpeedChange,
  onFontSizeChange,
  onFullscreenToggle,
  isFullscreen
}: TeleprompterViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isScrolling) {
      if (scrollTimerRef.current) cancelAnimationFrame(scrollTimerRef.current);
      scrollTimerRef.current = null;
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const tick = () => {
      container.scrollTop += speed * 0.45;
      scrollTimerRef.current = requestAnimationFrame(tick);
    };

    scrollTimerRef.current = requestAnimationFrame(tick);
    return () => {
      if (scrollTimerRef.current) cancelAnimationFrame(scrollTimerRef.current);
    };
  }, [isScrolling, speed]);

  const getProcessedHtml = () => {
    if (!content) {
      return "O seu roteiro está vazio atualmente.<br/><br/>Escreva algo na aba <strong>Roteiro</strong> primeiro!";
    }

    if (theme === "dark") return content;

    return content
      .replace(/color:\s*#fef2f2/g, "color: #1a0505")
      .replace(/color:\s*#eff6ff/g, "color: #04102e")
      .replace(/color:\s*#fffbeb/g, "color: #1c1000")
      .replace(/color:\s*#ecfdf5/g, "color: #01200e")
      .replace(/color:\s*#f1f1f1/g, "color: #0f172a")
      .replace(/color:\s*white/g, "color: #000000");
  };

  const isDark = theme === "dark";
  const bgColor = "bg-yt-bg-primary";
  const textColor = "text-yt-text-primary";
  const controlBg = "bg-yt-bg-surface/96";
  const controlBorder = "border-yt-bg-overlay";
  const dockWidth = isDark ? "w-[min(calc(100%-1rem),72rem)]" : "w-[min(calc(100%-1rem),66rem)]";

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-[1000]" : "relative w-full h-full"} ${bgColor} ${textColor} flex flex-col`}>
      {/* ─── CONTROLS BAR ─── */}
      <div className={`fixed bottom-3 left-1/2 z-[1002] ${dockWidth} -translate-x-1/2 rounded-2xl border ${controlBg} ${controlBorder} px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-6 lg:px-8 flex flex-nowrap items-center justify-center gap-4 overflow-x-auto transition-[width] duration-200`}>

         
        {/* Gravar / Pausar */}
        <button
          onClick={onToggleScroll}
          className={`px-5 py-2 rounded-[4px] font-extrabold uppercase tracking-wider text-xs flex items-center gap-2 transition-all cursor-pointer ${
            isScrolling
              ? "bg-[#ffb74d] text-[#111] hover:bg-[#ffa726]"
              : "bg-[#ff5045] text-white hover:bg-[#ff3f33]"
          }`}
        >
          <span className="material-icons text-sm">{isScrolling ? "pause" : "radio_button_unchecked"}</span>
          {isScrolling ? "Pausar" : "Gravar"}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 text-yt-text-secondary hover:text-yt-text-primary"
        >
          <span className="material-icons text-base">restart_alt</span>
          <span className="hidden sm:inline">Reiniciar</span>
        </button>

        <span className="w-px h-5 bg-yt-bg-overlay hidden sm:block" />


        {/* Speed */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-yt-text-disabled">Velocidade</span>
          <input
            type="range" min="1" max="10" step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-32 accent-[#ff5045] cursor-pointer"
          />
          <span className="text-sm font-bold w-8 text-yt-text-primary">{speed}x</span>
        </div>

        <span className="w-px h-5 bg-yt-bg-overlay hidden sm:block" />

        {/* Font Size */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-yt-text-disabled">Tamanho</span>
          <input
            type="range" min="28" max="96"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            className="w-32 accent-[#ff5045] cursor-pointer"
          />
          <span className="text-sm font-bold w-10 text-yt-text-primary">{fontSize}px</span>
        </div>

        <span className="w-px h-5 bg-yt-bg-overlay hidden sm:block" />
        <button
          onClick={onFullscreenToggle}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 text-yt-text-secondary hover:text-yt-text-primary"
        >
          <span className="material-icons text-base">{isFullscreen ? "close_fullscreen" : "fullscreen"}</span>
          <span className="hidden sm:inline">{isFullscreen ? "Reduzir" : "Tela Cheia"}</span>
        </button>

        {/* Recording indicator */}
        {isScrolling && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5045] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#ff5045] uppercase tracking-widest">Gravando</span>
          </div>
        )}
      </div>

      {/* ─── FOCUS LINE ─── */}
      <div className="relative flex-1 overflow-hidden pb-32 md:pb-36">
        {/* Gradient fade top */}
        <div className={`pointer-events-none absolute top-0 left-0 right-0 h-24 z-10 ${isDark ? "bg-gradient-to-b from-[#050505] to-transparent" : "bg-gradient-to-b from-white to-transparent"}`} />

        {/* Focus marker */}
        <div className={`pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] z-10 ${isDark ? "bg-[#ff5045]/20" : "bg-[#ff5045]/15"}`} />
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-between px-4">
          <span className="material-icons text-[#ff5045]/30 text-4xl">chevron_right</span>
          <span className="material-icons text-[#ff5045]/30 text-4xl">chevron_left</span>
        </div>

        {/* Text scroll area */}
        <div
          ref={scrollContainerRef}
          onClick={onToggleScroll}
          className="h-full overflow-y-auto cursor-pointer py-16 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            className="mx-auto max-w-5xl text-center font-extrabold leading-tight select-none"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.45 }}
            dangerouslySetInnerHTML={{ __html: getProcessedHtml() }}
          />
          <div className="h-[70vh]" />
        </div>

        {/* Gradient fade bottom */}
        <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-10 ${isDark ? "bg-gradient-to-t from-[#050505] to-transparent" : "bg-gradient-to-t from-white to-transparent"}`} />
      </div>
    </div>
  );
}
