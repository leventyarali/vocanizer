"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Word, WordMeaning } from '@/lib/types/word';
import { deleteWord, updateWordMeaning } from '@/lib/api/words';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import debounce from 'lodash/debounce';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Pencil, Trash, ChevronRight, ChevronDown, Save, X } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';

interface WordDetailProps {
  word: Word;
  canEdit?: boolean;
}

type EditableFields = keyof Pick<WordMeaning, 
  'definition_tr' | 'definition_en' | 
  'detailed_definition_tr' | 'detailed_definition_en' |
  'grammar_tr' | 'grammar_en' |
  'hint_tr' | 'hint_en'
>;

interface EditedValues {
  [meaningId: string]: Partial<WordMeaning>;
}

export function WordDetail({ word, canEdit }: WordDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMeanings, setExpandedMeanings] = useState<string[]>([]);
  const [editingFields, setEditingFields] = useState<Record<string, Set<EditableFields>>>({});
  const [editedValues, setEditedValues] = useState<EditedValues>({});

  // CEFR seviyesine göre sıralama
  const sortedMeanings = [...word.meanings].sort((a, b) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const aLevel = a.cefr_level || word.cefr_level;
    const bLevel = b.cefr_level || word.cefr_level;
    return levels.indexOf(aLevel) - levels.indexOf(bLevel);
  });

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteWord(word.id);
      toast.success('Kelime başarıyla silindi');
      router.push('/words');
      router.refresh();
    } catch (error) {
      console.error('Kelime silinirken hata oluştu:', error);
      toast.error('Kelime silinirken bir hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMeaning = (meaningId: string) => {
    setExpandedMeanings((prev) =>
      prev.includes(meaningId)
        ? prev.filter((id) => id !== meaningId)
        : [...prev, meaningId]
    );
  };

  const getCEFRColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-50 text-green-700',
      'A2': 'bg-emerald-50 text-emerald-700',
      'B1': 'bg-blue-50 text-blue-700',
      'B2': 'bg-indigo-50 text-indigo-700',
      'C1': 'bg-purple-50 text-purple-700',
      'C2': 'bg-pink-50 text-pink-700',
    };
    return colors[level] || 'bg-gray-50 text-gray-700';
  };

  const handleEdit = (meaningId: string, field: EditableFields, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [meaningId]: {
        ...prev[meaningId],
        [field]: value
      }
    }));
  };

  const handleSave = async (meaningId: string, field: EditableFields) => {
    try {
      const value = editedValues[meaningId]?.[field];
      if (value === undefined) return;

      const meaning = word.meanings.find(m => m.id === meaningId);
      if (!meaning) return;

      // API çağrısı
      const updateData: Partial<WordMeaning> = {
        [field]: value,
        word_id: meaning.word_id,
        word_type_name: meaning.word_type_name,
        cefr_level: meaning.cefr_level
      };

      await updateWordMeaning(meaningId, updateData);
      
      // Düzenleme modundan çık
      stopEditing(meaningId, field);
      
      // Değişiklikleri temizle
      setEditedValues(prev => {
        const newValues = { ...prev };
        if (newValues[meaningId]) {
          delete newValues[meaningId][field];
          if (Object.keys(newValues[meaningId]).length === 0) {
            delete newValues[meaningId];
          }
        }
        return newValues;
      });

      toast.success('Değişiklikler kaydedildi');
      router.refresh();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Değişiklikler kaydedilemedi');
    }
  };

  const handleCancel = (meaningId: string, field: EditableFields) => {
    // Düzenleme modundan çık ve değişiklikleri temizle
    stopEditing(meaningId, field);
    setEditedValues(prev => {
      const newValues = { ...prev };
      if (newValues[meaningId]) {
        delete newValues[meaningId][field];
        if (Object.keys(newValues[meaningId]).length === 0) {
          delete newValues[meaningId];
        }
      }
      return newValues;
    });
  };

  const startEditing = (meaningId: string, field: EditableFields) => {
    setEditingFields(prev => ({
      ...prev,
      [meaningId]: new Set([...(prev[meaningId] || []), field])
    }));
  };

  const stopEditing = (meaningId: string, field: EditableFields | '') => {
    if (field === '') {
      setEditingFields(prev => {
        const newFields = { ...prev };
        delete newFields[meaningId];
        return newFields;
      });
      return;
    }

    setEditingFields(prev => {
      const fields = prev[meaningId];
      if (fields) {
        fields.delete(field);
        if (fields.size === 0) {
          const newFields = { ...prev };
          delete newFields[meaningId];
          return newFields;
        }
        return { ...prev, [meaningId]: fields };
      }
      return prev;
    });
  };

  const renderEditableField = (meaningId: string, field: EditableFields, label: string, value: string | null) => {
    const isEditing = editingFields[meaningId]?.has(field);
    const editedValue = editedValues[meaningId]?.[field] ?? value;
    const hasChanges = editedValues[meaningId]?.[field] !== undefined;

    return (
      <div className={cn(
        "space-y-2 p-4 rounded-lg transition-all duration-200 group relative",
        hasChanges ? "border-2 border-primary/20 shadow-sm" : "bg-muted/50",
        isEditing ? "bg-muted/70 ring-2 ring-primary/10" : "hover:bg-muted/60"
      )}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          {canEdit && (
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleCancel(meaningId, field)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    İptal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                    onClick={() => handleSave(meaningId, field)}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Kaydet
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                  onClick={() => startEditing(meaningId, field)}
                >
                  <Pencil className="h-3 w-3" />
                  <span className="sr-only">Düzenle</span>
                </Button>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <Textarea
            className="min-h-[100px] mt-2 transition-colors focus-visible:ring-primary"
            value={editedValue || ''}
            onChange={(e) => handleEdit(meaningId, field, e.target.value)}
            placeholder={`${label} girin...`}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel(meaningId, field);
              }
            }}
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap pr-8 text-muted-foreground">{value || '-'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Üst Bölüm (Sabit) */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{word.word}</h2>
          </div>
          {canEdit && (
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDeleting}
                    title="Sil"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bu kelimeyi silmek istediğinize emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Kelime ve tüm tanımları kalıcı olarak
                      silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      {isDeleting ? 'Siliniyor...' : 'Sil'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Anlamlar Özeti */}
        <div className="mt-6 space-y-4">
          <div className="grid gap-3">
            {sortedMeanings.map((meaning, index) => (
              <Collapsible
                key={meaning.id}
                open={expandedMeanings.includes(meaning.id)}
                onOpenChange={() => toggleMeaning(meaning.id)}
              >
                <div className={cn(
                  "border rounded-lg transition-colors",
                  expandedMeanings.includes(meaning.id) && "bg-muted/30"
                )}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-normal">
                            {meaning.word_type_name || word.word_type_name}
                          </Badge>
                          <span className="text-sm">{meaning.definition_tr}</span>
                          <Badge className={cn("font-normal", getCEFRColor(meaning.cefr_level || word.cefr_level))}>
                            {meaning.cefr_level || word.cefr_level}
                          </Badge>
                        </div>
                      </div>
                      {expandedMeanings.includes(meaning.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-6 border-t space-y-8">
                      {/* İngilizce ve Türkçe Tanımlar */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* İngilizce Bölümü */}
                        <div className="space-y-6">
                          {renderEditableField(meaning.id, 'definition_en', 'İngilizce Temel Tanım', meaning.definition_en)}
                          {renderEditableField(meaning.id, 'detailed_definition_en', 'İngilizce Detaylı Tanım', meaning.detailed_definition_en)}
                          {renderEditableField(meaning.id, 'grammar_en', 'İngilizce Gramer Notları', meaning.grammar_en)}
                          {renderEditableField(meaning.id, 'hint_en', 'İngilizce İpucu', meaning.hint_en)}
                        </div>

                        {/* Türkçe Bölümü */}
                        <div className="space-y-6">
                          {renderEditableField(meaning.id, 'definition_tr', 'Türkçe Temel Tanım', meaning.definition_tr)}
                          {renderEditableField(meaning.id, 'detailed_definition_tr', 'Türkçe Detaylı Tanım', meaning.detailed_definition_tr)}
                          {renderEditableField(meaning.id, 'grammar_tr', 'Türkçe Gramer Notları', meaning.grammar_tr)}
                          {renderEditableField(meaning.id, 'hint_tr', 'Türkçe İpucu', meaning.hint_tr)}
                        </div>
                      </div>

                      {/* Kelime İlişkileri */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Kelime Listeleri</div>
                          <div className="flex flex-wrap gap-2">
                            {meaning.word_lists?.map((list) => (
                              <Badge key={list} variant="secondary" className="font-normal">
                                {list}
                              </Badge>
                            )) || '-'}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Kelime Ailesi</div>
                          <div className="flex flex-wrap gap-2">
                            {meaning.word_family?.map((word) => (
                              <Badge key={word} variant="secondary" className="font-normal">
                                {word}
                              </Badge>
                            )) || '-'}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Kelime Formları</div>
                          <div className="flex flex-wrap gap-2">
                            {meaning.word_forms?.map((form) => (
                              <Badge key={form} variant="secondary" className="font-normal">
                                {form}
                              </Badge>
                            )) || '-'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Eş Anlamlılar</div>
                          <div className="flex flex-wrap gap-2">
                            {meaning.synonyms?.map((word) => (
                              <Badge key={word} variant="secondary" className="font-normal">
                                {word}
                              </Badge>
                            )) || '-'}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Zıt Anlamlılar</div>
                          <div className="flex flex-wrap gap-2">
                            {meaning.antonyms?.map((word) => (
                              <Badge key={word} variant="secondary" className="font-normal">
                                {word}
                              </Badge>
                            )) || '-'}
                          </div>
                        </div>
                      </div>

                      {/* Admin İpuçları */}
                      {canEdit && (
                        <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                          <h4 className="text-sm font-medium text-yellow-800 mb-2">Admin Önerileri</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {!meaning.detailed_definition_en && <li>• İngilizce detaylı tanım ekleyin</li>}
                            {!meaning.detailed_definition_tr && <li>• Türkçe detaylı açıklama ekleyin</li>}
                            {!meaning.hint_en && <li>• İngilizce kullanım ipucu ekleyin</li>}
                            {!meaning.hint_tr && <li>• Türkçe kullanım ipucu ekleyin</li>}
                            {!meaning.grammar_en && <li>• İngilizce gramer notu ekleyin</li>}
                            {!meaning.grammar_tr && <li>• Türkçe gramer notu ekleyin</li>}
                            {!meaning.synonyms?.length && <li>• Eş anlamlı kelimeler ekleyin</li>}
                            {!meaning.antonyms?.length && <li>• Zıt anlamlı kelimeler ekleyin</li>}
                            {!meaning.word_lists?.length && <li>• Kelime listelerine ekleyin</li>}
                            {!meaning.word_family?.length && <li>• Kelime ailesini belirtin</li>}
                            {!meaning.word_forms?.length && <li>• Kelime formlarını ekleyin</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Bölüm (Sabit) */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Son güncelleme: {word.updated_at ? new Date(word.updated_at).toLocaleDateString('tr-TR') : '-'}</div>
          <div>ID: {word.id}</div>
        </div>
      </div>
    </div>
  );
}
