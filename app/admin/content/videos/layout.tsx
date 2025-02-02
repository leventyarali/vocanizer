// app/admin/content/videos/layout.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function VideoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav className="bg-gray-100 p-4 mb-6">
        <div className="flex space-x-4">
          <Link
            href="/admin/content/videos/list"
            className="hover:text-blue-600"
          >
            Videolar
          </Link>
          <Link
            href="/admin/content/videos/create"
            className="hover:text-blue-600"
          >
            Yeni Video Ekle
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
}
