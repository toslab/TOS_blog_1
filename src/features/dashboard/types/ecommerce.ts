// 기존 타입에 추가

// 플랫폼 타입
export type SalesPlatform = 
  | 'shopify'
  | 'coupang'
  | 'naver'
  | 'gmarket'
  | 'auction'
  | '11st'
  | 'wemakeprice'
  | 'tmon'
  | 'instagram'
  | 'own_mall';

// 주문 타입 수정
export interface Order {
  id: string;
  platform: SalesPlatform;           // 판매 플랫폼
  platformOrderId: string;           // 플랫폼별 주문번호
  orderNumber: string;               // 통합 주문번호
  status: OrderStatus;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  
  // 운영 관련 필드
  shippingStatus: ShippingStatus;    // 배송 상태
  trackingNumber?: string;           // 송장번호
  shippingCarrier?: ShippingCarrier; // 택배사
  csStatus?: CSStatus;               // CS 상태
  tags?: string[];                   // 태그 (급배, VIP 등)
  memo?: string;                     // 내부 메모
  
  // 날짜
  orderedAt: string;                 // 주문일시
  paidAt?: string;                   // 결제일시
  shippedAt?: string;                // 발송일시
  deliveredAt?: string;              // 배송완료일시
  createdAt: string;
  updatedAt: string;
}

// 배송 관련 타입
export type ShippingStatus = 
  | 'pending'          // 배송 대기
  | 'preparing'        // 상품 준비중
  | 'ready'           // 발송 준비 완료
  | 'shipped'         // 발송 완료
  | 'in_transit'      // 배송중
  | 'delivered'       // 배송 완료
  | 'returned';       // 반송

export type ShippingCarrier = 
  | 'korea_post'      // 우체국
  | 'cj_logistics'    // CJ대한통운
  | 'hanjin'          // 한진택배
  | 'lotte'           // 롯데택배
  | 'logen'           // 로젠택배
  | 'direct';         // 직접배송

// CS 관련 타입
export interface CSTicket {
  id: string;
  orderId: string;
  customerId: string;
  type: CSType;
  status: CSTicketStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  subject: string;
  messages: CSMessage[];
  assignedTo?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type CSType = 
  | 'inquiry'         // 문의
  | 'complaint'       // 불만
  | 'return'          // 반품
  | 'exchange'        // 교환
  | 'refund'          // 환불
  | 'delivery'        // 배송문의
  | 'product';        // 상품문의

export type CSTicketStatus = 
  | 'open'
  | 'pending'
  | 'resolved'
  | 'closed';

export type CSStatus = 
  | 'none'            // CS 없음
  | 'in_progress'     // CS 진행중
  | 'resolved';       // CS 해결

export interface CSMessage {
  id: string;
  ticketId: string;
  sender: 'customer' | 'staff';
  message: string;
  attachments?: string[];
  createdAt: string;
}

// 일괄 작업 타입
export interface BulkAction {
  type: 'update_status' | 'print_labels' | 'send_tracking' | 'export';
  orderIds: string[];
  params?: any;
}

// 필터 타입
export interface OrderFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  platforms?: SalesPlatform[];
  status?: OrderStatus[];
  shippingStatus?: ShippingStatus[];
  paymentStatus?: PaymentStatus[];
  csStatus?: CSStatus[];
  search?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  brand: string;
  imageUrl: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  rating?: number;
  search?: string;
}

export interface ProductStats {
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}