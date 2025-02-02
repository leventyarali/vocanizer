# Kelime Yönetimi Dokümantasyonu

## Kelime Yönetimi Tip Kuralları

### Frontend-Backend Tip Yönetimi

1. **View ve Frontend Tip Dönüşümü**
   - Database view'larında `word_id` kullanılır
   - Frontend'de her zaman `id` kullanılır
   - View'dan gelen veriler `viewToWord` fonksiyonu ile dönüştürülür

2. **Tip Tanımları**
   ```typescript
   // View'dan gelen tip (database view yapısı)
   interface WordView {
     word_id: string;
     // ... diğer view alanları
   }

   // Frontend'de kullanılan tip
   interface Word {
     id: string;  // word_id buraya dönüşür
     // ... diğer alanlar
   }
   ```

3. **Dönüşüm Fonksiyonu**
   ```typescript
   function viewToWord(view: WordView): Word {
     return {
       id: view.word_id,
       // ... diğer alanların dönüşümü
     }
   }
   ```

4. **API Katmanı**
   - View'lara göre sorgu yazılır (`word_id` kullanılır)
   - Response'lar frontend tipine dönüştürülür (`id` kullanılır)

5. **Frontend Kullanımı**
   - Komponentlerde sadece `Word` tipi kullanılır
   - URL'lerde ve referanslarda `id` kullanılır

## Dizin Yapısı ve Mimari

### Sayfalar (Pages)
- `/app/admin/content/words/page.tsx` - Kelime listesi sayfası
  - Tüm kelimelerin listelendiği ana sayfa
  - Filtreleme ve sıralama özellikleri
  - Her kelime için detay ve düzenleme linkleri

- `/app/admin/content/words/[wordId]/page.tsx` - Kelime detay sayfası
  - Kelimenin tüm detaylarını gösteren sayfa
  - Anlamlar, tanımlar ve ilişkili içerikler
  - Düzenleme ve silme işlemleri

- `/app/admin/content/words/[wordId]/edit/page.tsx` - Kelime düzenleme sayfası
  - Kelime bilgilerini güncelleme formu
  - Anlam ekleme/düzenleme/silme
  - İlişkili içerik yönetimi

### Bileşenler (Components)
- `/components/content/words/word-detail.tsx`
  - Kelime detaylarını gösteren ana bileşen
  - Tüm alt bileşenleri organize eder
  - Düzenleme ve silme işlemlerini yönetir

- `/components/content/words/word-form.tsx`
  - Kelime ekleme/düzenleme formu
  - Form validasyonu ve hata yönetimi
  - API entegrasyonu

- `/components/content/words/forms/base-word-form.tsx`
  - Temel kelime bilgileri formu (kelime, tür, seviye)
  - Aktiflik ve görünürlük ayarları

- `/components/content/words/forms/word-type-form.tsx`
  - Kelime tipi seçimi ve yönetimi
  - Tip bazlı özel alanlar

- `/components/content/words/forms/word-meaning-form.tsx`
  - Anlam ekleme/düzenleme formu
  - Tanımlar ve örnekler yönetimi

### Kütüphane (Library)
- `/lib/api/words.ts`
  - Kelime CRUD işlemleri
  - Supabase entegrasyonu
  - Tip güvenliği

- `/lib/api/word-types.ts`
  - Kelime tipleri yönetimi
  - Tip bazlı validasyonlar

- `/lib/types/word.ts`
  - TypeScript tip tanımlamaları
  - Form ve API tipleri

## Veritabanı Yapısı ve İlişkiler

### Ana Tablolar

1. **words**
   ```sql
   CREATE TABLE words (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     word TEXT NOT NULL,
     language_id UUID NOT NULL REFERENCES languages(id),
     is_active BOOLEAN DEFAULT true,
     is_public BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ,
     deleted_at TIMESTAMPTZ
   );
   ```

2. **word_meanings**
   ```sql
   CREATE TABLE word_meanings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     word_id UUID NOT NULL REFERENCES words(id),
     word_type_id UUID NOT NULL REFERENCES word_types(id),
     cefr_level cefr_level DEFAULT 'A1',
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ
   );
   ```

3. **word_meaning_definitions**
   ```sql
   CREATE TABLE word_meaning_definitions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     meaning_id UUID NOT NULL REFERENCES word_meanings(id),
     language_id UUID NOT NULL REFERENCES languages(id),
     definition_type definition_type NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ
   );
   ```

## Kelime Girişi Rehberi

### 1. Basit Kelime Girişi
```sql
-- 1. Kelime ekleme
INSERT INTO words (word, language_id)
VALUES ('run', '2201c7e1-50db-4711-af5a-c0fc254b6c39')
RETURNING id;

-- 2. Temel anlam ekleme
INSERT INTO word_meanings (word_id, word_type_id, cefr_level)
VALUES ('yeni-kelime-id', 'verb-type-id', 'B1')
RETURNING id;

-- 3. Tanımları güncelleme
UPDATE word_meaning_definitions
SET content = 'to move at a speed faster than walking'
WHERE meaning_id = 'yeni-anlam-id'
AND language_id = '2201c7e1-50db-4711-af5a-c0fc254b6c39'
AND definition_type = 'basic';

UPDATE word_meaning_definitions
SET content = 'koşmak'
WHERE meaning_id = 'yeni-anlam-id'
AND language_id = 'b7f9a8e2-12cd-4c34-bf3a-a1d4e5c6f789'
AND definition_type = 'translation';
```

### 2. Detaylı Kelime Girişi (run - verb)
```sql
-- 1. Kelime ekleme
WITH inserted_word AS (
  INSERT INTO words (word, language_id)
  VALUES ('run', '2201c7e1-50db-4711-af5a-c0fc254b6c39')
  RETURNING id
),
inserted_meaning AS (
  INSERT INTO word_meanings (
    word_id,
    word_type_id,
    cefr_level
  )
  SELECT 
    inserted_word.id,
    'verb-type-id',
    'B1'
  FROM inserted_word
  RETURNING id
)
INSERT INTO word_meaning_definitions (
  meaning_id,
  language_id,
  definition_type,
  content
)
SELECT
  inserted_meaning.id,
  l.id,
  dt.type,
  CASE 
    WHEN l.code = 'en' AND dt.type = 'basic' THEN 'to move at a speed faster than walking'
    WHEN l.code = 'en' AND dt.type = 'detailed' THEN 'to move swiftly on foot so that both feet leave the ground during each stride'
    WHEN l.code = 'tr' AND dt.type = 'translation' THEN 'koşmak'
  END
FROM inserted_meaning
CROSS JOIN (VALUES 
  ('en', 'basic'),
  ('en', 'detailed'),
  ('tr', 'translation')
) AS dt(code, type)
JOIN languages l ON l.code = dt.code
WHERE CASE 
  WHEN l.code = 'en' AND dt.type = 'basic' THEN true
  WHEN l.code = 'en' AND dt.type = 'detailed' THEN true
  WHEN l.code = 'tr' AND dt.type = 'translation' THEN true
  ELSE false
END;
```

### 3. Kelime İlişkileri Ekleme (run - verb)
```sql
-- Eş anlamlılar
INSERT INTO word_relations (
  source_meaning_id,
  target_meaning_id,
  relation_type
)
VALUES 
  ('run-meaning-id', 'sprint-meaning-id', 'synonym'),
  ('run-meaning-id', 'jog-meaning-id', 'synonym');

-- Zıt anlamlılar
INSERT INTO word_relations (
  source_meaning_id,
  target_meaning_id,
  relation_type
)
VALUES 
  ('run-meaning-id', 'walk-meaning-id', 'antonym'),
  ('run-meaning-id', 'stop-meaning-id', 'antonym');

-- Kelime ailesi
INSERT INTO word_relations (
  source_meaning_id,
  target_meaning_id,
  relation_type
)
VALUES 
  ('run-meaning-id', 'runner-meaning-id', 'derivative'),
  ('run-meaning-id', 'running-meaning-id', 'derivative');
```

## Kelime Detay Sayfası Tasarım Önerileri

### 1. Tab Yapısı (Önerilen)
```
[Temel Bilgiler] [Anlamlar] [İlişkiler] [Medya] [Geçmiş]
```

Avantajları:
- Bilgiler kategorize edilmiş ve düzenli
- Her sekme kendi içinde detaylı bilgi gösterebilir
- Kullanıcı istediği bilgiye hızlıca ulaşabilir
- Mobil uyumlu ve responsive

### 2. Tek Sayfa Görünümü
```
+------------------------+
| Temel Bilgiler        |
+------------------------+
| Anlamlar ve Tanımlar  |
+------------------------+
| İlişkili Kelimeler    |
+------------------------+
| Medya İçerikleri      |
+------------------------+
| Değişiklik Geçmişi    |
+------------------------+
```

Avantajları:
- Tüm bilgiler tek bakışta görülebilir
- Yazdırma ve raporlama için uygun
- Scroll ile kolay navigasyon

### Önerilen Yaklaşım: Hibrit Tasarım

1. **Üst Bölüm (Sabit)**
   - Kelime ve temel bilgiler
   - Hızlı eylemler (düzenle, sil, vb.)
   - Durum rozetleri

2. **Ana Bölüm (Tabbed)**
   - **Anlamlar Tab'ı**
     - Her anlam için kart tasarımı
     - Tanımlar ve örnekler
     - Anlam bazlı aksiyonlar
   
   - **İlişkiler Tab'ı**
     - Eş/Zıt anlamlılar
     - Kelime ailesi
     - İlişki grafikleri
   
   - **Medya Tab'ı**
     - Görseller
     - Ses kayıtları
     - Örnek videolar
   
   - **Geçmiş Tab'ı**
     - Değişiklik logları
     - İstatistikler
     - Kullanım verileri

3. **Alt Bölüm (Sabit)**
   - Meta bilgiler
   - Son güncelleme
   - Hızlı linkler

Bu tasarım:
- Bilgileri organize eder
- Kullanıcı deneyimini iyileştirir
- Gelecek geliştirmelere açıktır
- Mobil uyumludur
- Admin ihtiyaçlarını karşılar