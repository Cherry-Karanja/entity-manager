export class Endpoints {
  static readonly BaseUrl = "http://127.0.0.1:8000"; // replace with environment variable in prod

  // ===============================
  // Authentication & User Management
  // ===============================
  static readonly Auth = {
    Login: `${this.BaseUrl}/api/v1/core/auth/login/`,
    Logout: `${this.BaseUrl}/api/v1/core/auth/logout/`,
    Register: `${this.BaseUrl}/api/v1/core/auth/registration/`,
    UserDetails: `${this.BaseUrl}/api/v1/core/auth/user/`,
    TokenRefresh: `${this.BaseUrl}/api/v1/core/auth/token/refresh/`,
    TokenVerify: `${this.BaseUrl}/api/v1/core/auth/token/verify/`,
    PasswordReset: `${this.BaseUrl}/api/v1/core/auth/password/reset/`,
    PasswordChange: `${this.BaseUrl}/api/v1/core/auth/password/change/`,
    PasswordResetConfirm: `${this.BaseUrl}/api/v1/core/auth/password/reset/confirm/`,
    EmailVerification: `${this.BaseUrl}/api/v1/core/auth/account-confirm-email/`,
    ResendEmailVerification: `${this.BaseUrl}/api/v1/core/auth/registration/resend-email/`,
    CsrfToken: `${this.BaseUrl}/api/v1/core/auth/csrf-cookie/`,
  };

  // ===============================
  // User Management
  // ===============================
  static readonly UserManager = {
    Base: `${this.BaseUrl}/user-manager`,
    Users: `${this.BaseUrl}/user-manager/users/`,
    TenantProfiles: `${this.BaseUrl}/user-manager/tenant-profiles/`,
    LandlordProfiles: `${this.BaseUrl}/user-manager/landlord-profiles/`,
    CaretakerProfiles: `${this.BaseUrl}/user-manager/caretaker-profiles/`,
    PropertyManagerProfiles: `${this.BaseUrl}/user-manager/property-manager-profiles/`,
  };

  // ===============================
  // Property Management
  // ===============================
  static readonly PropertyManager = {
    Base: `${this.BaseUrl}/property-manager`,
    Apartments: `${this.BaseUrl}/property-manager/apartment/`,
    Houses: `${this.BaseUrl}/property-manager/house/`,
    Units: `${this.BaseUrl}/property-manager/units/`,
    MaintenanceRequests: `${this.BaseUrl}/property-manager/maintenance-requests/`,
    Statistics: `${this.BaseUrl}/property-manager/statistics/`,
  };

  // ===============================
  // Rent Management
  // ===============================
  static readonly RentManager = {
    Base: `${this.BaseUrl}/rent-manager`,
    Rents: `${this.BaseUrl}/rent-manager/rents/`,
    RentPayments: `${this.BaseUrl}/rent-manager/rent-payments/`,
    MyRentPaymentHistory: `${this.BaseUrl}/rent-manager/my-rent-payment-history/`,
  };

  // ===============================
  // Notifications
  // ===============================
  static readonly Notifications = {
    Base: `${this.BaseUrl}/notifications-manager`,
  };

  // ===============================
  // Generic API Endpoints
  // ===============================
  static readonly Api = {
    Base: `${this.BaseUrl}/api`,
    Entities: `${this.BaseUrl}/api/entities/`,
  };
}
