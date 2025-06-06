export interface Venue {
    id: string;
    name: string;
    address: string;
    capacity: number;
    description?: string;
    amenities: string[];
    images: string[];
    is_active: boolean;
  }
  
  export interface ClassCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  }
  
  export interface MeetupClass {
    id: string;
    title: string;
    slug: string;
    description: string;
    description_html?: string;
    category: ClassCategory;
    tags: string[];
    instructor: {
      id: string;
      username: string;
      fullName: string;
      profileImage?: string;
    };
    featured_image?: string;
    detail_images: string[];
    price: number;
    max_participants: number;
    min_participants: number;
    recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    view_count: number;
    rating_average?: number;
    rating_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface ClassSession {
    id: string;
    meetup_class: MeetupClass;
    venue: Venue;
    start_datetime: string;
    end_datetime: string;
    current_participants: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    notes?: string;
  }
  
  export interface Booking {
    id: string;
    session: ClassSession;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
    participant_count: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
    payment_method?: string;
    payment_id?: string;
    user_note?: string;
    created_at: string;
  }
  
  export interface Review {
    id: string;
    booking: string;
    rating: number;
    content: string;
    images: string[];
    is_verified: boolean;
    helpful_count: number;
    created_at: string;
  }