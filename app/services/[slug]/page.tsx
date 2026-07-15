"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

const DATA: Record<string, { title: string; description: string; img: string }> = {
  web: {
    title: "Web",
    description:
      "Modern websites and web apps designed for clarity, speed, and conversion — then developed to scale with your business.",
    img: "/service-web.png",
  },
  mobile: {
    title: "Mobile",
    description:
      "iOS and Android experiences that feel native, ship faster, and keep users coming back.",
    img: "/service-mobile.png",
  },
  saas: {
    title: "SaaS",
    description:
      "Productized platforms with the foundations that matter — auth, billing, multi-tenant architecture, and a roadmap built to grow.",
    img: "/service-saas.png",
  },
  automation: {
    title: "Automation",
    description:
      "Workflows and integrations that remove busywork, connect your stack, and keep operations running without manual drag.",
    img: "/service-automation.png",
  },
};

export default function ServiceEmbedPage() {
  const { slug } = useParams();
  const key = Array.isArray(slug) ? slug[0] : slug;
  const [isTopWindow, setIsTopWindow] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setIsTopWindow(window.self === window.top);
    } catch {
      setIsTopWindow(false);
    }
  }, []);

  if (!key || !DATA[key]) {
    notFound();
  }
  const s = DATA[key];

  return (
    <main className="min-h-screen w-full overflow-auto bg-[#E6E2D6] p-6 text-[#111111] sm:p-8">
      {isTopWindow === true ? (
        <p className="mb-4 text-sm text-[#2A2A2A]/70">
          <Link href="/" className="text-[#55624A] hover:text-[#111111]">
            Home
          </Link>
        </p>
      ) : null}
      <div className="mb-6 overflow-hidden rounded-lg border border-[#111111]/15">
        <img src={s.img} alt="" className="h-40 w-full object-cover sm:h-48" />
      </div>
      <h1 className="text-2xl font-semibold sm:text-3xl">{s.title}</h1>
      <p className="mt-3 max-w-prose text-[#2A2A2A]">{s.description}</p>
    </main>
  );
}
