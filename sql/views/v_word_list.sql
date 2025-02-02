CREATE OR REPLACE VIEW v_word_list AS
SELECT DISTINCT ON (w.id)
  w.id as word_id,
  w.word,
  COALESCE(w.is_active, true) as is_active,
  COALESCE(w.is_public, true) as is_public,
  w.created_at,
  w.updated_at,
  wm.word_type_id,
  wt.name as word_type_name,
  wm.cefr_level,
  COALESCE('oxford_3000' = ANY(wm.word_lists), false) as is_oxford_3000,
  COALESCE('oxford_5000' = ANY(wm.word_lists), false) as is_oxford_5000,
  (
    SELECT d.content
    FROM word_meaning_definitions d
    WHERE d.meaning_id = wm.id
      AND d.definition_type = 'basic'
      AND d.language_id = (SELECT id FROM languages WHERE code = 'tr')
    LIMIT 1
  ) as definition_tr,
  (
    SELECT d.content
    FROM word_meaning_definitions d
    WHERE d.meaning_id = wm.id
      AND d.definition_type = 'basic'
      AND d.language_id = (SELECT id FROM languages WHERE code = 'en')
    LIMIT 1
  ) as definition_en
FROM words w
LEFT JOIN word_meanings wm ON w.id = wm.word_id AND wm.deleted_at IS NULL
LEFT JOIN word_types wt ON wm.word_type_id = wt.id
WHERE w.deleted_at IS NULL
ORDER BY w.id, wm.created_at DESC; 