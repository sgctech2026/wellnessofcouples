import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PageLoader } from "@/components/desire/PageLoader";
import { EmailCapturePopup } from "@/components/desire/EmailCapturePopup";
import { META_PIXEL_ID, trackPageView } from "@/lib/meta-pixel";

import appCss from "../styles.css?url";

const META_PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please refresh the page or try again.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DESIRE, Natural Wellness Gummies for Filipino Couples" },
      {
        name: "description",
        content:
          "DESIRE is a natural wellness gummy crafted for Filipino couples. Editorial luxury meets clinical wellness.",
      },
      { name: "author", content: "DESIRE PH" },
      { property: "og:title", content: "DESIRE, Natural Wellness Gummies for Filipino Couples" },
      {
        property: "og:description",
        content:
          "DESIRE is a natural wellness gummy crafted for Filipino couples. Editorial luxury meets clinical wellness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "DESIRE, Natural Wellness Gummies for Filipino Couples" },
      { name: "twitter:description", content: "DESIRE is a natural wellness gummy crafted for Filipino couples. Editorial luxury meets clinical wellness." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a97c0970-7bd4-425e-9312-eb30a1bf99bf/id-preview-42d121f2--79aa44ae-f81a-4bcf-9515-07555c9d89e0.lovable.app-1783512042812.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a97c0970-7bd4-425e-9312-eb30a1bf99bf/id-preview-42d121f2--79aa44ae-f81a-4bcf-9515-07555c9d89e0.lovable.app-1783512042812.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap",
      },
      // Preconnect to Supabase storage for faster image/video loads
      {
        rel: "preconnect",
        href: "https://qmfzkvfxjheyhrweyshl.supabase.co",
      },
      // Preload hero product images
      {
        rel: "preload",
        as: "image",
        href: "https://qmfzkvfxjheyhrweyshl.supabase.co/storage/v1/object/public/Desire%209/Main%201%20(1).png",
        fetchPriority: "high",
      } as any,
      // Preload hero bottle images
      {
        rel: "preload",
        as: "image",
        href: "https://desirephilippines.b-cdn.net/HomePage/Desire%20Black.webp",
        fetchPriority: "high",
      } as any,
      {
        rel: "preload",
        as: "image",
        href: "https://desirephilippines.b-cdn.net/HomePage/her.webp",
        fetchPriority: "high",
      } as any,
      // Preload nav logos
      {
        rel: "preload",
        as: "image",
        href: "https://desirephilippines.b-cdn.net/HomePage/white.webp",
      },
      {
        rel: "preload",
        as: "image",
        href: "https://desirephilippines.b-cdn.net/HomePage/Asset%207.webp",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_SCRIPT }} />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RouteChangeTracker() {
  const router = useRouter();
  useEffect(() => {
    let cleanupSections: (() => void) | null = null;
    const run = async () => {
      const path = window.location.pathname;
      const a = await import("@/lib/analytics");
      a.trackVisit(path);
      a.startEngagementTimer(path);
      cleanupSections?.();
      cleanupSections = a.initSectionTracker(path);
    };
    // initial
    run();
    const unsub = router.subscribe("onResolved", () => {
      trackPageView();
      run();
    });
    return () => {
      unsub();
      cleanupSections?.();
      import("@/lib/analytics").then((a) => a.stopEngagementTimer()).catch(() => {});
    };
  }, [router]);
  return null;
}

function RootComponent() {
  return (
    <>
      <RouteChangeTracker />
      <PageLoader />
      <Outlet />
      <EmailCapturePopup />
      <Toaster position="top-center" />
    </>
  );
}
