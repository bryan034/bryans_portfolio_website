import type { Metadata } from "next"; //import type means used for checking code, wo adding runtime functionality. imports next.js ts definition for page metadata
import { Header } from "@/components/header"; //@ shorthand for src
import { Footer } from "@/components/footer";
import "./globals.css";
export const metadata: Metadata = { //: Metadata checks that obj contains valid Next.js metadata fields. settings described to browsers and search engines
  icons: { icon: "/icon.svg" }, //files inside public accessible from website's root, so can start with /
  title: {
    default: "About Me",
    template: "%s — Bryan Chang", //%s replaced with child's title page
  },
  description: //defines default description used in page's metadata. search engine may use it as a search-result snippet (for SEO)
    "Bryan Chang is an SMU Information Systems undergraduate exploring applied AI, product development, and software engineering. Discover projects, skills, and experience.",
};
export default function RootLayout({ //export default lets next.js recognise it as this file's layout. RootLayout describes its role
  children, //page content that next.js passes into layout. braces extract children from the component's props object
}: Readonly<{ children: React.ReactNode }>) { //children: React.ReactNode allows content React can render, including elements, text, or other components
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
