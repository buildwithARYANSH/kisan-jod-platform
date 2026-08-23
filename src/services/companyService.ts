import type { 
  CompanyDemand, 
  FairPriceFactors, 
  QualityBatch, 
  CompanyReceipt, 
  ShipmentOrder, 
  CompanyProfile 
} from '../types';
import { 
  INITIAL_COMPANY_DEMANDS, 
  MOCK_FAIR_PRICING, 
  INITIAL_QUALITY_BATCHES, 
  INITIAL_COMPANY_RECEIPTS, 
  INITIAL_SHIPMENT_ORDERS, 
  INITIAL_COMPANY_PROFILE 
} from '../data/mockCompany';

/**
 * Company Portal Service Layer
 * Abstraction layer separating UI components from data source.
 * Replace local mock data calls below with real HTTP API calls when backend API is ready.
 */
export class CompanyService {
  // 1. Demands API
  static async getDemands(): Promise<CompanyDemand[]> {
    // TODO: Replace with GET /api/v1/company/demands
    try {
      const saved = localStorage.getItem('kisan_company_demands');
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_DEMANDS;
    } catch {
      return INITIAL_COMPANY_DEMANDS;
    }
  }

  static async submitDemand(demandData: Omit<CompanyDemand, 'id' | 'matchedQuantity' | 'status' | 'submittedDate'>): Promise<CompanyDemand> {
    // TODO: Replace with POST /api/v1/company/demands
    const id = `DEM-BUY-${Date.now().toString().slice(-4)}`;
    const submittedDate = new Date().toISOString().split('T')[0];
    return {
      ...demandData,
      id,
      matchedQuantity: 0,
      status: 'Open',
      submittedDate,
    };
  }

  // 2. Fair Price Recommendation Engine API
  static async getFairPriceFactors(cropName: string): Promise<FairPriceFactors> {
    // TODO: Replace with GET /api/v1/pricing/fair-price?crop=${cropName}
    // TODO: Connect official market pricing API & AI pricing weights model
    return MOCK_FAIR_PRICING[cropName] || MOCK_FAIR_PRICING['Tomato'];
  }

  // 3. Quality Batches API
  static async getIncomingQualityBatches(): Promise<QualityBatch[]> {
    // TODO: Replace with GET /api/v1/company/quality-batches
    // TODO: Connect Field Agent inspection form & AI Star Rating model output
    return INITIAL_QUALITY_BATCHES;
  }

  // 4. Receipts & Invoices API
  static async getReceipts(): Promise<CompanyReceipt[]> {
    // TODO: Replace with GET /api/v1/company/receipts
    return INITIAL_COMPANY_RECEIPTS;
  }

  // 5. Logistics & Shipment Tracking API
  static async getShipmentOrders(): Promise<ShipmentOrder[]> {
    // TODO: Replace with GET /api/v1/company/shipments
    // TODO: Connect real 3rd party logistics provider GPS tracking API
    return INITIAL_SHIPMENT_ORDERS;
  }

  // 6. Company Profile API
  static async getCompanyProfile(): Promise<CompanyProfile> {
    // TODO: Replace with GET /api/v1/company/profile
    try {
      const saved = localStorage.getItem('kisan_company_profile');
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
    } catch {
      return INITIAL_COMPANY_PROFILE;
    }
  }
}
