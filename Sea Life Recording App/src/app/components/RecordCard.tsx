import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import type { MarineRecord } from "./RecordForm";

interface RecordCardProps {
  record: MarineRecord;
  onClick: () => void;
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

export function RecordCard({ record, onClick }: RecordCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={record.imageUrl}
          alt={record.species}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1">{record.species}</h3>
          <Badge variant="secondary">{categoryLabels[record.category]}</Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{record.observerName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{record.location}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{record.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{record.time}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2">
          {record.description}
        </p>
      </div>
    </Card>
  );
}
