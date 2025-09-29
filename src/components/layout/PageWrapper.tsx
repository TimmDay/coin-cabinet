"use client";

import { Breadcrumb } from "~/components/ui/Breadcrumb";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb - positioned under header, above page content */}
      <div className="flex w-full justify-center pt-12 pb-2">
        <Breadcrumb />
      </div>

      {/* Main page content */}
      <main className="container mx-auto px-6 pb-8">{children}</main>
    </div>
  );
}
