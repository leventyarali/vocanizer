'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAdmin(user?.user_metadata?.role === 'admin');
    };

    checkUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hesap Bilgileri</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Profil</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Son Giriş</p>
                  <p className="font-medium">
                    {new Date(user?.last_sign_in_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t">
                <h2 className="text-xl font-semibold mb-2">Yönetici Yetkileri</h2>
                <p className="text-sm text-muted-foreground">
                  Admin paneline erişim yetkiniz bulunmaktadır.
                </p>
                <a 
                  href="/admin" 
                  className="inline-block mt-2 text-primary hover:underline"
                >
                  Admin Paneline Git →
                </a>
              </div>
            )}

            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-2">Güvenlik</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Son giriş IP: {user?.last_sign_in_ip || 'Bilinmiyor'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hesap oluşturma: {new Date(user?.created_at).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 