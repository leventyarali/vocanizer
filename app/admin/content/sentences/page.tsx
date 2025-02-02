"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Sentence {
  id: number
  content: string
  language: string
  variant: string
  cefr: string
  tags: string[]
  words: string[]
}

export default function SentencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null)
  const [newSentence, setNewSentence] = useState<Sentence>({
    id: 0,
    content: "",
    language: "English",
    variant: "US",
    cefr: "A1",
    tags: [],
    words: []
  })

  // TODO: Bu veriler API'den gelecek
  const [sentences, setSentences] = useState<Sentence[]>([
    {
      id: 1,
      content: "The book is on the table.",
      language: "English",
      variant: "US",
      cefr: "A1",
      tags: ["Basic", "Present Simple"],
      words: ["book", "table"]
    },
    {
      id: 2,
      content: "She reads books every day.",
      language: "English",
      variant: "US",
      cefr: "A2",
      tags: ["Daily Routine", "Present Simple"],
      words: ["read", "book", "day"]
    },
  ])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredSentences = sentences.filter(sentence =>
    sentence.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSentences(prev => [...prev, { ...newSentence, id: prev.length + 1 }])
    setNewSentence({
      id: 0,
      content: "",
      language: "English",
      variant: "US",
      cefr: "A1",
      tags: [],
      words: []
    })
    setIsAddDialogOpen(false)
  }

  const handleEdit = () => {
    if (!editingSentence) return
    setSentences(prev =>
      prev.map(sentence => (sentence.id === editingSentence.id ? editingSentence : sentence))
    )
    setEditingSentence(null)
  }

  const handleDelete = (id: number) => {
    setSentences(prev => prev.filter(sentence => sentence.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cümle Yönetimi</h2>
          <p className="text-muted-foreground">
            Cümle ekleyebilir, düzenleyebilir ve silebilirsiniz.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Cümle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Cümle Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir cümle eklemek için aşağıdaki formu doldurun.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Cümle</Label>
                <Textarea
                  id="content"
                  value={newSentence.content}
                  onChange={e => setNewSentence(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cefr">CEFR Seviyesi</Label>
                <Select
                  value={newSentence.cefr}
                  onValueChange={value => setNewSentence(prev => ({ ...prev, cefr: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="CEFR Seviyesi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                <Input
                  id="tags"
                  value={newSentence.tags.join(", ")}
                  onChange={e => setNewSentence(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleAdd}>Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Cümle ara..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6">
        {filteredSentences.map((sentence) => (
          <Card key={sentence.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{sentence.content}</h3>
                  <p className="text-sm text-muted-foreground">
                    {sentence.language} ({sentence.variant}) - {sentence.cefr}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {sentence.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sentence.words.map((word) => (
                      <Badge key={word} variant="outline">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSentence(sentence)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cümle Düzenle</DialogTitle>
                      <DialogDescription>
                        Cümleyi düzenlemek için aşağıdaki formu kullanın.
                      </DialogDescription>
                    </DialogHeader>
                    {editingSentence && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-content">Cümle</Label>
                          <Textarea
                            id="edit-content"
                            value={editingSentence.content}
                            onChange={e =>
                              setEditingSentence(prev => prev ? ({
                                ...prev,
                                content: e.target.value,
                              }) : null)
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-cefr">CEFR Seviyesi</Label>
                          <Select
                            value={editingSentence.cefr}
                            onValueChange={value =>
                              setEditingSentence(prev => prev ? ({ ...prev, cefr: value }) : null)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="CEFR Seviyesi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {["A1", "A2", "B1", "B2", "C1", "C2"].map(
                                level => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-tags">Etiketler (virgülle ayırın)</Label>
                          <Input
                            id="edit-tags"
                            value={editingSentence.tags.join(", ")}
                            onChange={e =>
                              setEditingSentence(prev => prev ? ({
                                ...prev,
                                tags: e.target.value.split(",").map(t => t.trim()),
                              }) : null)
                            }
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditingSentence(null)}
                      >
                        İptal
                      </Button>
                      <Button onClick={handleEdit}>Kaydet</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu cümleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(sentence.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 