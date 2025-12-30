import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import type { MarineRecord } from "./RecordForm";

interface RecordDetailProps {
  record: MarineRecord | null;
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  fish: "어류",
  mammal: "해양 포유류",
  turtle: "바다거북",
  coral: "산호",
  jellyfish: "해파리",
  crab: "게/갑각류",
  mollusk: "연체동물",
  other: "기타",
};

export function RecordDetail({ record, open, onClose }: RecordDetailProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record.species}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={record.imageUrl}
              alt={record.species}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{categoryLabels[record.category]}</Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">관찰자:</span>
              <span>{record.observerName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">위치:</span>
              <span>{record.location}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">날짜:</span>
                <span>{record.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">시간:</span>
                <span>{record.time}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm">관찰 내용</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {record.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
