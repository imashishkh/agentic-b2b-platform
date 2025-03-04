You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
code.tsx?v=1
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
}

interface FooterLink {
  name: string;
  Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: {
    name: string;
    description: string;
  };
  socialLinks: SocialLink[];
  columns: FooterColumn[];
  copyright?: string;
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, brand, socialLinks, columns, copyright, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pt-24", className)}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <a href="#" className="text-xl font-semibold">
                {brand.name}
              </a>
              <p className="text-sm text-foreground/60">
                {brand.description}
              </p>

              <p className="text-sm font-light text-foreground/55 mt-3.5">
                {socialLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <a
                      className="hover:text-foreground/90"
                      target="_blank"
                      href={link.href}
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                    {index < socialLinks.length - 1 && " • "}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="grid grid-cols-2 mt-16 md:grid-cols-3 lg:col-span-8 lg:justify-items-end lg:mt-0">
              {columns.map(({ title, links }) => (
                <div key={title} className="last:mt-12 md:last:mt-0">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {links.map(({ name, Icon, href }) => (
                      <li key={name}>
                        <a
                          href={href || "#"}
                          className="text-sm transition-all text-foreground/60 hover:text-foreground/90 group"
                        >
                          <Icon className="inline stroke-2 h-4 mr-1.5 transition-all stroke-foreground/60 group-hover:stroke-foreground/90" />
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {copyright && (
            <div className="mt-20 border-t pt-6 pb-8">
              <p className="text-xs text-foreground/55">{copyright}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Footer.displayName = "Footer";

code.demo.tsx?v=1
"use client";

import {
  Blocks,
  CodeXml,
  CreditCard,
  Handshake,
  Scale,
  Webhook,
} from "lucide-react";
import { Footer } from "@/components/blocks/footer";

const PlausibleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeWidth="2"
      d="M4 8.5V23c3 0 6-3 6-5.5h2.5c4 0 7.5-4 7.5-9 0-3-3-7.5-8-7.5S4 5.5 4 8.5Z"
    />
  </svg>
);

const MatomoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeMiterlimit="1.4"
      strokeWidth="2"
      d="m13.8 16.3.8.6v-.1l.2-.2a164.4 164.4 0 0 1 .6-.9l.9 1a4.1 4.1 0 0 0 5.3.4c1-.7 1.3-1.8 1.3-2.8 0-1-.5-2-1-2.8l-3-5A3 3 0 0 0 16 5c-.9 0-1.6.3-2 .5-.8.4-1.3 1-1.7 1.8l-1-1.1-.7.7.6-.7a5 5 0 0 0-3-1.3c-1.1 0-2.3.3-3 1.4L1.7 12a4.7 4.7 0 0 0-.7 3.1 4 4 0 0 0 1.2 2c1 .8 2.3.9 3.4.7 1-.2 2.3-.8 2.8-1.9l1 .8a3.6 3.6 0 0 0 3.5 1.2 3.8 3.8 0 0 0 1.5-.9l-.6-.7Zm0 0 .7.7v-.1l-.7-.6Z"
    />
  </svg>
);

const GoogleAnalyticsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M17 5.1v13.5c0 1.6 1 2.4 2 2.4s2-.7 2-2.4V5.2C21 4 20 3 19 3s-2 1-2 2.1Zm-7 7v6.6c0 1.5 1 2.3 2 2.3s2-.7 2-2.3v-6.5c0-1.3-1-2.2-2-2.2s-2 1-2 2.1Zm-3.6 8.3a2 2 0 1 0-2.8-2.8 2 2 0 0 0 2.8 2.8Z" />
  </svg>
);

export function FooterDemo() {
  return (
    <Footer
      className="mt-20"
      brand={{
        name: "webtics",
        description: "Track and monitor your website traffic.",
      }}
      socialLinks={[
        {
          name: "Twitter",
          href: "https://x.com/raymethula",
        },
        {
          name: "Github",
          href: "https://github.com/serafimcloud",
        },
        {
          name: "Discord",
          href: "#",
        },
      ]}
      columns={[
        {
          title: "Product",
          links: [
            {
              name: "Features",
              Icon: Blocks,
              href: "#features",
            },
            {
              name: "Pricing",
              Icon: CreditCard,
              href: "#pricing",
            },
            {
              name: "Integrations",
              Icon: Webhook,
              href: "#integrations",
            },
            {
              name: "API Documentation",
              Icon: CodeXml,
              href: "/docs/api",
            },
          ],
        },
        {
          title: "Compare",
          links: [
            {
              name: "Plausible",
              Icon: PlausibleIcon,
              href: "/compare/plausible",
            },
            {
              name: "Matomo",
              Icon: MatomoIcon,
              href: "/compare/matomo",
            },
            {
              name: "Google Analytics",
              Icon: GoogleAnalyticsIcon,
              href: "/compare/google-analytics",
            },
          ],
        },
        {
          title: "Legal",
          links: [
            {
              name: "Privacy Policy",
              Icon: Scale,
              href: "/legal/privacy",
            },
            {
              name: "Terms of Service",
              Icon: Handshake,
              href: "/legal/terms",
            },
          ],
        },
      ]}
      copyright="webtics Inc. © 2024"
    />
  );
}
```

Copy-paste these files for dependencies:
```tsx
/components/blocks/footer.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
}

interface FooterLink {
  name: string;
  Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: {
    name: string;
    description: string;
  };
  socialLinks: SocialLink[];
  columns: FooterColumn[];
  copyright?: string;
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, brand, socialLinks, columns, copyright, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pt-24", className)}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <a href="#" className="text-xl font-semibold">
                {brand.name}
              </a>
              <p className="text-sm text-foreground/60">
                {brand.description}
              </p>

              <p className="text-sm font-light text-foreground/55 mt-3.5">
                {socialLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <a
                      className="hover:text-foreground/90"
                      target="_blank"
                      href={link.href}
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                    {index < socialLinks.length - 1 && " • "}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="grid grid-cols-2 mt-16 md:grid-cols-3 lg:col-span-8 lg:justify-items-end lg:mt-0">
              {columns.map(({ title, links }) => (
                <div key={title} className="last:mt-12 md:last:mt-0">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {links.map(({ name, Icon, href }) => (
                      <li key={name}>
                        <a
                          href={href || "#"}
                          className="text-sm transition-all text-foreground/60 hover:text-foreground/90 group"
                        >
                          <Icon className="inline stroke-2 h-4 mr-1.5 transition-all stroke-foreground/60 group-hover:stroke-foreground/90" />
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {copyright && (
            <div className="mt-20 border-t pt-6 pb-8">
              <p className="text-xs text-foreground/55">{copyright}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Footer.displayName = "Footer";
```

Install NPM dependencies:
```bash
lucide-react
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.