"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VideoFiltersProps {
  onChange: (filters: VideoFilters) => void;
  filters: VideoFilters;
  isLoading?: boolean;
}

export interface VideoFilters {
  channelTitle?: string;
  publishedAfter?: string;
  minViewCount?: number;
  duration?: string;
  hasCaption?: boolean;
  isHD?: boolean;
}

export function VideoFilters({ onChange, filters, isLoading }: VideoFiltersProps) {
  if (isLoading) {
    return <FiltersSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Kanal Adı</Label>
        <Input
          placeholder="Kanal adı ile ara..."
          value={filters.channelTitle || ''}
          onChange={(e) => onChange({ ...filters, channelTitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Tarih</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.publishedAfter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.publishedAfter ? (
                format(new Date(filters.publishedAfter), "PPP", { locale: tr })
              ) : (
                "Tarih Seçin"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.publishedAfter ? new Date(filters.publishedAfter) : undefined}
              onSelect={(date) => onChange({ 
                ...filters, 
                publishedAfter: date ? date.toISOString() : undefined 
              })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Minimum İzlenme</Label>
        <Select
          value={filters.minViewCount?.toString() || ''}
          onValueChange={(value) => onChange({ ...filters, minViewCount: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1.000+</SelectItem>
            <SelectItem value="10000">10.000+</SelectItem>
            <SelectItem value="100000">100.000+</SelectItem>
            <SelectItem value="1000000">1.000.000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Video Süresi</Label>
        <Select
          value={filters.duration || ''}
          onValueChange={(value) => onChange({ ...filters, duration: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Kısa (&lt; 4 dakika)</SelectItem>
            <SelectItem value="medium">Orta (4-20 dakika)</SelectItem>
            <SelectItem value="long">Uzun (&gt; 20 dakika)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="cc"
          checked={filters.hasCaption}
          onCheckedChange={(checked) => onChange({ ...filters, hasCaption: checked })}
        />
        <Label htmlFor="cc">Altyazılı Videolar</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hd"
          checked={filters.isHD}
          onCheckedChange={(checked) => onChange({ ...filters, isHD: checked })}
        />
        <Label htmlFor="hd">HD Kalite</Label>
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}