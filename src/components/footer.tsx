import { profile } from "@/lib/profile";
import { OutArrow } from "./icons";
export function Footer() {
  return (
    <footer className="wrap footer">
      <p>© {new Date().getFullYear()} Bryan Chang</p>
      <p>Built with intention. Based in Singapore.</p>
      <a href={profile.linkedin} target="_blank" rel="noreferrer">
        LinkedIn <OutArrow size={14} />
      </a>
    </footer>
  );
}
