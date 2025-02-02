export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kullanım Şartları</h1>
      
      <div className="prose prose-sm max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Hizmet Kullanımı</h2>
        <p>
          Vocanizer'ı kullanarak bu şartları kabul etmiş olursunuz. Hizmetlerimizi yasal ve etik kurallara uygun şekilde kullanmayı taahhüt edersiniz.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Hesap Güvenliği</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz</li>
          <li>Şüpheli aktivite durumunda bizi bilgilendirmelisiniz</li>
          <li>Hesabınızı başkalarıyla paylaşmamalısınız</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. İçerik Politikası</h2>
        <p>
          Kullanıcılar tarafından oluşturulan içerikler:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Telif haklarına uygun olmalıdır</li>
          <li>Zararlı veya yasadışı olmamalıdır</li>
          <li>Başkalarının haklarını ihlal etmemelidir</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Hizmet Değişiklikleri</h2>
        <p>
          Vocanizer, hizmetlerinde ve bu şartlarda değişiklik yapma hakkını saklı tutar. Önemli değişiklikler kullanıcılara bildirilir.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Sorumluluk Reddi</h2>
        <p>
          Hizmetlerimiz "olduğu gibi" sunulmaktadır. Kullanımdan doğabilecek sorunlardan kullanıcı sorumludur.
        </p>

        <div className="mt-8 text-sm text-gray-500">
          Son güncelleme: 26 Ocak 2024
        </div>
      </div>
    </div>
  );
} 