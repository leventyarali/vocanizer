export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>
      
      <div className="prose prose-sm max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Bilgi Toplama ve Kullanımı</h2>
        <p>
          Vocanizer olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. Bu gizlilik politikası, hizmetlerimizi kullanırken toplanan, kullanılan ve korunan bilgileri açıklar.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Toplanan Bilgiler</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hesap bilgileri (e-posta, kullanıcı adı)</li>
          <li>Kullanım verileri ve istatistikler</li>
          <li>Cihaz ve tarayıcı bilgileri</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Bilgilerin Kullanımı</h2>
        <p>
          Toplanan bilgiler şu amaçlarla kullanılır:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hizmetlerimizi sunmak ve iyileştirmek</li>
          <li>Kullanıcı deneyimini kişiselleştirmek</li>
          <li>Güvenliği sağlamak</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Bilgi Güvenliği</h2>
        <p>
          Kullanıcı verilerini korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Veriler şifrelenerek saklanır ve düzenli olarak yedeklenir.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için support@vocanizer.com adresinden bize ulaşabilirsiniz.
        </p>

        <div className="mt-8 text-sm text-gray-500">
          Son güncelleme: 26 Ocak 2024
        </div>
      </div>
    </div>
  );
} 