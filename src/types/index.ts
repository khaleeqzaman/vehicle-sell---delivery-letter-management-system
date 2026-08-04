export interface ShowroomSettings {
  name: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  contactNo: string;
  website: string;
  logoUrl: string;
  cplcOperatorDefault: string;
  urduUndertakingRules: string[];
  urduDeclarationText: string;
}

export interface VehicleParticulars {
  registrationNo: string;
  make: string;
  model: string;
  colour: string;
  registrationName: string;
  ownerCnic: string;
  chassisNo: string;
  engineNo: string;
  engineCapacity: string;
  bookNo: string;
}

export interface DeliverySchedule {
  date: string;
  day: string;
  time: string;
}

export interface PaymentDetails {
  sumInWords: string;
  sumInDigits: number;
  advance: number;
  balance: number;
  dateOfBalance: string;
  specialNote: string;
  hasCheque: boolean;
}

export interface ChequeDetails {
  bankName: string;
  chequeNo: string;
  amount: number;
  dated: string;
}

export interface ClientParty {
  id?: string;
  cnic: string;
  name: string;
  fatherName: string; // S/O
  phone: string;
  phone2?: string; // Secondary Mobile / 2nd Contact
  address: string;
  witnessName: string;
  witnessCnic: string;
  hasOptionFlag?: boolean; // For Purchaser: Original Number Plate Received; For Seller: Biometric Available
}

export interface PurchaserDetails extends ClientParty {
  originalNumberPlateReceived: boolean;
}

export interface SellerDetails extends ClientParty {
  sellerBiometricAvailable: boolean;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: 'cnic_front' | 'cnic_back' | 'biometric_slip' | 'license' | 'agreement_scan' | 'other';
  fileUrl: string;
  fileName?: string;
  uploadedAt: string;
}

export interface ClientProfile {
  id: string;
  cnic: string;
  name: string;
  fatherName: string;
  phone: string;
  phone2?: string;
  address: string;
  role: 'purchaser' | 'seller' | 'both';
  totalTransactions: number;
  totalVolume: number;
  documents?: ClientDocument[];
  notes?: string;
  createdAt: string;
}

export interface VehicleInventoryItem {
  id: string;
  stockId: string;
  make: string;
  model: string;
  variant: string;
  registrationNo: string;
  registrationCity: string;
  modelYear: number;
  registrationYear?: number;
  colour: string;
  engineNo: string;
  chassisNo: string;
  engineCapacity: string;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Hybrid' | 'Diesel' | 'EV';
  mileageKm: number;
  assembly: 'Local (CKD)' | 'Imported / Japanese (CBU)';
  
  // Pakistani Docs & Transfer Status
  smartCardStatus: 'Original Available' | 'Duplicate Book' | 'Applied / Pending';
  biometricStatus: 'Available' | 'In Process' | 'Open Letter';
  tokenTaxPaidTill: string;
  originalPlatesAvailable: boolean;
  fileStatus: 'Complete Original File' | 'Duplicate File' | 'Exempt / Smart Card Only';

  // Condition & Paint
  conditionRating: 'Grade A+ (Like New)' | 'Grade A (Excellent)' | 'Grade B (Good)' | 'Grade C (Fair)';
  paintDetails: string;

  // Commercial & Pricing
  costPrice: number;
  demandPrice: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Under Maintenance';
  
  // Linked Clients
  sellerId?: string;
  sellerName?: string;
  sellerCnic?: string;
  
  buyerId?: string;
  buyerName?: string;
  buyerCnic?: string;
  
  // Media & History
  images?: string[];
  notes?: string;
  soldDate?: string;
  soldPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellLetterDocument {
  id: string;
  serialNo: string;
  cplcOperatorNo: string;
  date: string;
  time: string;
  vehicle: VehicleParticulars;
  inventoryVehicleId?: string;
  delivery: DeliverySchedule;
  payment: PaymentDetails;
  cheque?: ChequeDetails;
  verificationDate: string;
  purchaser: PurchaserDetails;
  seller: SellerDetails;
  status: 'completed' | 'pending_balance' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface MVCModule {
  id: string;
  name: string;
  version: string;
  description: string;
  controller: string;
  model: string;
  views: string[];
  routes: string[];
  status: 'active' | 'inactive';
}
