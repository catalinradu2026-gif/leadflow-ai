'use client'

const APK_URL = 'https://nido-server-production.up.railway.app/download/nido.apk'

export default function InstallButton({ label = 'Instalează Nido' }: { label?: string }) {
  return (
    <a
      href={APK_URL}
      className="nido-install group relative inline-flex items-center gap-3 select-none"
      aria-label="Instalează aplicația Nido (APK Android)"
    >
      <span className="text-2xl leading-none transition-transform duration-200 group-hover:-translate-y-0.5">⬇️</span>
      <span className="text-lg md:text-xl font-extrabold tracking-tight">{label}</span>

      <style jsx>{`
        .nido-install {
          padding: 18px 38px;
          border-radius: 18px;
          color: #04263b;
          background: linear-gradient(135deg, #67e8f9 0%, #22d3ee 38%, #3b82f6 100%);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.55) inset,
            0 -6px 14px rgba(2, 30, 60, 0.28) inset,
            0 14px 0 -2px #1d4ed8,
            0 22px 38px -8px rgba(34, 211, 238, 0.55);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          will-change: transform;
        }
        .nido-install:hover {
          transform: translateY(-3px);
          filter: brightness(1.04);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.6) inset,
            0 -6px 14px rgba(2, 30, 60, 0.28) inset,
            0 18px 0 -2px #1d4ed8,
            0 30px 46px -8px rgba(34, 211, 238, 0.65);
        }
        .nido-install:active {
          transform: translateY(7px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.5) inset,
            0 -4px 10px rgba(2, 30, 60, 0.3) inset,
            0 6px 0 -2px #1d4ed8,
            0 10px 20px -8px rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </a>
  )
}
