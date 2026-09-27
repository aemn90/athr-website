"use client";

import { useState, type FormEvent } from "react";
import { type Locale, services } from "@/lib/content";
import { Dialog } from "./dialog";
import { Icon, Mark } from "./icons";

export function ContactDialog({ locale, initialService = "", onClose }: { locale: Locale; initialService?: string; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const t = (ar: string, en: string) => locale === "ar" ? ar : en;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), company: form.get("company"), service: form.get("service"), budget: form.get("budget"), message: form.get("message"), website: form.get("website"), consent: form.get("consent") === "on" }) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error === "rate_limit" ? t("أرسلت عدة طلبات. انتظر دقيقة ثم حاول مجددًا.", "Please wait a minute before sending another request.") : result.error === "invalid" ? t("يرجى التأكد من تعبئة الحقول بشكل صحيح.", "Please check that all fields are filled out correctly.") : t("تعذّر إرسال طلبك الآن. يرجى المحاولة مرة أخرى.", "We couldn't send your request. Please try again."));
        setStatus("error");
        return;
      }
      setReference(result.reference);
      setStatus("success");
    } catch {
      setError(t("تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.", "Connection failed. Check your internet and try again."));
      setStatus("error");
    }
  }
  return (
    <Dialog title={t("لنبدأ مشروعك", "Let's start your project")} closeLabel={t("إغلاق", "Close")} onClose={onClose} className="contact-dialog">
      {status === "success" ? <div className="form-success" role="status">
        <div className="success-symbol"><Icon name="check" size={38} /></div>
        <span className="eyebrow">{t("هذه بداية حكاية جميلة", "THE START OF SOMETHING GOOD")}</span>
        <h3>{t("وصلت فكرتك. والباقي علينا!", "Your idea is in good hands.")}</h3>
        <p>{t("تم حفظ طلبك بنجاح. سنراجع التفاصيل ونتواصل معك عبر بريدك الإلكتروني خلال يومَي عمل.", "Your request has been saved. We'll review your brief and get back to you by email within two business days.")}</p>
        <div className="request-reference"><span>{t("رقم طلبك", "Your reference")}</span><strong dir="ltr">{reference}</strong></div>
        <button className="button button-primary" onClick={onClose}>{t("رائع، إلى اللقاء", "Great, speak soon")}<Icon name="arrow-left" size={19} /></button>
      </div> : <>
        <div className="form-heading"><Mark /><span className="eyebrow">{t("كل أثر يبدأ بفكرة", "EVERY IMPACT STARTS WITH AN IDEA")}</span><h3>{t("ماذا يدور في بالك؟", "What do you have in mind?")}</h3><p>{t("أخبرنا قليلًا عنك وعن مشروعك. لنكتشف ما يمكننا صنعه معًا.", "Tell us a little about you and your project. Let's see what we can make together.")}</p></div>
        <form className="project-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="form-field">{t("الاسم الكامل", "Full name")} <span aria-hidden="true">*</span><input name="name" autoComplete="name" placeholder={t("كيف نناديك؟", "What should we call you?")} required minLength={2} maxLength={120} /></label>
            <label className="form-field">{t("البريد الإلكتروني", "Email address")} <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} dir="ltr" /></label>
            <label className="form-field">{t("اسم العلامة أو الشركة", "Brand or company")}<input name="company" autoComplete="organization" placeholder={t("اختياري", "Optional")} maxLength={160} /></label>
            <label className="form-field">{t("كيف يمكننا مساعدتك؟", "How can we help?")} <span aria-hidden="true">*</span><select name="service" defaultValue={initialService} required><option value="" disabled>{t("اختر الخدمة", "Choose a service")}</option>{services.map(service => <option key={service.id} value={service.id}>{service.title[locale]}</option>)}<option value="not-sure">{t("لنكتشف ذلك معًا", "Let's figure it out together")}</option></select></label>
          </div>
          <label className="form-field">{t("الميزانية المتوقعة", "Estimated budget")} <span aria-hidden="true">*</span><select name="budget" defaultValue="" required><option value="" disabled>{t("اختر النطاق المناسب (ريال سعودي)", "Choose a range (SAR)")}</option><option value="under-10k">{t("أقل من ١٠٬٠٠٠ ر.س", "Under SAR 10,000")}</option><option value="10k-25k">{t("١٠٬٠٠٠ – ٢٥٬٠٠٠ ر.س", "SAR 10,000–25,000")}</option><option value="25k-50k">{t("٢٥٬٠٠٠ – ٥٠٬٠٠٠ ر.س", "SAR 25,000–50,000")}</option><option value="50k-plus">{t("أكثر من ٥٠٬٠٠٠ ر.س", "SAR 50,000+")}</option><option value="discuss">{t("أرغب في مناقشة الميزانية", "Let's discuss")}</option></select></label>
          <label className="form-field">{t("احكِ لنا عن فكرتك", "Tell us about your idea")} <span aria-hidden="true">*</span><textarea name="message" rows={3} required minLength={10} maxLength={4000} placeholder={t("ما الذي تطمح إليه؟ وما الذي يجعل مشروعك مختلفًا؟", "What are you hoping to achieve? What makes your project different?")} /></label>
          <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="consent-field"><input type="checkbox" name="consent" required /><span>{t("أوافق على استخدام بياناتي للتواصل معي بخصوص هذا الطلب فقط.", "I agree to the use of my information to contact me about this request.")}</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary form-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? t("جارٍ إرسال فكرتك...", "Sending your idea...") : t("أرسل فكرتك", "Send your idea")}<Icon name={status === "loading" ? "loader" : "arrow-up-left"} className={status === "loading" ? "spin" : ""} size={21} /></button>
          <p className="form-note"><Icon name="clock" size={14} />{t("نعود إليك خلال يومَي عمل. دون أي التزام.", "A reply within two business days. No commitment needed.")}</p>
        </form>
      </>}
    </Dialog>
  );
}
