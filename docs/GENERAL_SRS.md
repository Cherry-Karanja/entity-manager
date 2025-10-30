# 🏠 MyLandlord - General Software Requirements Specification (SRS)

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Access Control](#user-roles--access-control)
4. [Core Features](#core-features)
5. [Business Logic](#business-logic)
6. [Technical Requirements](#technical-requirements)
7. [Integration Requirements](#integration-requirements)
8. [Security Requirements](#security-requirements)
9. [Performance Requirements](#performance-requirements)
10. [Deployment & Scalability](#deployment--scalability)

---

## 1. Project Overview

### 1.1 Project Identity
- **Name:** MyLandlord
- **Version:** 1.0
- **Purpose:** Comprehensive landlord-tenant management system for property management, rent tracking, billing, and communication
- **Target Market:** Kenyan property owners and rental property managers

### 1.2 Project Objectives
- Streamline property management operations
- Automate rent collection and billing processes
- Provide transparent communication between landlords and tenants
- Generate comprehensive reports and analytics
- Ensure secure document management and storage

### 1.3 Technology Stack
- **Backend:** Django REST Framework with dj-rest-auth
- **Frontend:** Next.js with TypeScript and TailwindCSS
- **Database:** PostgreSQL (production) / SQLite (development)
- **Authentication:** Email/password with email verification
- **SMS Gateway:** Africa's Talking API
- **File Storage:** AWS S3 or local storage
- **Deployment:** Docker containers

---

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Django)      │◄──►│   Services      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (PostgreSQL)  │
                       └─────────────────┘
```

### 2.2 Component Breakdown
- **Frontend Layer:** User interface, authentication, state management
- **API Layer:** RESTful endpoints, authentication, business logic
- **Data Layer:** Database operations, file storage, caching
- **Integration Layer:** SMS gateway, payment processing, external APIs

---

## 3. User Roles & Access Control

### 3.1 User Roles

#### 3.1.1 Landlord
- **Primary Role:** Property owner/manager
- **Permissions:**
  - Manage properties and units
  - Register and manage tenants
  - Generate and send invoices
  - View financial reports
  - Manage contracts and documents
  - Configure billing templates
  - Send notifications

#### 3.1.2 Tenant
- **Primary Role:** Property renter
- **Permissions:**
  - View personal invoices and payment history
  - Make payment confirmations
  - Report maintenance issues
  - Access lease agreements
  - Update personal information
  - Receive notifications

#### 3.1.3 Caretaker
- **Primary Role:** Property maintenance and tenant assistance
- **Permissions:**
  - Assist in tenant registration
  - Manage maintenance requests
  - Update tenant information (limited)
  - View property-specific data
  - Send maintenance updates

#### 3.1.4 Property Manager
- **Primary Role:** MyLandlord team member managing system-managed properties
- **Permissions:**
  - Full property management access for assigned properties
  - Tenant registration and management
  - Maintenance request handling
  - Rent collection and reporting
  - Direct communication with tenants
  - Generate reports for property owners
  - Access to financial data for managed properties

#### 3.1.5 Admin
- **Primary Role:** Platform administration
- **Permissions:**
  - Oversee all platform operations
  - Manage user accounts
  - Configure system settings
  - Access analytics and reports
  - Manage billing tiers
  - Assign properties to property managers
  - Monitor system-managed properties performance

### 3.2 Access Control Rules
- **Data Isolation:** Each landlord can only access their own data
- **Invitation System:** Tenants and caretakers must be invited by landlords
- **Role-Based Permissions:** Granular permissions based on user roles
- **Session Management:** Secure session handling with JWT tokens
- **System-Managed Properties:** Property managers have full access to assigned properties, landlords retain oversight access
- **Management Hierarchy:** Admin > Property Manager > Landlord > Caretaker > Tenant

---

## 4. Core Features

### 4.1 Property Management
- **Multi-Property Support:** Manage multiple properties per landlord
- **Unit Management:** Support for standard and shared units
- **Property Documentation:** Upload and manage property documents
- **Amenity Management:** Configure amenities per property/unit
- **Management Types:** 
  - **Self-Managed:** Landlord handles all operations independently
  - **System-Managed:** MyLandlord team acts as property management agency
- **Full-Service Management:** Complete property management services including tenant acquisition, maintenance coordination, rent collection, and reporting

### 4.2 Tenant Management
- **Tenant Registration:** Invite and register tenants
- **Lease Management:** Create, edit, and manage lease agreements
- **Document Management:** Handle tenant documents and contracts
- **Communication:** Send notifications and messages

### 4.3 Billing & Payments
- **Automated Billing:** Generate invoices based on billing cycles
- **Payment Tracking:** Record and track payments
- **Partial Payments:** Support for partial payment handling
- **Amenity Billing:** Bill for utilities and optional services

### 4.4 Reporting & Analytics
- **Financial Reports:** Income, expenses, and profitability analysis
- **Occupancy Reports:** Track unit occupancy rates
- **Payment Reports:** Monitor payment patterns and late payments
- **Tenant Reports:** Individual tenant payment histories

### 4.5 Communication System
- **Multi-Channel:** Email, SMS, and future WhatsApp integration
- **Automated Notifications:** Rent reminders, payment confirmations
- **Communication Logs:** Track all communications
- **Maintenance Updates:** Status updates for maintenance requests

---

## 5. Business Logic

### 5.1 Subscription Tiers

#### 5.1.1 Free Tier
- **Limitations:** 1 property, income < KES 100K
- **Features:** Basic property management, email notifications

#### 5.1.2 Starter Plan
- **Limitations:** Up to 3 properties or KES 250K income
- **Features:** SMS reminders, amenity billing, reporting dashboard

#### 5.1.3 Growth Plan
- **Limitations:** 4-10 properties or KES 1M income
- **Features:** Shared units, maintenance ticketing, invoice customization

#### 5.1.4 Business Plan
- **Limitations:** 11-25 properties or KES 3M income
- **Features:** Multiple caretakers, communication logs, bulk operations

#### 5.1.5 Agency/Enterprise Plan
- **Limitations:** 26+ properties or custom income
- **Features:** API integrations, analytics dashboards, permissions management

#### 5.1.6 Managed Services Plan
- **Service Type:** Full property management by MyLandlord team
- **Target:** Landlords who want hands-off property management
- **Features:** 
  - Dedicated property manager assigned
  - Tenant acquisition and screening
  - Maintenance coordination and oversight
  - Rent collection and deposit management
  - Legal compliance and documentation
  - Monthly detailed reporting
  - 24/7 tenant support
- **Pricing:** Percentage-based fee (typically 8-12% of rental income)
- **Property Status:** System-managed with landlord oversight access

### 5.2 Billing Cycles
- **Monthly:** Default billing cycle
- **Weekly:** For short-term rentals
- **Custom:** Configurable billing periods

### 5.3 Payment Processing
- **Manual Recording:** Cash and M-Pesa manual entry
- **M-Pesa Integration:** Automated payment processing
- **Partial Payments:** Support for installment payments

---

## 6. Technical Requirements

### 6.1 Backend Requirements
- **Framework:** Django 4.2+ with Django REST Framework
- **Authentication:** dj-rest-auth with email verification
- **Database:** PostgreSQL for production, SQLite for development
- **API Documentation:** OpenAPI/Swagger integration
- **File Handling:** Support for document uploads and storage

### 6.2 Frontend Requirements
- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript for type safety
- **Styling:** TailwindCSS for responsive design
- **State Management:** React Query for server state
- **Authentication:** JWT token management

### 6.3 Database Requirements
- **ACID Compliance:** Ensure data integrity
- **Backup Strategy:** Regular automated backups
- **Performance:** Optimized queries and indexing
- **Migration Support:** Database schema versioning

---

## 7. Integration Requirements

### 7.1 SMS Gateway Integration
- **Provider:** Africa's Talking API
- **Features:** SMS sending, delivery reports, bulk messaging
- **Rate Limiting:** Handle API rate limits gracefully

### 7.2 Payment Gateway Integration
- **M-Pesa:** Daraja API integration for payments
- **Webhook Handling:** Process payment notifications
- **Security:** Secure payment processing

### 7.3 File Storage Integration
- **Local Storage:** Development environment
- **Cloud Storage:** AWS S3 or similar for production
- **CDN:** Content delivery for static assets

---

## 8. Security Requirements

### 8.1 Authentication & Authorization
- **JWT Tokens:** Secure token-based authentication
- **Password Security:** Hashed passwords with salt
- **Email Verification:** Mandatory email confirmation
- **Role-Based Access:** Granular permission system

### 8.2 Data Security
- **Data Encryption:** Encrypt sensitive data at rest
- **HTTPS:** Secure data transmission
- **Input Validation:** Prevent injection attacks
- **CORS Configuration:** Secure cross-origin requests

### 8.3 Privacy & Compliance
- **Data Isolation:** Tenant data segregation
- **Audit Logging:** Track user actions
- **GDPR Compliance:** Data protection regulations
- **Backup Security:** Encrypted backups

---

## 9. Performance Requirements

### 9.1 Response Time
- **API Endpoints:** < 500ms for most operations
- **Database Queries:** Optimized for < 100ms
- **File Uploads:** Progress indicators for large files
- **Report Generation:** Async processing for complex reports

### 9.2 Scalability
- **Concurrent Users:** Support 1000+ concurrent users
- **Database Scaling:** Horizontal scaling capabilities
- **Load Balancing:** Distribute traffic across servers
- **Caching:** Redis caching for frequently accessed data

### 9.3 Availability
- **Uptime:** 99.9% availability target
- **Backup Systems:** Automated failover mechanisms
- **Monitoring:** Real-time system monitoring
- **Maintenance Windows:** Scheduled maintenance periods

---

## 10. Deployment & Scalability

### 10.1 Development Environment
- **Local Development:** Docker Compose setup
- **Development Database:** SQLite for simplicity
- **Hot Reloading:** Development server with auto-refresh
- **Debug Tools:** Comprehensive logging and debugging

### 10.2 Production Environment
- **Containerization:** Docker containers for consistency
- **Database:** PostgreSQL with replication
- **Web Server:** Nginx reverse proxy
- **SSL/TLS:** HTTPS certificates

### 10.3 Monitoring & Maintenance
- **Application Monitoring:** Error tracking and performance monitoring
- **Database Monitoring:** Query performance and optimization
- **Security Monitoring:** Intrusion detection and security alerts
- **Automated Backups:** Regular data backups with retention policies

---

## Conclusion

This SRS document provides a comprehensive overview of the MyLandlord system requirements. It serves as the foundation for both backend and frontend development, ensuring all stakeholders understand the system's scope, functionality, and technical requirements.

The modular approach allows for iterative development, starting with core features and expanding to advanced functionality based on user feedback and business requirements.
