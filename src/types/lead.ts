export type LeadStatus = 'New' | 'Contacted' | 'Sold' | 'Not Interested'

export interface Lead {
  id: string
  google_place_id: string
  name: string
  address: string
  phone?: string
  rating: number
  review_count: number
  photos: string[]
  website?: string
  status: LeadStatus
  notes: string
  created_at: string
  updated_at: string
}
