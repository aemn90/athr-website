"use client";

import Image from "next/image";
import { type Locale, type Project, categories } from "@/lib/content";
import { Dialog } from "./dialog";
import { Icon } from "./icons";

export function ProjectDialog({ project, locale, onClose, onStart }: { project: Project; locale: Locale; onClose: () => void; onStart: (service: string) => void }) {
  const t = (ar: string, en: string) => locale === "ar" ? ar : en;
  return <Dialog title={`${project.name[locale]} — ${project.subtitle[locale]}`} closeLabel={t("إغلاق", "Close")} onClose={onClose} className="project-dialog">
    <div className="case-heading"><span className="eyebrow">{categories.find(category => category.id === project.category)?.[locale]}<span className="small-dot" />{project.year}</span><h3>{project.name[locale]}<span> — {project.subtitle[locale]}</span></h3><p>{project.description[locale]}</p></div>
    <div className="case-image" style={{ backgroundColor: project.color }}><Image src={project.image} alt={project.name[locale]} fill sizes="(max-width: 800px) 95vw, 820px" /></div>
    <div className="case-body"><div className="case-meta"><div><span>{t("العميل", "Client")}</span><strong>{project.name[locale]}</strong></div><div><span>{t("مدة المشروع", "Timeline")}</span><strong>{project.duration[locale]}</strong></div><div><span>{t("سنة التنفيذ", "Year")}</span><strong>{project.year}</strong></div></div>
      <div className="case-columns"><div><h4>{t("التحدّي", "The challenge")}</h4><p>{project.challenge[locale]}</p></div><div><h4>{t("الأثر الذي صنعناه", "Our approach")}</h4><p>{project.solution[locale]}</p></div></div>
      <h4>{t("ماذا قدّمنا؟", "What we delivered")}</h4><div className="deliverables">{project.deliverables[locale].map(item => <span key={item}><Icon name="check" size={15} />{item}</span>)}</div>
      <div className="case-cta"><div><h4>{t("مشروعك قد يكون الحكاية القادمة.", "Your project could be our next story.")}</h4><p>{t("لنصنع معًا شيئًا يستحق أن يُذكر.", "Let's make something worth remembering.")}</p></div><button className="button button-primary" onClick={() => onStart(project.category)}>{t("لنبدأ مشروعك", "Let's talk")}<Icon name="arrow-up-left" size={18} /></button></div>
    </div>
  </Dialog>;
}
