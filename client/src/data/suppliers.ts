export interface Supplier {
  id: string
  name: string
  leadTime: number
  reliability: "low" | "medium" | "high"
  contact: string
  email: string
  phone: string
  address: string
}

export const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "TechCorp Supplies",
    leadTime: 4,
    reliability: "high",
    contact: "John Smith",
    email: "john@techcorp.com",
    phone: "555-123-4567",
    address: "123 Tech Blvd, San Francisco, CA",
  },
  {
    id: "s2",
    name: "ElectroVision Inc",
    leadTime: 6,
    reliability: "medium",
    contact: "Sarah Johnson",
    email: "sarah@electrovision.com",
    phone: "555-234-5678",
    address: "456 Circuit Ave, Austin, TX",
  },
  {
    id: "s3",
    name: "GlobalGadgets",
    leadTime: 3,
    reliability: "high",
    contact: "Michael Chen",
    email: "michael@globalgadgets.com",
    phone: "555-345-6789",
    address: "789 Gadget St, Seattle, WA",
  },
  {
    id: "s4",
    name: "OfficeMart",
    leadTime: 5,
    reliability: "medium",
    contact: "Lisa Brown",
    email: "lisa@officemart.com",
    phone: "555-456-7890",
    address: "101 Office Pkwy, Chicago, IL",
  },
]
