import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import caveIcon from "../assets/cave-svg.svg?react";

export default function CaveLink() {
  const { profile } = useProfile();
  return (
    <Link
      to={profile?.username ? `/blog/user/${profile.username}` : "/blog"}
      className="cave-link"
      aria-label="Ir al blog"
    >
      <img src={caveIcon} alt="Icono de cueva" width={48} height={48} />
    </Link>
  );
}