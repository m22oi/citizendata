import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Camera, MapPin } from "lucide-react";

export interface MarineRecord {
  id: string;
  species: string;
  category: string;
  location: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  observerName: string;
}

interface RecordFormProps {
  onSubmit: (record: Omit<MarineRecord, "id">) => void;
  onCancel: () => void;
}

const marineCategories = [
  { value: "fish", label: "어류 (Fish)" },
  { value: "mammal", label: "해양 포유류 (Marine Mammals)" },
  { value: "turtle", label: "바다거북 (Sea Turtles)" },
  { value: "coral", label: "산호 (Coral)" },
  { value: "jellyfish", label: "해파리 (Jellyfish)" },
  { value: "crab", label: "게/갑각류 (Crabs/Crustaceans)" },
  { value: "mollusk", label: "연체동물 (Mollusks)" },
  { value: "other", label: "기타 (Other)" },
];

const exampleImages = [
  "https://images.unsplash.com/photo-1698699653773-6dae6267c3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjB0dXJ0bGUlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2NTgwNDI5OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1511220413245-032551094262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2xwaGluJTIwb2NlYW58ZW58MXx8fHwxNzY1ODYwMjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1595503240812-7286dafaddc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjBmaXNofGVufDF8fHx8MTc2NTc3ODIzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
];

export function RecordForm({ onSubmit, onCancel }: RecordFormProps) {
  const [species, setSpecies] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [observerName, setObserverName] = useState("");
  const [selectedImage, setSelectedImage] = useState(exampleImages[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const record: Omit<MarineRecord, "id"> = {
      species,
      category,
      location,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].slice(0, 5),
      description,
      imageUrl: selectedImage,
      observerName,
    };
    
    onSubmit(record);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="mb-4">바다 생물 관찰 기록</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observerName">관찰자 이름</Label>
              <Input
                id="observerName"
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">생물 종명</Label>
              <Input
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="예: 돌고래, 바다거북 등"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">분류</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="생물 분류를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {marineCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="inline-block w-4 h-4 mr-1" />
                위치
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 제주도 성산포 해안"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                <Camera className="inline-block w-4 h-4 mr-1" />
                사진 선택 (예시)
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {exampleImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`예시 ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">관찰 내용</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="관찰한 내용, 행동, 개체 수 등을 자세히 기록해주세요"
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">
            기록 저장
          </Button>
        </div>
      </form>
    </Card>
  );
}
