import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { ComponentType, CSSProperties, SVGProps } from 'react';
import {
  landingDemoCards,
  landingDemoContact,
  landingDemoCv,
  landingDemoLanguages,
  landingDemoProject,
  landingDemoSkills,
} from '../landingDemoData';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

const icons: Array<ComponentType<SVGProps<SVGSVGElement>>> = [
  FolderOpenIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
];

function CapabilityPreview({ index }: { index: number }) {
  if (index === 0) {
    const technologies = landingDemoProject.technologies
      .split(';')
      .map((technology) => technology.trim())
      .slice(0, 3);

    return (
      <div className="possibility-real-project">
        <div className="possibility-real-project__image">
          <img
            src={landingDemoProject.images[0]?.imageUrl}
            alt=""
            loading="lazy"
          />
          <span>{landingDemoProject.status}</span>
        </div>
        <div>
          <strong>{landingDemoProject.name}</strong>
          <div className="possibility-chip-row">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="possibility-real-skills">
        {landingDemoSkills.map((skill) => (
          <span
            key={skill.id}
            style={{ '--skill-color': skill.skillColor } as CSSProperties}
          >
            <i /> {skill.skillName}
          </span>
        ))}
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="possibility-real-languages">
        {landingDemoLanguages.map((language) => (
          <div key={language.id}>
            <span>
              <strong>{language.language}</strong>
              <small>{language.level}</small>
            </span>
            <i>
              <b style={{ width: `${language.skillPercent}%` }} />
            </i>
          </div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className="possibility-real-blocks">
        <span className="possibility-real-blocks__card">
          {landingDemoCards[0].title}
        </span>
        <div>
          {['text', 'list', 'image', 'video', 'quote'].map((blockType) => (
            <span key={blockType}>{blockType}</span>
          ))}
        </div>
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className="possibility-real-contact">
        <span>
          <small>EMAIL</small>
          {landingDemoContact.publicEmail}
        </span>
        <span>
          <small>GITHUB</small>
          @{landingDemoContact.gitHub}
        </span>
        <span>
          <small>LINKEDIN</small>
          /{landingDemoContact.linkedIn}
        </span>
      </div>
    );
  }

  return (
    <div className="possibility-real-document">
      <DocumentTextIcon />
      <span>
        <strong>{landingDemoCv.name}</strong>
        <small>PDF · CV PRINCIPAL</small>
      </span>
    </div>
  );
}

export function PossibilitiesSection({
  content,
}: {
  content: LandingContent['possibilities'];
}) {
  return (
    <section id="possibilities" className="landing-section possibilities-section">
      <div className="landing-container">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="possibilities-grid">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal
                key={item.title}
                delay={(index % 3) * 0.07}
                className={`possibility-card possibility-card--${index + 1}`}
              >
                <article>
                  <div className="possibility-card__top">
                    <span>{item.detail}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <CapabilityPreview index={index} />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
