"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { categories, faqs, projects, services, testimonials, type Locale, type Project } from "@/lib/content";
import { ContactDialog } from "./contact-dialog";
import { ProjectDialog } from "./project-dialog";
import { Dialog } from "./dialog";
import { Icon, Mark, Star } from "./icons";

type OpenDialog = { type: "contact"; service?: string } | { type: "project"; project: Project } | { type: "privacy" } | null;

export default function StudioSite() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterError, setNewsletterError] = useState<"rate" | "server">("server");
  const t = (ar: string, en: string) => locale === "ar" ? ar : en;
  const openContact = (service?: string) => { setMobileOpen(false); setDialog({ type: "contact", service }); };
  const nav = [
    { id: "home", label: t("الرئيسية", "Home") },
    { id: "services", label: t("خدماتنا", "Services") },
    { id: "work", label: t("أعمالنا", "Work") },
    { id: "about", label: t("عن أثر", "About") },
    { id: "testimonials", label: t("قالوا عنّا", "Kind words") },
  ];
  const filteredProjects = projects.filter(project => category === "all" || project.category === category);
  const visibleProjects = expanded ? filteredProjects : filteredProjects.slice(0, 3);
  const testimonial = testimonials[testimonialIndex];

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    ["home", "work", "services", "about", "testimonials"].forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newsletterStatus === "loading") return;
    const form = new FormData(event.currentTarget);
    setNewsletterStatus("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), website: form.get("website") }) });
      if (!response.ok) {
        setNewsletterError(response.status === 429 ? "rate" : "server");
        setNewsletterStatus("error");
      } else setNewsletterStatus("success");
    } catch { setNewsletterError("server"); setNewsletterStatus("error"); }
  }

  return <>
    <a className="skip-link" href="#main">{t("انتقل إلى المحتوى", "Skip to content")}</a>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="brand" aria-label={t("أثر — الصفحة الرئيسية", "Athar — home")} onClick={() => setMobileOpen(false)}><Mark /><span className="brand-name">أثر<span className="brand-dot">.</span></span><span className="brand-descriptor">{t("استوديو\nإبداعي", "CREATIVE\nSTUDIO")}</span></a>
        <nav className="desktop-nav" aria-label={t("القائمة الرئيسية", "Main navigation")}>{nav.map(item => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? "active" : ""} aria-current={activeSection === item.id ? "location" : undefined}>{item.label}</a>)}</nav>
        <div className="header-actions"><button className="button button-header" onClick={() => openContact()}>{t("لنتحدث", "Let's talk")}<Icon name="arrow-up-left" size={18} /></button><button className="language-button" onClick={() => { setLocale(locale === "ar" ? "en" : "ar"); setMobileOpen(false); }} aria-label={t("Switch to English", "التبديل إلى العربية")}>{locale === "ar" ? "EN" : "عربي"}</button><button className="menu-button icon-button" aria-label={mobileOpen ? t("إغلاق القائمة", "Close menu") : t("فتح القائمة", "Open menu")} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? "close" : "menu"} /></button></div>
      </div>
      {mobileOpen && <nav className="mobile-nav" id="mobile-nav" aria-label={t("قائمة الهاتف", "Mobile navigation")}>{nav.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMobileOpen(false)}>{item.label}<Icon name="arrow-up-left" size={16} /></a>)}</nav>}
    </header>

    <main id="main">
      <section className="hero-section container" id="home" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="orange-dot" />{t("استوديو إبداعي. شريك لطموحك.", "An independent studio. A partner in ambition.")}</div>
          <h1 id="hero-heading">{t("نصنع أفكارًا،", "Bold ideas.")}<br /><span className="hero-orange">{t("تترك أثرًا.", "Lasting impact.")}<svg className="hero-underline" viewBox="0 0 360 18" fill="none" aria-hidden="true"><path d="M3 13C87 1 229 0 354 9M35 17C124 7 245 7 328 13" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" /></svg></span><span className="headline-spark" aria-hidden="true">✳</span></h1>
          <p className="hero-description">{t("نمزج التفكير الجريء بالتصميم الهادف والتقنية، لنحوّل رؤيتك إلى علامة تُلهم وتجربة رقمية لا تُنسى.", "We bring bold thinking, purposeful design, and technology together to turn your vision into a brand that inspires and an experience that stays.")}</p>
          <div className="hero-buttons"><button className="button button-primary" onClick={() => openContact()}>{t("لنبدأ مشروعك", "Start a project")}<Icon name="arrow-up-left" size={21} /></button><a className="button button-text" href="#work">{t("اكتشف أعمالنا", "Explore our work")}<Icon name="arrow-down" size={19} /></a></div>
          <div className="hero-proof"><div className="avatar-stack" aria-hidden="true"><Image src="/images/avatar-1.jpg" alt="" width={42} height={42} /><Image src="/images/avatar-2.jpg" alt="" width={42} height={42} /><Image src="/images/avatar-3.jpg" alt="" width={42} height={42} /><span>+80</span></div><div className="proof-copy"><span className="rating-stars" aria-label={t("خمس نجوم", "Five stars")}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} />)}</span><p>{t("علامة طموحة وثقت في أثر", "Ambitious brands put their trust in us")}</p></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-art"><Image src="/images/hero-art.jpg" alt={t("مجسّم برتقالي إبداعي على شكل زهرة في مساحة معمارية ليلكية", "An expressive orange flower sculpture in a lilac architectural space")} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 46vw, 590px" priority quality={90} /><span className="art-corner-text" dir="ltr">A DIFFERENT<br />KIND OF STUDIO.</span><span className="art-index" dir="ltr">ATHAR® &nbsp; / &nbsp; EST. 2020</span></div>
          <div className="creative-stamp" aria-hidden="true"><svg viewBox="0 0 120 120" className="stamp-text" style={{ direction: "ltr" }}><defs><path id="stamp-circle" d="M60,60m-44,0a44,44 0 1,1 88,0a44,44 0 1,1 -88,0" /></defs><text><textPath href="#stamp-circle" startOffset="0%">GOOD IDEAS. GREAT IMPACT. GOOD IDEAS. </textPath></text></svg><Mark /></div>
          <div className="hero-note"><span className="note-icon"><Icon name="spark" size={24} /></span><div><strong>{t("خارج المألوف.", "A little unexpected.")}</strong><span>{t("تمامًا كما تستحق فكرتك", "Just like your best ideas")}</span></div><span className="note-scribble" aria-hidden="true">↗</span></div>
          <Mark className="visual-spark" />
          <div className="visual-footnote"><span>{t("شغف في الفكرة. إتقان في التفاصيل.", "Passion in the idea. Care in every detail.")}</span><span dir="ltr">IDEAS INTO IMPACT ↗</span></div>
        </div>
      </section>

      <section className="trusted-section container" aria-label={t("شركاؤنا", "Our clients")}>
        <p className="trusted-intro">{t("شركاء الطموح،", "Shared ambition,")}<br /><strong>{t("وجزء من الحكاية.", "a shared story.")}</strong></p>
        <div className="client-logos" aria-label="Nawa, Madar, Luma, Sukn, Nabdh"><span className="client-nawa" dir="ltr">nawa<span>®</span></span><span className="client-madar" dir="ltr"><span className="madar-mark">Ⅲ</span>MADAR</span><span className="client-luma" dir="ltr"><span className="luma-mark">✳</span>luma</span><span className="client-sukn">سُكن<span className="sukn-square" /></span><span className="client-nabdh" dir="ltr"><svg width="27" height="25" viewBox="0 0 27 25" fill="none" aria-hidden="true"><path d="M1 13h6l4-10 5 20 4-10h6" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /></svg>nabdh.</span></div>
      </section>

      <section className="work-section section-space container" id="work" aria-labelledby="work-heading">
        <div className="section-heading"><div><span className="eyebrow"><span className="orange-dot" />{t("أعمال مختارة", "SELECTED WORK")}</span><h2 id="work-heading">{t("كل مشروع، حكاية أثر.", "Every project. A lasting impact.")}</h2></div><button className="text-link" onClick={() => { setCategory("all"); setExpanded(category === "all" ? !expanded : true); }}>{expanded && category === "all" ? t("عرض أعمال مختارة", "Show selected work") : t("جميع أعمالنا", "View all work")}<Icon name="arrow-left" size={19} /></button></div>
        <div className="work-toolbar"><div className="work-filters" role="group" aria-label={t("تصفية الأعمال", "Filter projects")}>{categories.map(item => <button key={item.id} className={`filter-button ${category === item.id ? "active" : ""}`} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setExpanded(false); }}>{item[locale]}{category === item.id && <span>{String(projects.filter(project => item.id === "all" || project.category === item.id).length).padStart(2, "0")}</span>}</button>)}</div><span className="work-caption">{t("فكرة واضحة. تنفيذ استثنائي.", "Clear thinking. Exceptional execution.")}</span></div>
        <span className="sr-only" aria-live="polite">{t(`${filteredProjects.length} مشاريع في هذا التصنيف`, `${filteredProjects.length} projects in this category`)}</span>
        <div className="projects-grid">{visibleProjects.map(project => <button key={project.id} className="project-card" onClick={() => setDialog({ type: "project", project })} aria-label={t(`اكتشف مشروع ${project.name.ar}`, `Explore the ${project.name.en} project`)}><span className="project-image" style={{ backgroundColor: project.color }}><Image src={project.image} alt={project.subtitle[locale]} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 31vw" /><span className="project-view">{t("اكتشف المشروع", "Explore project")}<Icon name="arrow-up-left" size={18} /></span></span><span className="project-info"><span className="project-meta">{categories.find(item => item.id === project.category)?.[locale]}<span>{project.year}</span></span><span className="project-bottom"><span className="project-name">{project.name[locale]}<span> — {project.subtitle[locale]}</span></span><span className="project-arrow"><Icon name="arrow-up-left" size={20} /></span></span></span></button>)}</div>
      </section>

      <section className="services-section section-space" id="services" aria-labelledby="services-heading"><div className="container">
        <div className="section-heading"><div><span className="eyebrow"><span className="orange-dot" />{t("ما الذي نصنعه؟", "WHAT WE DO")}</span><h2 id="services-heading">{t("من أول فكرة، إلى أبعد أثر.", "From the first spark to what’s next.")}</h2></div><p className="heading-description">{t("حلول إبداعية متكاملة، مصمّمة حول طموحك.\nكل ما تحتاجه علامتك لتأخذ خطوتها القادمة.", "Connected creative solutions, shaped around your ambition.\nEverything your brand needs for its next chapter.")}</p></div>
        <div className="services-grid">{services.map(service => <article className="service-card" key={service.id}><div className="service-top"><Icon name={service.icon} size={30} /><span>{service.number}</span></div><h3>{service.title[locale]}</h3><p>{service.description[locale]}</p><div className="service-tags">{service.tags[locale].map(tag => <span key={tag}>{tag}</span>)}</div><button className="service-action" onClick={() => openContact(service.id)} aria-label={t(`اطلب خدمة ${service.title.ar}`, `Discuss ${service.title.en}`)}>{t("لنصنع شيئًا مميزًا", "Let's make it happen")}<Icon name="arrow-up-left" size={20} /></button></article>)}</div>
      </div></section>

      <section className="about-section section-space container" id="about" aria-labelledby="about-heading">
        <div className="about-visual" aria-hidden="true"><span className="about-art-label" dir="ltr">THINK. CREATE. MATTER.</span><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><Mark className="about-mark" /><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /><span className="about-art-title" dir="ltr">A LITTLE BOLD.<br />A LOT OF IMPACT.</span><span className="about-art-end">أثر<span>®</span></span></div>
        <div className="about-copy"><span className="eyebrow"><span className="orange-dot" />{t("أهلًا، نحن أثر", "HELLO, WE ARE ATHAR")}</span><h2 id="about-heading">{t("عقول مختلفة.", "Different minds.")}<br />{t("شغف واحد.", "One shared passion.")}</h2><p>{t("نحن فريق من المصممين والمطوّرين والمفكّرين، يجمعنا إيمان بأن العمل الجيد لا يكتفي بأن يبدو جميلًا، بل يجب أن يصنع فرقًا.", "We are designers, developers, and thinkers who believe good work should do more than look beautiful. It should make a difference.")}</p><p>{t("نستمع قبل أن نرسم، ونسأل قبل أن نبني. نقترب من كل مشروع كأنه مشروعنا، ونصنع معك شيئًا نفتخر به معًا.", "We listen before we sketch, and ask before we build. We treat every project like our own, creating something we can all be proud of.")}</p><div className="stats-grid"><div><strong dir="ltr">150<span>+</span></strong><span>{t("مشروع رأى النور", "Projects brought to life")}</span></div><div><strong dir="ltr">80<span>+</span></strong><span>{t("شريك نجاح", "Ambitious partners")}</span></div><div><strong dir="ltr">6<span>+</span></strong><span>{t("سنوات من الشغف", "Years of passion")}</span></div></div></div>
        <div className="process-grid">{[
          { no: "01", title: t("نكتشف", "Discover"), copy: t("نسمع حكايتك، نفهم أهدافك، ونبحث عن الفرصة التي لم يرها أحد.", "We hear your story, understand your goals, and find the opportunity others missed.") },
          { no: "02", title: t("نبتكر", "Create"), copy: t("نجرّب ونتخيّل ونصمّم. نمنح فكرتك شكلًا وصوتًا وشخصية.", "We explore, imagine, and design. Giving your idea a shape, a voice, and a character.") },
          { no: "03", title: t("نترك أثرًا", "Make an impact"), copy: t("نحوّل التصميم إلى واقع، نهتم بكل تفصيلة، وننطلق معك بثقة.", "We bring the design to life, care for every detail, and launch with confidence.") },
        ].map(step => <div className="process-step" key={step.no}><span className="process-number">{step.no}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></div>)}</div>
      </section>

      <section className="testimonials-section section-space" id="testimonials" aria-labelledby="testimonials-heading"><div className="container"><div className="section-heading"><div><span className="eyebrow"><span className="orange-dot" />{t("كلمات نعتز بها", "KIND WORDS")}</span><h2 id="testimonials-heading">{t("الأثر، كما يرويه شركاؤنا.", "The impact, in their words.")}</h2></div><div className="slider-controls"><button className="icon-button" onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)} aria-label={t("الرأي السابق", "Previous testimonial")}><Icon name="arrow-right" size={21} /></button><button className="icon-button" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)} aria-label={t("الرأي التالي", "Next testimonial")}><Icon name="arrow-left" size={21} /></button></div></div>
        <div className="testimonial-card"><div className="testimonial-brand"><span className="testimonial-company" dir="ltr">{testimonial.company}</span><span>{t("حكاية نجاح مشتركة", "A shared success story")}</span><div className="rating-stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} />)}</div></div><div className="testimonial-content" aria-live="polite" key={testimonialIndex}><span className="quote-mark" aria-hidden="true">“</span><blockquote>{testimonial.quote[locale]}</blockquote><div className="testimonial-bottom"><div className="testimonial-person"><span className="person-initial" aria-hidden="true">{testimonial.initial}</span><div><strong>{testimonial.name[locale]}</strong><span>{testimonial.role[locale]}</span></div></div><div className="slider-dots" aria-label={t("اختر رأيًا", "Choose a testimonial")}>{testimonials.map((item, index) => <button className={testimonialIndex === index ? "active" : ""} key={item.company} aria-label={t(`رأي ${item.name.ar}`, `${item.name.en}'s testimonial`)} aria-pressed={testimonialIndex === index} onClick={() => setTestimonialIndex(index)} />)}</div></div></div></div>
      </div></section>

      <section className="faq-section section-space container" aria-labelledby="faq-heading"><div className="faq-heading"><span className="eyebrow"><span className="orange-dot" />{t("قبل أن نبدأ", "BEFORE WE BEGIN")}</span><h2 id="faq-heading">{t("ربما تتساءل...", "Good questions.")}</h2><p>{t("بعض الإجابات لتتضح الصورة.\nولكل سؤال آخر، نحن هنا.", "A little clarity before we start.\nFor everything else, just ask.")}</p><button className="text-link" onClick={() => openContact()}>{t("اسألنا مباشرة", "Ask us anything")}<Icon name="arrow-left" size={18} /></button></div><div className="faq-list">{faqs.map((faq, index) => <details key={index}><summary>{faq.question[locale]}<Icon name="plus" size={20} /></summary><p>{faq.answer[locale]}</p></details>)}</div></section>

      <section className="contact-band" id="contact" aria-labelledby="contact-heading"><div className="container contact-inner"><div><span className="eyebrow">{t("الحكاية القادمة قد تكون حكايتك", "OUR NEXT GREAT STORY COULD BE YOURS")}</span><h2 id="contact-heading">{t("لديك فكرة؟", "Got an idea?")}<br />{t("لنصنع منها أثرًا.", "Let's make an impact.")}</h2></div><div className="contact-band-action"><p>{t("الأشياء العظيمة تبدأ بمحادثة بسيطة.", "Great things start with a simple conversation.")}</p><button className="button button-dark" onClick={() => openContact()}>{t("لنتحدث عن مشروعك", "Let's talk about your project")}<Icon name="arrow-up-left" size={22} /></button><span className="availability"><span />{t("متاحون للأفكار الجديدة", "Open for new ideas")}</span></div><Mark className="contact-watermark" /></div></section>
    </main>

    <footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand-block"><a href="#home" className="brand footer-brand" aria-label={t("أثر — العودة للأعلى", "Athar — back to top")}><Mark /><span className="brand-name">أثر<span className="brand-dot">.</span></span></a><p>{t("استوديو إبداعي للأفكار الجريئة،\nوالعلامات التي تريد أن تترك أثرًا.", "A creative studio for bold ideas\nand brands that want to make an impact.")}</p><span className="footer-location"><Icon name="pin" size={15} />{t("من الرياض، إلى كل مكان.", "From Riyadh, to everywhere.")}</span></div><div className="footer-links"><h3>{t("اكتشف أثر", "Explore Athar")}</h3><a href="#work">{t("أعمالنا", "Our work")}</a><a href="#services">{t("خدماتنا", "What we do")}</a><a href="#about">{t("عن الاستوديو", "The studio")}</a><a href="#testimonials">{t("شركاء النجاح", "Our partners")}</a></div><div className="footer-links"><h3>{t("لنبقَ على تواصل", "Stay connected")}</h3><a href="mailto:hello@athar.studio" className="email-link" dir="ltr">hello@athar.studio<Icon name="arrow-up-right" size={14} /></a><button onClick={() => openContact()}>{t("ابدأ مشروعًا", "Start a project")}</button><button onClick={() => setDialog({ type: "privacy" })}>{t("الخصوصية", "Your privacy")}</button></div><div className="newsletter"><h3>{t("جرعة إلهام، بين حين وآخر.", "A little inspiration, now and then.")}</h3><p>{t("أفكار وأعمال وأشياء تستحق أن نشاركها.", "Ideas, work, and things worth sharing.")}</p>{newsletterStatus === "success" ? <div className="newsletter-success" role="status"><Icon name="check" size={20} /><div><strong>{t("أهلًا بك في دائرة أثر!", "Welcome to the Athar circle!")}</strong><span>{t("تم تسجيل بريدك في نشرتنا بنجاح.", "You're successfully on the list.")}</span></div></div> : <form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">{t("بريدك الإلكتروني", "Your email address")}</label><div className="newsletter-input"><input id="newsletter-email" name="email" type="email" placeholder={t("بريدك الإلكتروني", "Your email address")} required maxLength={254} autoComplete="email" /><button type="submit" disabled={newsletterStatus === "loading"} aria-label={t("اشترك في النشرة", "Subscribe to the newsletter")}><Icon name={newsletterStatus === "loading" ? "loader" : "arrow-left"} size={19} className={newsletterStatus === "loading" ? "spin" : ""} /></button></div><div className="honeypot" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" aria-label="Website" /></div>{newsletterStatus === "error" && <p className="newsletter-error" role="alert">{newsletterError === "rate" ? t("انتظر دقيقة وحاول مجددًا.", "Please wait a minute and try again.") : t("تعذّر الاشتراك. حاول مرة أخرى.", "Couldn't subscribe. Please try again.")}</p>}<span className="newsletter-note">{t("باشتراكك، توافق على تلقي نشرتنا. لا رسائل مزعجة.", "By subscribing, you agree to receive our newsletter. No spam.")}</span></form>}</div></div><div className="footer-bottom"><p>{t("© ٢٠٢٦ أثر. جميع الحقوق محفوظة.", "© 2026 Athar Studio. All rights reserved.")}</p><span className="made-with">{t("صُنع بشغف، ليترك أثرًا", "Made with care. Made to matter.")}<Mark /></span><a href="#home">{t("إلى الأعلى", "Back to top")}<Icon name="arrow-up-left" size={16} /></a></div></div></footer>

    {dialog?.type === "contact" && <ContactDialog locale={locale} initialService={dialog.service} onClose={() => setDialog(null)} />}
    {dialog?.type === "project" && <ProjectDialog project={dialog.project} locale={locale} onClose={() => setDialog(null)} onStart={openContact} />}
    {dialog?.type === "privacy" && <Dialog title={t("سياسة الخصوصية", "Privacy policy")} closeLabel={t("إغلاق", "Close")} onClose={() => setDialog(null)} className="privacy-dialog"><span className="eyebrow">{t("ثقتك تعني لنا الكثير", "YOUR TRUST MATTERS")}</span><h3>{t("خصوصيتك، باختصار.", "Your privacy, in plain words.")}</h3><p>{t("نجمع فقط المعلومات التي تشاركها معنا عبر نموذج طلب المشروع أو الاشتراك في النشرة.", "We collect only the information you share through the project inquiry form or newsletter signup.")}</p><h4>{t("كيف نستخدم بياناتك؟", "How do we use your data?")}</h4><p>{t("نستخدم معلومات الطلب لفهم مشروعك والتواصل معك بشأنه، ونستخدم بريد الاشتراك لإرسال أخبار الاستوديو. تُحفظ هذه البيانات في قاعدة بيانات الموقع، ولا نبيعها لأطراف أخرى.", "We use your inquiry to understand your project and contact you about it. Newsletter emails are used for studio updates. This information is stored in our database and is not sold to third parties.")}</p><h4>{t("أنت صاحب القرار", "You stay in control")}</h4><p>{t("يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها أو إلغاء الاشتراك، عبر نموذج التواصل. لا يستخدم هذا الموقع ملفات تتبّع إعلانية.", "You can request access, corrections, deletion, or unsubscribe through our contact form. This site does not use advertising tracking cookies.")}</p><button className="button button-primary" onClick={() => openContact("not-sure")}>{t("تواصل بخصوص بياناتك", "Contact us about your data")}<Icon name="arrow-up-left" size={18} /></button></Dialog>}
  </>;
}
