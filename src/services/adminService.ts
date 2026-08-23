import type { 
  AdminProfile, 
  AdminFarmerItem, 
  AdminCompanyItem, 
  AdminFieldAgentItem, 
  WarehouseFacility, 
  AdminDisputeTicket, 
  RiskAlert, 
  AuditLogItem 
} from '../types';
import { 
  INITIAL_ADMIN_PROFILE, 
  INITIAL_ADMIN_FARMERS, 
  INITIAL_ADMIN_COMPANIES, 
  INITIAL_ADMIN_FIELD_AGENTS, 
  INITIAL_WAREHOUSES, 
  INITIAL_DISPUTES, 
  INITIAL_RISK_ALERTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockAdmin';

/**
 * Admin / Platform Operations Service Layer
 * Abstracted API layer connecting Admin Portal UI to the shared data layer.
 * Replace mock implementations below with HTTP API endpoints when production backend is active.
 */
export class AdminService {
  // 1. Admin Profile API
  static async getProfile(): Promise<AdminProfile> {
    // TODO: Replace with GET /api/v1/admin/profile
    return INITIAL_ADMIN_PROFILE;
  }

  // 2. Farmer Management API
  static async getFarmers(): Promise<AdminFarmerItem[]> {
    // TODO: Replace with GET /api/v1/admin/farmers
    return INITIAL_ADMIN_FARMERS;
  }

  // 3. Company Management API
  static async getCompanies(): Promise<AdminCompanyItem[]> {
    // TODO: Replace with GET /api/v1/admin/companies
    return INITIAL_ADMIN_COMPANIES;
  }

  // 4. Field Agent Management API
  static async getFieldAgents(): Promise<AdminFieldAgentItem[]> {
    // TODO: Replace with GET /api/v1/admin/field-agents
    return INITIAL_ADMIN_FIELD_AGENTS;
  }

  // 5. Warehouse & Inventory API
  static async getWarehouses(): Promise<WarehouseFacility[]> {
    // TODO: Replace with GET /api/v1/admin/inventory/facilities
    return INITIAL_WAREHOUSES;
  }

  // 6. Disputes & Chain of Custody API
  static async getDisputes(): Promise<AdminDisputeTicket[]> {
    // TODO: Replace with GET /api/v1/admin/disputes
    return INITIAL_DISPUTES;
  }

  // 7. Risk & Anomaly Detection API
  static async getRiskAlerts(): Promise<RiskAlert[]> {
    // TODO: Replace with GET /api/v1/admin/risk-alerts
    return INITIAL_RISK_ALERTS;
  }

  // 8. Audit Trail Log API
  static async getAuditLogs(): Promise<AuditLogItem[]> {
    // TODO: Replace with GET /api/v1/admin/audit-logs
    return INITIAL_AUDIT_LOGS;
  }
}
