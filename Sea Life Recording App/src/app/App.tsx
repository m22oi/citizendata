import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { RecordForm, type MarineRecord } from "./components/RecordForm";
import { RecordCard } from "./components/RecordCard";
import { RecordDetail } from "./components/RecordDetail";
import { Plus, Waves, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchRecords, createRecord } from "./services/api";

function App() {
  const [records, setRecords] = useState<MarineRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MarineRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Load records from server
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords();
      // Sort by creation date (newest first)
      const sorted = data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
      });
      setRecords(sorted);
    } catch (error) {
      console.error("Failed to load records:", error);
      toast.error("기록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (record: Omit<MarineRecord, "id">) => {
    try {
      const newRecord = await createRecord(record);
      setRecords([newRecord, ...records]);
      setShowForm(false);
      toast.success("새 관찰 기록이 저장되었습니다!");
    } catch (error) {
      console.error("Failed to create record:", error);
      toast.error("기록 저장에 실패했습니다");
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.observerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || record.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">바다 관찰 일지</h1>
                <p className="text-sm text-gray-600">시민 해양 생물 기록 플랫폼</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              새 기록 추가
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto">
            <RecordForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <Tabs defaultValue="grid" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="생물명, 위치, 관찰자로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2 sm:w-64">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="분류 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 보기</SelectItem>
                    <SelectItem value="fish">어류</SelectItem>
                    <SelectItem value="mammal">해양 포유류</SelectItem>
                    <SelectItem value="turtle">바다거북</SelectItem>
                    <SelectItem value="coral">산호</SelectItem>
                    <SelectItem value="jellyfish">해파리</SelectItem>
                    <SelectItem value="crab">게/갑각류</SelectItem>
                    <SelectItem value="mollusk">연체동물</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsList>
              <TabsTrigger value="grid">카드 보기</TabsTrigger>
              <TabsTrigger value="list">목록 보기</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Waves className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="mb-2">아직 기록이 없습니다</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterCategory !== "all" 
                      ? "검색 조건에 맞는 기록이 없습니다"
                      : "첫 번째 바다 생물 관찰을 기록해보세요!"}
                  </p>
                  {!searchQuery && filterCategory === "all" && (
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      첫 기록 시작하기
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecords.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      onClick={() => setSelectedRecord(record)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Waves className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="mb-2">아직 기록이 없습니다</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterCategory !== "all"
                      ? "검색 조건에 맞는 기록이 없습니다"
                      : "첫 번째 바다 생물 관찰을 기록해보세요!"}
                  </p>
                  {!searchQuery && filterCategory === "all" && (
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      첫 기록 시작하기
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={record.imageUrl}
                            alt={record.species}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="truncate">{record.species}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {record.date} {record.time}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="truncate">👤 {record.observerName}</p>
                            <p className="truncate">📍 {record.location}</p>
                            <p className="line-clamp-2">{record.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Statistics */}
        {!showForm && records.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-3xl mb-2">{records.length}</div>
              <div className="text-sm text-gray-600">총 기록 수</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-3xl mb-2">
                {new Set(records.map(r => r.category)).size}
              </div>
              <div className="text-sm text-gray-600">관찰된 생물 분류</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-3xl mb-2">
                {new Set(records.map(r => r.observerName)).size}
              </div>
              <div className="text-sm text-gray-600">참여 시민</div>
            </div>
          </div>
        )}
      </main>

      {/* Record Detail Modal */}
      <RecordDetail
        record={selectedRecord}
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}

export default App;