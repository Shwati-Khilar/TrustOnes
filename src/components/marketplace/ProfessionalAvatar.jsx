"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./talent.module.css";

export default function ProfessionalAvatar({name, image, large = false}) {
  const [unavailable, setUnavailable] = useState(null);
  const initials = name.trim().split(/\s+/u).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase();
  const usable = image && (image.startsWith("/") && !image.startsWith("//") || /^https?:\/\//i.test(image));
  return <span className={styles.avatar + (large ? " "+styles.largeAvatar : "")}>
    {usable && unavailable !== image
      ? <Image src={image} alt={name} width={120} height={120} unoptimized referrerPolicy="no-referrer" onError={() => setUnavailable(image)}/>
      : <span aria-hidden="true">{initials}</span>}
  </span>;
}
