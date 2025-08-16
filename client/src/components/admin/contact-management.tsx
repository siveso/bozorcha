import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, User, Calendar, Trash2, Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDateTime } from "@/lib/date-utils";
import { useLanguage } from "@/contexts/LanguageContext";

const ADMIN_TOKEN = "Bearer Gisobot201415*";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export function ContactManagement() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["/api/admin/contact-messages", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      
      const response = await fetch(`/api/admin/contact-messages?${params}`, {
        headers: { Authorization: ADMIN_TOKEN }
      });
      return await response.json();
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: ADMIN_TOKEN,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      toast({
        title: language === "ru" ? "Сообщение обновлено" : "Xabar yangilandi",
        description: language === "ru" ? "Сообщение успешно обновлено" : "Xabar muvaffaqiyatli yangilandi",
      });
    },
    onError: () => {
      toast({
        title: language === "ru" ? "Ошибка" : "Xatolik",
        description: language === "ru" ? "Не удалось обновить сообщение" : "Xabarni yangilab bo'lmadi",
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: ADMIN_TOKEN },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      toast({
        title: language === "ru" ? "Сообщение удалено" : "Xabar o'chirildi",
        description: language === "ru" ? "Сообщение успешно удалено" : "Xabar muvaffaqiyatli o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: language === "ru" ? "Ошибка" : "Xatolik",
        description: language === "ru" ? "Не удалось удалить сообщение" : "Xabarni o'chirib bo'lmadi",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (messageId: string, newStatus: string) => {
    updateMessageMutation.mutate({ id: messageId, status: newStatus });
  };

  const handleSaveNotes = () => {
    if (selectedMessage) {
      updateMessageMutation.mutate({ 
        id: selectedMessage.id, 
        adminNotes: adminNotes 
      });
      setSelectedMessage(null);
      setAdminNotes("");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: "destructive",
      read: "default",
      replied: "default"
    } as const;

    const labels = {
      unread: language === "ru" ? "Не прочитано" : "O'qilmagan",
      read: language === "ru" ? "Прочитано" : "O'qilgan", 
      replied: language === "ru" ? "Отвечено" : "Javob berilgan"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const messages = messagesData?.messages || [];
  const total = messagesData?.total || 0;

  const stats = {
    total,
    unread: messages.filter((m: ContactMessage) => m.status === "unread").length,
    read: messages.filter((m: ContactMessage) => m.status === "read").length,
    replied: messages.filter((m: ContactMessage) => m.status === "replied").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {language === "ru" ? "Управление сообщениями" : "Xabarlar boshqaruvi"}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "ru" ? "Всего" : "Jami"}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "ru" ? "Не прочитано" : "O'qilmagan"}
                </p>
                <p className="text-2xl font-bold text-red-500">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "ru" ? "Прочитано" : "O'qilgan"}
                </p>
                <p className="text-2xl font-bold text-blue-500">{stats.read}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "ru" ? "Отвечено" : "Javob berilgan"}
                </p>
                <p className="text-2xl font-bold text-green-500">{stats.replied}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "ru" ? "Фильтры" : "Filtrlar"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={language === "ru" ? "Статус" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ru" ? "Все" : "Barchasi"}</SelectItem>
                <SelectItem value="unread">{language === "ru" ? "Не прочитано" : "O'qilmagan"}</SelectItem>
                <SelectItem value="read">{language === "ru" ? "Прочитано" : "O'qilgan"}</SelectItem>
                <SelectItem value="replied">{language === "ru" ? "Отвечено" : "Javob berilgan"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "ru" ? "Сообщения" : "Xabarlar"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              {language === "ru" ? "Загрузка..." : "Yuklanmoqda..."}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "ru" ? "Сообщения не найдены" : "Xabarlar topilmadi"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "ru" ? "Отправитель" : "Yuboruvchi"}</TableHead>
                  <TableHead>{language === "ru" ? "Тема" : "Mavzu"}</TableHead>
                  <TableHead>{language === "ru" ? "Статус" : "Status"}</TableHead>
                  <TableHead>{language === "ru" ? "Дата" : "Sana"}</TableHead>
                  <TableHead>{language === "ru" ? "Действия" : "Amallar"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message: ContactMessage) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-muted-foreground">{message.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={message.subject}>
                        {message.subject}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>{formatDateTime(message.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedMessage(message);
                                setAdminNotes(message.adminNotes || "");
                                if (message.status === "unread") {
                                  handleStatusChange(message.id, "read");
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{language === "ru" ? "Детали сообщения" : "Xabar tafsilotlari"}</DialogTitle>
                              <DialogDescription>
                                {language === "ru" ? "Полная информация о сообщении" : "Xabar haqida to'liq ma'lumot"}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">{language === "ru" ? "Имя" : "Ism"}</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{language === "ru" ? "Тема" : "Mavzu"}</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.subject}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{language === "ru" ? "Сообщение" : "Xabar"}</label>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{language === "ru" ? "Статус" : "Status"}</label>
                                  <div className="mt-1">
                                    <Select 
                                      value={selectedMessage.status} 
                                      onValueChange={(value) => handleStatusChange(selectedMessage.id, value)}
                                    >
                                      <SelectTrigger className="w-[200px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="unread">{language === "ru" ? "Не прочитано" : "O'qilmagan"}</SelectItem>
                                        <SelectItem value="read">{language === "ru" ? "Прочитано" : "O'qilgan"}</SelectItem>
                                        <SelectItem value="replied">{language === "ru" ? "Отвечено" : "Javob berilgan"}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{language === "ru" ? "Заметки администратора" : "Admin eslatmalari"}</label>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder={language === "ru" ? "Добавить заметки..." : "Eslatma qo'shing..."}
                                    className="mt-1"
                                  />
                                  <Button onClick={handleSaveNotes} className="mt-2">
                                    {language === "ru" ? "Сохранить заметки" : "Eslatmalarni saqlash"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessageMutation.mutate(message.id)}
                          disabled={deleteMessageMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}