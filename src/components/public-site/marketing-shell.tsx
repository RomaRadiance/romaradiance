import Link from "next/link";

import { ReviewSubmissionForm } from "@/components/forms/review-submission-form";
import { PublicSiteHeader } from "@/components/public-site/public-site-header";
import { WhatsAppLink } from "@/components/public-site/whatsapp-link";
import { mapMarketingViewData } from "@/lib/public-site-content";
import type { Locale, PublicHomeData } from "@/lib/types";

type MarketingShellProps = {
  locale: Locale;
  pathname: string;
  data: PublicHomeData;
};

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  description?: string;
};

function SectionFrame({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="section-shell">
      <div className="section-heading">
        <span className="eyebrow-chip">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-copy">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function MarketingShell({ locale, pathname, data }: MarketingShellProps) {
  const content = mapMarketingViewData(data);

  return (
    <div className="poster-page">
      <PublicSiteHeader
        locale={locale}
        pathname={pathname}
        localeLabel={content.localeLabel}
        switcherLabel={content.switcherLabel}
        announcement={content.announcement}
        links={[
          ...content.nav.map((item) => ({ ...item, isAnchor: true })),
          { href: `/${locale}/about`, label: locale === "hi" ? "परिचय / संपर्क" : "About / Contact" },
        ]}
      />

      <main className="poster-main">
        <section className="hero-grid">
          <div className="hero-copy-card motif-paper">
            <span className="eyebrow-chip">{content.heroEyebrow}</span>
            <h1 className="hero-title">
              {content.editable.heroTitle} <span>{content.heroHighlight}</span>
            </h1>
            <p className="hero-copy">{content.editable.heroSubtitle}</p>

            <div className="hero-actions">
              <a href="#contact" className="cta-button cta-primary">
                {content.editable.heroPrimaryCtaLabel}
              </a>
              <a href="#offerings" className="cta-button cta-secondary">
                {content.editable.heroSecondaryCtaLabel}
              </a>
            </div>

            <dl className="stats-strip">
              {[
                {
                  label: locale === "hi" ? "फ़ोन-first support" : "Phone-first support",
                  value: data.settings.phone,
                },
                {
                  label: locale === "hi" ? "दो भाषाओं में मार्गदर्शन" : "Bilingual guidance",
                  value: "EN + HI",
                },
                {
                  label: locale === "hi" ? "Private parent gallery" : "Private parent gallery",
                  value: data.settings.galleryEnabled ? "Enabled" : "Locked",
                },
              ].map((stat) => (
                <div key={`${stat.label}-${stat.value}`} className="stat-bubble">
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hero-poster motif-board" aria-hidden="true">
            <div className="hero-poster-card hero-poster-card-main">
              <span className="poster-label">{content.heroPosterLabel}</span>
              <strong>{content.heroPosterTitle}</strong>
              <p>{content.heroPosterBody}</p>
            </div>
            <div className="hero-poster-card hero-poster-card-note">
              <span className="ribbon ribbon-blue">{content.heroPosterRibbon}</span>
              <span className="sticker sticker-star">★</span>
            </div>
            <div className="motif-row">
              {content.heroFeatureCards.map((feature) => (
                <article key={feature.title} className="feature-mini-card">
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionFrame
          id="offerings"
          eyebrow={content.offeringsEyebrow}
          title={content.offeringsTitle}
          description={content.offeringsDescription}
        >
          <div className="card-grid offerings-grid">
            {content.offerings.map((item) => (
              <article key={item.id} className="offer-card motif-paper">
                <span className="ribbon">{item.schedule}</span>
                <h3>{item.title}</h3>
                <p>{item.details}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame id="why-us" eyebrow={content.reasonsEyebrow} title={content.reasonsTitle}>
          <div className="why-grid">
            {content.whyChoose.map((item, index) => (
              <article key={item.id} className="reason-card motif-paper">
                <span className="reason-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          id="reviews"
          eyebrow={content.reviewsEyebrow}
          title={content.reviewsTitle}
          description={content.reviewsDescription}
        >
          <div className="card-grid review-grid">
            {content.reviews.map((item) => (
              <blockquote key={item.id} className="review-card motif-paper">
                <p>“{item.reviewText}”</p>
                <footer>
                  <strong>{item.displayName}</strong>
                  <span>{locale === "hi" ? "Approved parent review" : "Approved parent review"}</span>
                </footer>
              </blockquote>
            ))}
          </div>

          <ReviewSubmissionForm
            locale={locale}
            labels={{
              eyebrow: content.reviewFormEyebrow,
              title: content.reviewFormTitle,
              description: content.reviewFormDescription,
              submit: content.reviewFormSubmit,
              parentName: content.reviewFormNameLabel,
              reviewText: content.reviewFormTextLabel,
            }}
          />
        </SectionFrame>

        <SectionFrame
          id="gallery"
          eyebrow={content.galleryEyebrow}
          title={content.editable.galleryTeaserTitle}
          description={content.editable.galleryTeaserText}
        >
          <div className="announcement-pill" style={{ marginBottom: "1.5rem" }}>
            <span className="spark-dot" aria-hidden="true" />
            {content.galleryLockedBadge}
          </div>

          <div className="gallery-grid">
            {content.galleryPreviewItems.map((item, index) => (
              <article key={item.title} className={`gallery-tile gallery-variant-${index + 1}`}>
                <div className="gallery-illustration" aria-hidden="true">
                  <span className="shape-circle" />
                  <span className="shape-ticket" />
                  <span className="shape-pencil" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="contact-banner motif-board" style={{ marginTop: "1.5rem" }}>
            <p className="section-copy">
              {data.settings.galleryEnabled ? content.galleryEnabledText : content.galleryDisabledText}
            </p>
            <div className="contact-actions">
              <Link href="/parent/login" className="cta-button cta-primary">
                {content.galleryParentCta}
              </Link>
            </div>
          </div>
        </SectionFrame>

        <SectionFrame
          id="contact"
          eyebrow={content.contactEyebrow}
          title={content.editable.contactHeading}
          description={content.editable.contactText}
        >
          <div className="contact-banner motif-board">
            <div className="contact-actions">
              <a href={`tel:+91${data.settings.phone}`} className="cta-button cta-primary">
                {content.editable.heroPrimaryCtaLabel}
              </a>
              <WhatsAppLink
                phone={data.settings.whatsapp || data.settings.phone}
                locale={locale}
                className="cta-button cta-secondary"
              >
                {locale === "hi" ? "WhatsApp पर बात करें" : "Chat on WhatsApp"}
              </WhatsAppLink>
            </div>

            <dl className="contact-details">
              {content.contactDetails.map((item) => (
                <div key={item.label} className="detail-card motif-paper">
                  <dt>{item.label}</dt>
                  <dd>
                    <a href={item.href}>{item.value}</a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </SectionFrame>
      </main>

      <footer className="site-footer">
        <p>{content.footerNote}</p>
      </footer>
    </div>
  );
}
