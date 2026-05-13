"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const links = [
  { href: "/", label: "首页", icon: "mdi:home-heart" },
  { href: "/detect", label: "实时监测", icon: "mdi:eye-check-outline" },
  { href: "/health", label: "健康监护", icon: "mdi:heart-pulse" },
  { href: "/dispatch", label: "风险调度", icon: "mdi:broadcast" },
  { href: "/profiles", label: "行为画像", icon: "mdi:account-details" },
  { href: "/emergency", label: "应急流程", icon: "mdi:ambulance" },
  { href: "/events", label: "事件管理", icon: "mdi:alert-octagon-outline" },
  { href: "/dashboard", label: "数据看板", icon: "mdi:chart-areaspline" },
  { href: "/knowledge", label: "智能助手", icon: "mdi:robot-outline" },
];

interface SidebarProps {
  collapsed: boolean;
  onNavigate: () => void;
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "hidden flex-col border-r border-[#172033]/10 bg-white/90 shadow-[12px_0_40px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 lg:flex",
        collapsed ? "w-0 overflow-hidden opacity-0" : "w-60 opacity-100",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-[#172033]/8 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/20">
          <Icon icon="mdi:shield-check" className="text-xl" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-[#172033]">安养智巡</p>
          <p className="text-[11px] text-[#5d6b82]">AI 安全风险预警系统</p>
        </div>
      </div>
      <nav className="mt-5 flex-1 space-y-1 px-3">
        {links.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-teal-500/12 to-sky-500/10 text-teal-800 shadow-sm ring-1 ring-teal-500/15"
                  : "text-[#5d6b82] hover:bg-[#f5f7fb] hover:text-[#172033]",
              )}
            >
              <Icon icon={item.icon} className={clsx("shrink-0 text-lg transition-colors", active ? "text-teal-700" : "text-[#7b8798] group-hover:text-teal-700")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl border border-teal-500/15 bg-teal-500/8 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          系统运行正常
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-[#5d6b82]">实时监测、风险调度、护理知识库已在线。</p>
      </div>
    </aside>
  );
}
