import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    category: string;
  }>;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { label: "Kutilmoqda", color: "yellow", icon: Package },
  confirmed: { label: "Tasdiqlangan", color: "blue", icon: CheckCircle },
  processing: { label: "Tayyorlanmoqda", color: "purple", icon: Package },
  shipped: { label: "Jo'natilgan", color: "orange", icon: Truck },
  delivered: { label: "Yetkazilgan", color: "green", icon: CheckCircle },
  cancelled: { label: "Bekor qilingan", color: "red", icon: XCircle },
};

export function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: ordersData = { orders: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['/api/admin/orders', selectedStatus],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }
      return fetch(`/api/admin/orders?${params}`, {
        headers: { 'Authorization': 'Bearer Gisobot201415*' }
      }).then(res => res.json());
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      apiRequest(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: { 
          'Authorization': 'Bearer Gisobot201415*',
          'Content-Type': 'application/json'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Muvaffaqiyat",
        description: "Buyurtma holati yangilandi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Holat yangilashda xatolik",
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    return Number(price).toLocaleString('uz-UZ') + ' so\'m';
  };

  const orders: Order[] = ordersData.orders || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Buyurtmalar boshqaruvi</h2>
          <p className="text-gray-600">Buyurtmalarni ko'rish va holat yangilash</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha buyurtmalar</SelectItem>
                <SelectItem value="pending">Kutilmoqda</SelectItem>
                <SelectItem value="confirmed">Tasdiqlangan</SelectItem>
                <SelectItem value="processing">Tayyorlanmoqda</SelectItem>
                <SelectItem value="shipped">Jo'natilgan</SelectItem>
                <SelectItem value="delivered">Yetkazilgan</SelectItem>
                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Buyurtmalar ({ordersData.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yuklanmoqda...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Hech qanday buyurtma topilmadi
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo?.icon || Package;
                  
                  return (
                    <Card key={order.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">#{order.orderNumber}</h3>
                              <Badge variant={statusInfo?.color === 'green' ? 'default' : 'secondary'}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo?.label || order.status}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Mijoz:</strong> {order.customerName}</p>
                              <p><strong>Telefon:</strong> {order.customerPhone}</p>
                              <p><strong>Manzil:</strong> {order.customerAddress}</p>
                              <p><strong>Mahsulotlar:</strong> {order.items.length} ta</p>
                              <p><strong>Jami:</strong> {formatPrice(order.totalAmount)}</p>
                              <p><strong>Sana:</strong> {formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Kutilmoqda</SelectItem>
                                <SelectItem value="confirmed">Tasdiqlangan</SelectItem>
                                <SelectItem value="processing">Tayyorlanmoqda</SelectItem>
                                <SelectItem value="shipped">Jo'natilgan</SelectItem>
                                <SelectItem value="delivered">Yetkazilgan</SelectItem>
                                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Tafsilotlar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Buyurtma tafsilotlari - #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Mijoz ma'lumotlari</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Ism:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Telefon:</strong> {selectedOrder.customerPhone}</p>
                  {selectedOrder.customerEmail && (
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  )}
                  <p><strong>Manzil:</strong> {selectedOrder.customerAddress}</p>
                  {selectedOrder.notes && (
                    <p><strong>Izoh:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Buyurtma mahsulotlari</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Kategoriya: {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-600">Miqdor: {item.quantity} ta</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Jami summa:</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Buyurtma tarixi</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Yaratilgan:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Oxirgi yangilanish:</strong> {formatDate(selectedOrder.updatedAt)}</p>
                  <div className="flex items-center gap-2">
                    <strong>Joriy holat:</strong>
                    <Badge>
                      {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}