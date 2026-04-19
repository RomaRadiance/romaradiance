import { PublicSiteHeader } from "@/components/public-site/public-site-header";
import { WhatsAppLink } from "@/components/public-site/whatsapp-link";
import {
  buildContactDetails,
  getLocalizedOffering,
  getLocalizedSiteContent,
  getStaticMarketingContent,
} from "@/lib/public-site-content";
import type { Locale, Offering, SiteContent, SiteSettings } from "@/lib/types";

type AboutShellProps = {
  locale: Locale;
  pathname: string;
  content: SiteContent;
  settings: SiteSettings;
  offerings: Offering[];
};

export function AboutShell({ locale, pathname, content, settings, offerings }: AboutShellProps) {
  const staticContent = getStaticMarketingContent(locale);
  const editable = getLocalizedSiteContent(locale, content);
  const contactDetails = buildContactDetails(locale, settings);

  return (
    <div className="poster-page">
      <PublicSiteHeader
        locale={locale}
        pathname={pathname}
        localeLabel={staticContent.localeLabel}
        switcherLabel={staticContent.switcherLabel}
        announcement={staticContent.aboutEyebrow}
        links={[
          ...staticContent.nav.map((item) => ({ href: `/${locale}${item.href}`, label: item.label })),
          { href: `/${locale}/about`, label: locale === "hi" ? "परिचय / संपर्क" : "About / Contact" },
        ]}
      />

      <main className="poster-main">
        <section className="section-shell">
          <div className="section-heading">
            <span className="eyebrow-chip">{staticContent.aboutTitle}</span>
            <h1 className="section-title">{editable.aboutIntro}</h1>
            <p className="section-copy">{editable.teachingStyle}</p>
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <span className="eyebrow-chip">{staticContent.aboutTeachingTitle}</span>
            <h2 className="section-title">{locale === "hi" ? "कैसे पढ़ाया जाता है" : "How classes work"}</h2>
            <p className="section-copy">
              {locale === "hi"
                ? "Roma Tuition बच्चों को आसान समझ, नियमित अभ्यास और भरोसेमंद मार्गदर्शन के साथ व्यावहारिक classroom support देती है।"
                : "Roma Tuition combines clear concepts, regular practice, and caring guidance to support children with confidence."}
            </p>
          </div>

          <div className="card-grid review-grid">
            <article className="reason-card motif-paper">
              <h3>{locale === "hi" ? "शिक्षिका का परिचय" : "Teacher introduction"}</h3>
              <p>{editable.aboutIntro}</p>
            </article>
            <article className="reason-card motif-paper">
              <h3>{locale === "hi" ? "पढ़ाने का तरीका" : "Teaching approach"}</h3>
              <p>{editable.teachingStyle}</p>
            </article>
            <article className="reason-card motif-paper">
              <h3>{locale === "hi" ? "फ़ोन से तुरंत संपर्क" : "Phone-first contact"}</h3>
              <p>{editable.contactText}</p>
            </article>
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <span className="eyebrow-chip">{staticContent.aboutOfferingTitle}</span>
            <h2 className="section-title">{locale === "hi" ? "मुख्य कक्षा सारांश" : "Current class summary"}</h2>
          </div>
          <div className="card-grid offerings-grid">
            {offerings.map((item) => {
              const localized = getLocalizedOffering(locale, item);
              return (
                <article key={item.id} className="offer-card motif-paper">
                  <span className="ribbon">{localized.schedule}</span>
                  <h3>{localized.title}</h3>
                  <p>{localized.details}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="section-shell">
          <div className="section-heading">
            <span className="eyebrow-chip">{staticContent.contactEyebrow}</span>
            <h2 className="section-title">{editable.contactHeading}</h2>
            <p className="section-copy">{editable.contactText}</p>
          </div>
          <div className="contact-banner motif-board">
            <div className="contact-actions">
              <a href={`tel:+91${settings.phone}`} className="cta-button cta-primary">
                {locale === "hi" ? "अभी कॉल करें" : "Call now"}
              </a>
              <WhatsAppLink
                phone={settings.whatsapp || settings.phone}
                locale={locale}
                className="cta-button cta-secondary"
              >
                {locale === "hi" ? "WhatsApp पर बात करें" : "Chat on WhatsApp"}
              </WhatsAppLink>
            </div>
            <dl className="contact-details">
              {contactDetails.map((item) => (
                <div key={item.label} className="detail-card motif-paper">
                  <dt>{item.label}</dt>
                  <dd>
                    <a href={item.href}>{item.value}</a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{staticContent.footerNote}</p>
      </footer>
    </div>
  );
}
