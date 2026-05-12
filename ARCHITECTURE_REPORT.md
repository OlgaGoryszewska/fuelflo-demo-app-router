# FuelFlo Application - Detailed Architecture & Project Report

**Document Version:** 1.0  
**Date:** May 2026  
**Project:** FuelFlo Demo App Router  
**Owner:** OlgaGoryszewska  

---

## Executive Summary

FuelFlo is a sophisticated, offline-first Progressive Web Application (PWA) designed to streamline fuel management for event operations. The platform enables field technicians, managers, and fuel suppliers to track fuel deliveries, manage generators and external fuel tanks, and generate comprehensive reports—all with robust offline capabilities for seamless operations in remote locations.

**Key Highlights:**
- ✅ **Offline-First Architecture** with automatic sync when connectivity returns
- ✅ **Role-Based Access Control** supporting 5 user roles with granular permissions
- ✅ **Real-Time Data Synchronization** leveraging Supabase and IndexedDB
- ✅ **Mobile-Optimized PWA** with install prompts and native app experience
- ✅ **Multi-Module Ecosystem** covering fuel transactions, project management, reporting, and resource management
- ✅ **Production-Ready** with authentication, security policies, and error recovery

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Core Features & Modules](#core-features--modules)
5. [Component Structure](#component-structure)
6. [Data Model & Database Schema](#data-model--database-schema)
7. [API Architecture](#api-architecture)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Offline-First Architecture](#offline-first-architecture)
10. [Security & Authentication](#security--authentication)
11. [Deployment & Infrastructure](#deployment--infrastructure)
12. [Performance Considerations](#performance-considerations)
13. [Future Roadmap](#future-roadmap)

---

## Project Overview

### Purpose
FuelFlo solves critical challenges in event fuel management:
- **Problem:** Fuel tracking in remote locations with unreliable connectivity
- **Solution:** Offline-capable mobile application with comprehensive fuel transaction management
- **Beneficiaries:** Event organizers, fuel suppliers, technicians, managers, hire desk operators

### Business Value
1. **Improved Accuracy:** Automated fuel tracking with photo evidence and QR codes
2. **Operational Efficiency:** Real-time dashboards and task management
3. **Cost Control:** Comprehensive reporting and financial transaction tracking
4. **Scalability:** Multi-role system supporting complex event operations
5. **Accessibility:** PWA technology enables access without app store distribution

### Project Scope
- Full-stack web application with PWA capabilities
- 5 user roles with differentiated experiences
- Complex fuel transaction workflows
- Real-time and offline synchronization
- PDF report generation
- QR code integration for equipment tracking

---

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Progressive Web App (Next.js 16 + React 19)            │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Role-Based Dashboard & Navigation System         │ │  │
│  │  │  - Technician Dashboard                           │ │  │
│  │  │  - Manager Dashboard                              │ │  │
│  │  │  - Organizer Portal                               │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐    ┌────────▼────────┐   ┌──────▼───────┐
    │  OFFLINE  │    │   SYNC ENGINE   │   │  AUTH LAYER  │
    │  STORAGE  │    │                 │   │              │
    │ IndexedDB │◄──►│  Supabase SDK   │   │  Supabase    │
    │           │    │  REST API Calls │   │  Auth        │
    └───────────┘    └────────┬────────┘   └──────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐    ┌────────▼────────┐   ┌──────▼───────┐
    │ SERVICE   │    │  API GATEWAY    │   │ REALTIME     │
    │ WORKER    │    │                 │   │ SUBSCRIPTIONS│
    │           │    │  Next.js Routes │   │              │
    └───────────┘    └────────┬────────┘   └──────────────┘
                              │
                   ┌──────────▼──────────┐
                   │   BACKEND LAYER     │
                   ├──────────────────────┤
                   │  Supabase Platform   │
                   │  - PostgreSQL DB     │
                   │  - Auth System       │
                   │  - Real-time Events  │
                   │  - Row-Level Security│
                   └──────────────────────┘
```

### Architectural Patterns

**1. Offline-First Pattern**
- Primary data store: IndexedDB (browser local storage)
- Sync mechanism: Automatic reconciliation when online
- Conflict resolution: Last-write-wins strategy
- Recovery: Automatic page reload on connectivity restoration

**2. Role-Based Access Control (RBAC)**
- Backend: Supabase Row-Level Security (RLS) policies
- Frontend: Role-based navigation and feature gates
- Enforcement: JWT tokens with role metadata

**3. Component-Driven Architecture**
- Isolated, reusable React components
- Separation of concerns: UI components vs. containers
- Clear data flow: Props down, events up

**4. Multi-Layer Data Synchronization**
- Layer 1: Optimistic UI updates
- Layer 2: Background sync queue
- Layer 3: Supabase sync verification
- Layer 4: Real-time subscription updates

---

## Technology Stack

### Frontend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16.1.6 | Server-side rendering, API routes, PWA support |
| **UI Framework** | React | 19.2.1 | Component-based UI development |
| **Component Library** | Material-UI (MUI) | 7.3.9 | Pre-built accessible UI components |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Icons** | Lucide React | 0.548.0 | Modern SVG icon library |
| **State Management** | React Hooks | Built-in | useState, useEffect, useContext, useSyncExternalStore |
| **Storage** | IndexedDB | Native | Offline data persistence |
| **PDF Generation** | @react-pdf/renderer | 4.4.1 | PDF report generation |
| **QR Codes** | qrcode + html5-qrcode | 1.5.4, 2.3.8 | QR generation and scanning |
| **Currency Input** | react-currency-input-field | 3.10.0 | Financial transaction input |

### Backend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Database** | PostgreSQL | Latest | Relational data storage (via Supabase) |
| **Auth Provider** | Supabase Auth | 0.10.0 | JWT-based authentication |
| **API Client** | Supabase JS | 2.99.2 | Database & auth API |
| **Real-time** | Supabase Realtime | Built-in | WebSocket subscriptions |
| **RLS Engine** | PostgreSQL RLS | Native | Row-level security policies |
| **API Routes** | Next.js API Routes | 16.1.6 | Server-side endpoint handlers |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.x | Code linting and quality |
| Prettier | 3.5.3 | Code formatting |
| PostCSS | 4.x | CSS processing pipeline |
| Tailwind PostCSS | 4.x | Tailwind CSS compilation |

### Infrastructure
- **Deployment Platform:** Vercel (recommended)
- **CDN:** Vercel Edge Network
- **Database Hosting:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Environment:** Node.js (server-side)

---

## Core Features & Modules

### 1. **Dashboard & Home** (`/operations/dashboard/*`)
Personalized dashboards for each user role providing quick access to key metrics and tasks.

**Features:**
- Role-specific task panels
- Real-time metrics and insights
- Quick action buttons (transactions, projects)
- Online/offline status indicator
- Dashboard task management (hire desk, managers, technicians)

**Key Components:**
- `RoleDashboard.jsx` - Main dashboard orchestrator
- `DashboardInsights.jsx` - Key metrics display
- `DashboardTaskPanel.jsx` - Task management interface
- `OfflineSyncStatus.jsx` - Sync status display

**Database Integration:**
- `dashboard_tasks` table with role-based policies
- Real-time subscription for task updates
- Assigned task tracking with priority levels

---

### 2. **Fuel Transaction Management** (`/resources/fuel-transactions*`)
Core module for tracking fuel deliveries and returns with comprehensive evidence collection.

**Key Features:**
- **Before/After Photo Capture:** Evidence documentation
- **Fuel Level Reading:** Before and after measurements
- **Transaction Types:** Delivery vs. Return workflows
- **Status Tracking:** Complete journey from start to confirmation
- **Validation:** Ensures consistency between readings and evidence
- **Report Generation:** PDF reports for transactions

**Transaction Workflow:**
```
Start Transaction
    ↓
Setup (Type selection)
    ↓
Before Reading & Photo
    ↓
Operation (During transfer)
    ↓
After Reading & Photo
    ↓
Review (Validation)
    ↓
Success State & Confirmation
```

**Key Components:**
- `FuelTransactionDetail.js` - Transaction display and management
- `FuelTransactionListReport.js` - List and reporting
- `TransactionUi.js` - UI orchestration
- `setup.js` - Initial setup
- `before-delivery-success-alert.js`, `after-delivery-success-alert.js` - Status confirmation
- `TransactionReportPdf.js` - PDF generation

---

### 3. **Project Management** (`/resources/projects*`)
Multi-step project creation and management for event fuel operations.

**Features:**
- **Multi-Step Forms:** 5-step project setup wizard
- **Project Assignment:** Link generators and fuel sources
- **Transaction Association:** Track fuel movements per project
- **Project Reporting:** Aggregate fuel data by project
- **Task Integration:** Link projects to technician assignments

**Project Setup Steps:**
1. **Step One:** Basic project information
2. **Step Two:** Project details and dates
3. **Step Three:** Fuel source selection
4. **Step Four:** Generator assignment
5. **Step Five:** Review and confirm

**Key Components:**
- `ProjectUi.js` - Main project interface
- `projectForm.js` - Form handling and validation
- `StepOne.js` through `StepFive.js` - Individual step components
- `GeneratorDropdown.js` - Equipment selection
- `ProjectReportDocument.js` - Project-level reporting

---

### 4. **Generator & Equipment Management** (`/resources/generators*`)
Tracking and management of power generation equipment with QR code integration.

**Features:**
- **QR Code Generation:** Unique identifiers for generators
- **QR Code Scanning:** Quick equipment identification
- **Equipment Registry:** Comprehensive equipment database
- **Fleet Management:** Multi-generator tracking per project
- **Offline Access:** Equipment data cached for field use

**Key Components:**
- `GeneratorsResourceClient.jsx` - Client-side generator management
- `GeneratorQrScanner.js` - QR code scanning interface
- `OfflineGeneratorSelect.jsx` - Offline equipment selection
- `GeneratorDropdown.js` - UI dropdown component

**QR Integration:**
- Used in transaction workflows for quick equipment ID entry
- Reduces manual data entry and improves accuracy
- Field-friendly one-tap equipment selection

---

### 5. **External Tanks Management** (`/resources/external-tanks*`)
Management of external fuel storage with capacity tracking.

**Features:**
- **Tank Registry:** Comprehensive tank database
- **Capacity Tracking:** Volume measurements and limits
- **Source Management:** External fuel source identification
- **Assignment:** Link tanks to projects and deliveries

**Key Components:**
- `ExternalTanksResourceClient.jsx` - Main tank management
- `OfflineTankSelect.jsx` - Offline tank selection

---

### 6. **Reporting System** (`/resources/reports*`)
Comprehensive reporting with PDF generation capabilities.

**Report Types:**
1. **Fuel Transaction Reports**
   - Individual transaction details
   - Multi-transaction summaries
   - Date-range filtering

2. **Project Reports**
   - Project-level fuel summary
   - Transaction history per project
   - Resource utilization

3. **Financial Reports**
   - Cost tracking per transaction
   - Project costing
   - Supplier billing

**Key Components:**
- `TransactionReportPdf.js` - PDF generation for transactions
- `TransactionReportPreview.js` - Preview before export
- `ProjectReportDocument.js` - Project-level documents
- `ProjectReportPreview.js` - Project preview

**PDF Features:**
- Embedded transaction data
- Photo evidence (where applicable)
- Formatting for printing
- Timestamp and signature fields

---

### 7. **Role-Based Resource Management** (`/resources/*`)
Differentiated access to resources based on user roles.

**Modules:**
- **Event Organizers:** Full project and financial oversight
- **Fuel Suppliers:** Supplier registry and delivery tracking
- **Managers:** Team oversight and task assignment
- **Hire Desk:** Personnel assignment and coordination
- **Technicians:** Field work and transaction execution

**Common Features:**
- Role-specific dashboards
- Permission-based feature access
- Resource listings and searches
- Task assignments and tracking

---

### 8. **User Authentication & Profiles** (`/resources/profile*`, `/signIn*`, `/register*`)
Secure user management with role-based profiles.

**Features:**
- **Sign In:** Email/password authentication
- **Registration:** New user onboarding
- **Profile Management:** User details and assignments
- **Role Assignment:** Admin-controlled role allocation
- **Session Management:** Automatic logout and re-authentication

**Key Components:**
- `AuthForm.js` - Login form
- `AuthGuard.jsx` - Route protection wrapper
- `PersonnelProfilePage.jsx` - User profile management

**Authentication Flow:**
```
User Input Credentials
    ↓
Submit to API Route
    ↓
Supabase Auth Verification
    ↓
Create User Profile
    ↓
Issue JWT Token
    ↓
Store in Session
    ↓
Redirect to Dashboard
```

---

### 9. **Offline Operations** (`/app/offline/`, `/lib/offline/`)
Seamless offline functionality with automatic sync.

**Features:**
- **Offline Page:** User-friendly offline state
- **Data Persistence:** IndexedDB storage
- **Automatic Sync:** Background sync queue
- **Conflict Resolution:** Last-write-wins strategy
- **Recovery Mechanism:** Auto-reload on connectivity

**Key Components:**
- `OfflineBanner.jsx` - Offline/online status indicator
- `OfflineSyncListener.jsx` - Automatic sync trigger
- `OfflineSyncStatus.jsx` - Sync progress display
- `syncTransactions.js` - Sync engine implementation

---

### 10. **Progressive Web App** (PWA)
Full PWA capabilities with install prompts and offline access.

**Features:**
- **Install Prompts:** Native app-like installation
- **Service Worker:** Background sync and offline support
- **Manifest:** App metadata and icons
- **Mobile Menu:** Touch-optimized navigation
- **Bottom Navigation:** PWA-style action bar

**Key Components:**
- `ServiceWorkerRegister.jsx` - Service Worker registration
- `InstallAppButton.jsx` - Installation UI
- `PwaBottomMenu.jsx` - PWA-style navigation
- `/public/sw.js` - Service Worker implementation
- `/public/manifest.webmanifest` - PWA metadata

---

## Component Structure

### Directory Organization

```
components/
├── Dashboard Components
│   ├── RoleDashboard.jsx          # Main dashboard orchestrator
│   ├── DashboardInsights.jsx      # Metrics display
│   └── DashboardTaskPanel.jsx     # Task management
│
├── Auth Components
│   ├── AuthForm.js                # Login form
│   ├── AuthGuard.jsx              # Route protection
│   └── PersonnelProfilePage.jsx   # Profile management
│
├── Fuel Transaction Components
│   ├── FuelTransactionDetail.js    # Transaction display
│   ├── FuelTransactionListReport.js # Listing and reports
│   ├── TransactionUi.js           # UI orchestration
│   ├── TransactionSuccessState.js # Confirmation
│   ├── setup.js                   # Initial setup
│   ├── before-delivery-success-alert.js
│   ├── after-delivery-success-alert.js
│   ├── operation-before.js
│   ├── operation-after.js
│   ├── review-before.js
│   └── review-after.js
│
├── Project Components
│   ├── add_new_project/
│   │   ├── ProjectUi.js           # Main project interface
│   │   ├── projectForm.js         # Form handling
│   │   ├── GeneratorDropdown.js   # Equipment selection
│   │   └── StepOne.js - StepFive.js # Wizard steps
│
├── Report Components
│   ├── reports/
│   │   ├── TransactionReportPdf.js
│   │   ├── TransactionReportPreview.js
│   │   ├── ProjectReportDocument.js
│   │   └── ProjectReportPreview.js
│
├── Resource Components
│   ├── resources/
│   │   ├── ExternalTanksResourceClient.jsx
│   │   ├── GeneratorsResourceClient.jsx
│   │   ├── PartnerDirectoryPage.jsx
│   │   └── ResourceListUi.jsx
│
├── Equipment & QR Components
│   ├── GeneratorQrScanner.js      # QR scanning
│   ├── OfflineGeneratorSelect.jsx # Offline selection
│   └── OfflineTankSelect.jsx      # Tank selection
│
├── Offline Components
│   ├── OfflineBanner.jsx          # Status indicator
│   ├── OfflineSyncListener.jsx    # Sync trigger
│   └── OfflineSyncStatus.jsx      # Progress display
│
├── PWA Components
│   ├── ServiceWorkerRegister.jsx  # SW registration
│   ├── InstallAppButton.jsx       # Install UI
│   ├── InstallAppCard.jsx         # Install card
│   └── PwaBottomMenu.jsx          # PWA navigation
│
├── Core UI Components
│   ├── AppShell.jsx               # Main layout
│   ├── Menu.js                    # Navigation menu
│   ├── StepNavigation.js          # Multi-step forms
│   ├── LoadingIndicator.jsx       # Loading state
│   ├── Footer.js                  # Footer
│   └── ProgresionBar.js           # Progress indicator
│
├── Utilities
│   ├── FormatDate.js              # Date formatting
│   ├── FormatDateShort.js         # Short date format
│   └── Toggle/                    # Toggle components
│
└── Dropdowns
    ├── ManagerDropdown.js
    ├── ProfileRoleDropdown.js
    ├── TechniciansDropdown.js
    └── tank-dropdown.js
```

### Component Communication Pattern

```
AppShell (Root Layout)
    │
    ├─ Menu (Navigation)
    │
    ├─ Route Content
    │   │
    │   └─ Feature Containers
    │       │
    │       ├─ UI Components
    │       ├─ Data Fetchers
    │       └─ State Management
    │
    ├─ AuthGuard (Protection)
    │
    ├─ OfflineSyncListener (Offline Sync)
    │
    ├─ OfflineSyncStatus (Status Display)
    │
    └─ PwaBottomMenu (PWA Navigation)
```

---

## Data Model & Database Schema

### Core Tables

#### 1. **profiles**
User account information with role assignments.

```sql
profiles:
  id: UUID (Primary Key)
  email: TEXT (Unique, Auth reference)
  full_name: TEXT
  role: TEXT (technician|manager|hire_desk|event_organizer|fuel_supplier)
  address: TEXT
  phone: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
```

**Indexes:** email, role, created_at

---

#### 2. **dashboard_tasks**
Task management for team coordination.

```sql
dashboard_tasks:
  id: UUID (Primary Key)
  title: TEXT (Required)
  description: TEXT
  priority: TEXT (low|normal|urgent, default: normal)
  status: TEXT (open|done, default: open)
  assigned_to: UUID (Foreign Key → profiles.id)
  created_by: UUID (Foreign Key → profiles.id)
  due_date: DATE
  created_at: TIMESTAMP (Auto)
  updated_at: TIMESTAMP (Auto)
```

**Policies:**
- Users can read tasks assigned to them or created by them
- Hire desk and managers can create tasks (with restrictions)
- Only assigned or creator users can update tasks

---

#### 3. **fuel_transactions** (Inferred from components)
Core fuel transaction tracking.

**Expected Schema:**
```sql
fuel_transactions:
  id: UUID (Primary Key)
  type: TEXT (delivery|return)
  project_id: UUID (Foreign Key)
  generator_id: UUID (Foreign Key)
  before_fuel_level: NUMERIC
  after_fuel_level: NUMERIC
  before_photo_url: TEXT
  after_photo_url: TEXT
  before_photo_url_local: TEXT (Offline reference)
  after_photo_url_local: TEXT (Offline reference)
  status: TEXT (pending|complete|verified)
  created_by: UUID (Foreign Key → profiles.id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
```

---

#### 4. **projects**
Event projects with fuel operations.

**Expected Schema:**
```sql
projects:
  id: UUID (Primary Key)
  name: TEXT
  description: TEXT
  start_date: DATE
  end_date: DATE
  location: TEXT
  external_tank_id: UUID (Foreign Key)
  created_by: UUID (Foreign Key → profiles.id)
  status: TEXT (active|completed|archived)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
```

---

#### 5. **generators**
Equipment registry.

**Expected Schema:**
```sql
generators:
  id: UUID (Primary Key)
  name: TEXT
  serial_number: TEXT (Unique)
  model: TEXT
  capacity: NUMERIC
  location: TEXT
  qr_code: TEXT (Unique identifier)
  project_id: UUID (Foreign Key)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
```

---

#### 6. **external_tanks**
External fuel storage.

**Expected Schema:**
```sql
external_tanks:
  id: UUID (Primary Key)
  name: TEXT
  capacity: NUMERIC
  fuel_supplier_id: UUID (Foreign Key)
  location: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
```

---

#### 7. **financial_transactions** (Referenced in navigation)
Cost and billing tracking.

**Expected Schema:**
```sql
financial_transactions:
  id: UUID (Primary Key)
  amount: NUMERIC
  currency: TEXT
  category: TEXT
  description: TEXT
  fuel_transaction_id: UUID (Foreign Key, Optional)
  project_id: UUID (Foreign Key)
  created_by: UUID (Foreign Key → profiles.id)
  created_at: TIMESTAMP
```

---

### Row-Level Security (RLS) Implementation

**Example: dashboard_tasks RLS Policies**

```sql
-- Users can read their dashboard tasks
CREATE POLICY "Users can read their dashboard tasks"
  ON dashboard_tasks FOR SELECT
  USING (
    assigned_to = auth.uid() OR created_by = auth.uid()
  );

-- Hire desk and managers can create tasks
CREATE POLICY "Hire desk and managers can create dashboard tasks"
  ON dashboard_tasks FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM profiles creator
        JOIN profiles assignee ON assignee.id = assigned_to
        WHERE creator.id = auth.uid()
          AND creator.role = 'hire_desk'
          AND assignee.role IN ('manager', 'technician')
      )
      OR EXISTS (
        SELECT 1 FROM profiles creator
        JOIN profiles assignee ON assignee.id = assigned_to
        WHERE creator.id = auth.uid()
          AND creator.role = 'manager'
          AND assignee.role = 'technician'
      )
    )
  );

-- Assigned users can complete tasks
CREATE POLICY "Assigned users can complete dashboard tasks"
  ON dashboard_tasks FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid())
  WITH CHECK (assigned_to = auth.uid() OR created_by = auth.uid());
```

---

### Data Relationships

```
profiles (1)
    ├─ (N)─ dashboard_tasks (assigned_to, created_by)
    ├─ (N)─ fuel_transactions (created_by)
    ├─ (N)─ projects (created_by)
    └─ (N)─ financial_transactions (created_by)

projects (1)
    ├─ (N)─ fuel_transactions
    ├─ (N)─ financial_transactions
    ├─ (1)─ external_tanks
    └─ (N)─ generators

generators (1)
    └─ (N)─ fuel_transactions

external_tanks (1)
    ├─ (N)─ projects
    ├─ (N)─ fuel_transactions
    └─ (1)─ fuel_suppliers
```

---

## API Architecture

### API Routes

#### **1. User Creation** (`POST /api/create-user`)
Creates new user accounts with role assignment.

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "technician",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

**Response (Success):**
```json
{
  "userId": "uuid-here",
  "email": "john@example.com",
  "role": "technician",
  "created": true
}
```

**Response (Error):**
```json
{
  "error": "Invalid user role."
}
```

**Validation:**
- Full name required and non-empty
- Valid email format
- Password minimum 8 characters
- Role must be in allowed set: `technician`, `manager`, `hire_desk`, `event_organizer`, `fuel_supplier`
- All fields required

---

#### **2. Supabase API Calls**
Direct Supabase client calls for CRUD operations.

**Pattern:**
```javascript
// Read operations
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value);

// Write operations
const { data, error } = await supabase
  .from('table_name')
  .insert({ field: value })
  .select();

// Real-time subscriptions
supabase
  .channel('dashboard_tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'dashboard_tasks' },
    (payload) => { /* handle change */ }
  )
  .subscribe();
```

---

### Authentication Flow

```
User Credentials
    ↓
[POST] /api/create-user or Supabase Auth
    ↓
Verify email & password
    ↓
Create auth.users record
    ↓
Create profiles record with role
    ↓
Issue JWT token
    ↓
Store in session/localStorage
    ↓
Subsequent requests include JWT
    ↓
Supabase validates JWT
    ↓
RLS policies applied
```

---

### Real-Time Subscriptions

```javascript
// Subscribe to task changes
const subscription = supabase
  .channel('dashboard_tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'dashboard_tasks'
  }, (payload) => {
    console.log('Task updated:', payload);
    // Update UI in real-time
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## User Roles & Permissions

### 1. **Technician**
Field worker executing fuel operations.

**Dashboard:** `/operations/dashboard/technician`

**Permissions:**
- ✅ Add fuel transactions (deliveries & returns)
- ✅ View assigned projects
- ✅ Capture transaction evidence (photos)
- ✅ Access generators and tanks
- ✅ Submit transaction reports
- ❌ Cannot create projects
- ❌ Cannot assign tasks
- ❌ Cannot manage other users

**Key Features:**
- Transaction creation and evidence collection
- Equipment QR code scanning
- Project-based fuel tracking
- Dashboard with today's assigned work

**Quick Actions:**
- "Add transaction" → Start fuel transfer
- "Projects" → View assigned work
- "Generators" → Equipment lookup
- "Deliveries/Returns" → View transaction history

---

### 2. **Manager**
Team leadership and oversight.

**Dashboard:** `/operations/dashboard/manager`

**Permissions:**
- ✅ Oversee technician work
- ✅ Create tasks for technicians
- ✅ View project summaries
- ✅ Access analytics and reports
- ✅ Approve transactions (if configured)
- ❌ Cannot create projects (organizer only)
- ❌ Cannot access financial details

**Key Features:**
- Task assignment system
- Team performance dashboard
- Real-time transaction monitoring
- Report generation

---

### 3. **Hire Desk**
Personnel and resource coordination.

**Permissions:**
- ✅ Create tasks for managers and technicians
- ✅ View personnel assignments
- ✅ Manage resource allocation
- ✅ Partner directory access
- ❌ Cannot view financial data
- ❌ Cannot modify projects

**Key Features:**
- Personnel profiles
- Task coordination
- Resource assignment
- Partner/supplier directory

---

### 4. **Event Organizer**
Overall event and project management.

**Dashboard:** `/operations/dashboard/organizer`

**Permissions:**
- ✅ Create and manage projects
- ✅ View all reports
- ✅ Access financial tracking
- ✅ Project oversight
- ✅ Generate comprehensive reports
- ✅ Assign resources to projects
- ✅ View analytics

**Key Features:**
- Project creation and management
- Budget tracking
- Comprehensive reporting
- Event dashboard with all metrics

---

### 5. **Fuel Supplier**
Supplier account and delivery management.

**Permissions:**
- ✅ View delivery assignments
- ✅ Update delivery status
- ✅ Access billing information
- ✅ View historical deliveries
- ❌ Cannot create projects
- ❌ Cannot manage other suppliers

**Key Features:**
- Delivery tracking
- Billing dashboard
- Supplier profile management
- Delivery history and reports

---

### Permission Matrix

| Feature | Technician | Manager | Hire Desk | Organizer | Supplier |
|---------|-----------|---------|-----------|-----------|----------|
| Add Transactions | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Transactions | ✅ | ✅ | ❌ | ✅ | ✅ |
| Create Projects | ❌ | ❌ | ❌ | ✅ | ❌ |
| Assign Tasks | ❌ | ✅ | ✅ | ✅ | ❌ |
| View Reports | Limited | ✅ | ❌ | ✅ | ✅ |
| Financial Access | ❌ | ❌ | ❌ | ✅ | ✅ |
| Equipment QR | ✅ | ❌ | ❌ | ❌ | ❌ |
| User Management | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## Offline-First Architecture

### Core Concept
Users can continue working seamlessly even without internet connectivity, with automatic data synchronization when connectivity is restored.

### Implementation Strategy

**1. Offline Data Storage (IndexedDB)**

```javascript
// Store transaction locally
const storeTransaction = async (transaction) => {
  const db = await openDB('fuelflo-db');
  await db.put('transactions', transaction);
};

// Retrieve for display
const getLocalTransactions = async () => {
  const db = await openDB('fuelflo-db');
  return db.getAll('transactions');
};
```

**2. Optimistic UI Updates**

```javascript
// Update UI immediately
setTransactionList([...list, newTransaction]);

// Queue for sync
addToSyncQueue({ action: 'add_transaction', data: newTransaction });

// Sync when online
if (navigator.onLine) {
  syncTransactions();
}
```

**3. Automatic Sync Mechanism** (`OfflineSyncListener.jsx`)

```javascript
// Listen for online event
window.addEventListener('online', () => {
  console.log('Back online → syncing...');
  syncTransactions();
});
```

**4. Service Worker Integration** (`/public/sw.js`)

```javascript
// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});
```

**5. Offline Recovery Script** (Embedded in `layout.js`)

```javascript
// Auto-detect online status
window.addEventListener('offline', markOffline);
window.addEventListener('online', recoverOnline);

// Auto-reload on chunk errors (missing JS files)
window.addEventListener('error', recoverChunkError, true);
```

### Offline Workflow

```
User Creates Transaction Offline
    ↓
UI Updated Immediately (Optimistic)
    ↓
Data Stored in IndexedDB
    ↓
Added to Sync Queue
    ↓
App Shows "Pending" Status
    ↓
Internet Restored
    ↓
OfflineSyncListener Triggers
    ↓
syncTransactions() Executes
    ↓
Queued Items Sent to Supabase
    ↓
Conflict Resolution (Last-write-wins)
    ↓
Local Data Updated with Server Version
    ↓
UI Refreshed
    ↓
"Synced" Status Shown
```

### Data Consistency

**Conflict Resolution Strategy:**
- **Last-Write-Wins (LWW):** The most recent timestamp version is authoritative
- **No Merging:** Partial merges could cause data integrity issues
- **User Notification:** Users are informed of conflicts with option to retry

**Verification:**
- After sync, data is re-fetched from server
- UI reflects server state (source of truth)
- Local cache is updated with server values

### Offline Features by Module

| Feature | Offline Support |
|---------|-----------------|
| View Transactions | ✅ Full (cached) |
| Create Transactions | ✅ Queued sync |
| View Projects | ✅ Full (cached) |
| View Equipment | ✅ Full (cached) |
| Edit Transactions | ⚠️ Limited (queued) |
| Generate Reports | ✅ Full (from cache) |
| View Profile | ✅ Full (cached) |
| Create New Project | ⚠️ Offline creation, sync on return |

---

## Security & Authentication

### Authentication System

**Provider:** Supabase Auth with JWT tokens

**Features:**
- Email/password authentication
- JWT token management
- Role-based session data
- Automatic token refresh

**Flow:**
```
Credentials → Supabase Auth → JWT Issued → Stored in Session
    ↓
All API Calls Include JWT
    ↓
Supabase Validates JWT
    ↓
User ID Extracted
    ↓
RLS Policies Applied
    ↓
Row-Level Data Filtered
```

---

### Row-Level Security (RLS)

All database tables have RLS enabled with specific policies:

**Principle:** Users can only access data relevant to their role and assignments.

**Examples:**

**Dashboard Tasks RLS:**
```sql
-- Users see only their tasks
SELECT * FROM dashboard_tasks
WHERE assigned_to = auth.uid() OR created_by = auth.uid();
```

**Fuel Transactions RLS (Implied):**
```sql
-- Technicians see their transactions
-- Managers see their team's transactions
-- Organizers see all transactions
```

---

### Data Protection

**In Transit:**
- HTTPS/TLS 1.3 for all network communication
- Supabase uses encrypted connections

**At Rest:**
- PostgreSQL with encryption support
- IndexedDB uses browser security model
- No sensitive data in localStorage

**User Passwords:**
- Minimum 8 characters (enforced)
- Hashed by Supabase Auth (bcrypt)
- Never stored in application

---

### API Security

**Protected Endpoints:**
```javascript
// Auth-protected API route
export async function POST(request) {
  // Verify JWT present
  const token = request.headers.get('authorization');
  
  // Validate user role
  const user = getAuthUser(token);
  
  // Enforce role-based checks
  if (!ALLOWED_ROLES.has(user.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Process request
}
```

---

### Input Validation

**Server-Side Validation (API Routes):**
```javascript
// Email validation
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return Response.json({ error: 'Invalid email' }, { status: 400 });
}

// Role validation
if (!ALLOWED_ROLES.has(role)) {
  return Response.json({ error: 'Invalid role' }, { status: 400 });
}

// Password requirements
if (password.length < 8) {
  return Response.json({ error: 'Password too short' }, { status: 400 });
}
```

---

### Role Enforcement

**Backend Enforcement:**
- Supabase RLS policies enforce permissions
- JWT claims include role
- API routes validate role before processing

**Frontend Enforcement:**
- AuthGuard wrapper checks authentication
- Role-based navigation prevents UI access
- Feature gates hide unauthorized actions

---

## Deployment & Infrastructure

### Recommended Architecture

```
Internet → Vercel CDN
    ↓
Vercel Edge Functions (API Routes)
    ↓
Supabase API
    ↓
PostgreSQL Database
```

### Deployment Steps

**1. Environment Setup**

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**2. Build Process**

```bash
npm run build        # Production build
npm run lint         # Code quality check
npm run format       # Code formatting
```

**3. Deployment**

```bash
# Via Vercel (recommended)
vercel deploy

# Or manual deployment
npm run start        # Start production server
```

### Supabase Configuration

**Database Setup:**
1. Create PostgreSQL instance in Supabase
2. Run migration scripts to create tables
3. Enable RLS on all tables
4. Configure authentication settings

**Authentication:**
1. Enable email/password provider
2. Configure redirect URLs
3. Set JWT expiration policies
4. Configure password reset emails

**Realtime Subscriptions:**
1. Enable Realtime in Supabase settings
2. Configure publication policies
3. Set up subscriptions in components

### Monitoring & Logging

**Key Metrics:**
- API response times
- Database query performance
- Authentication failure rates
- Offline sync success rates
- Error logs and stack traces

**Tools:**
- Supabase dashboard for database metrics
- Vercel analytics for deployment metrics
- Browser console for client-side debugging

---

## Performance Considerations

### Frontend Optimization

**1. Code Splitting**
```javascript
// Route-based code splitting (built into Next.js)
dynamic(() => import('@/components/FuelTransactionDetail'), {
  loading: () => <LoadingIndicator />,
})
```

**2. Image Optimization**
- Responsive image serving
- Format conversion (WebP support)
- Lazy loading for off-screen images

**3. Caching Strategy**
- Service Worker caching
- Browser cache headers
- IndexedDB for application data
- SessionStorage for temporary state

**4. Bundle Size Management**
```javascript
// Use tree-shaking compatible imports
import { CheckCircle2 } from 'lucide-react'; // Only imports used icon

// Avoid:
import * as Icons from 'lucide-react'; // Imports entire library
```

### Database Optimization

**1. Query Optimization**
- Index frequently queried columns
- Use pagination for large result sets
- Select only needed columns

**2. Connection Pooling**
- Supabase handles connection pooling
- Configured for optimal performance

**3. Materialized Views** (for reports)
- Pre-calculated aggregations
- Faster report generation

### Network Optimization

**1. Request Batching**
- Combine multiple queries
- Reduce round-trip count

**2. Compression**
- GZIP for API responses
- Minified JavaScript

**3. CDN Usage**
- Vercel Edge Network for static assets
- Geographic distribution for low latency

### Monitoring Performance

**Key Metrics:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- API response times

**Tools:**
- Vercel Analytics
- Lighthouse audits
- Supabase performance dashboard

---

## Future Roadmap

### Phase 1: Current State ✅
- [x] Core fuel transaction tracking
- [x] Offline-first architecture
- [x] Role-based access control
- [x] Project management
- [x] Basic reporting

### Phase 2: Enhanced Features (Next 3 months)
- [ ] Advanced analytics dashboard with charts and trends
- [ ] Machine learning-based anomaly detection
- [ ] Real-time team collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering

### Phase 3: Platform Expansion (3-6 months)
- [ ] Multi-language support
- [ ] Advanced permission system (custom roles)
- [ ] Integration with third-party fuel suppliers
- [ ] API marketplace for partner integrations
- [ ] White-label support

### Phase 4: Enterprise Features (6+ months)
- [ ] Advanced reporting with custom fields
- [ ] Audit logging and compliance tracking
- [ ] Enterprise SSO (OAuth, SAML)
- [ ] Advanced security features (2FA, IP whitelisting)
- [ ] Premium support tiers

### Technical Debt & Improvements
- [ ] Comprehensive test coverage (unit, integration, E2E)
- [ ] TypeScript migration
- [ ] Component documentation (Storybook)
- [ ] Performance monitoring dashboard
- [ ] Database migration tooling
- [ ] API documentation (OpenAPI/Swagger)

### Scalability Improvements
- [ ] Caching layer (Redis)
- [ ] Load balancing configuration
- [ ] Database replication
- [ ] CDN optimization
- [ ] Rate limiting policies

---

## Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] Authentication configured
- [ ] HTTPS certificates valid
- [ ] DNS configured correctly
- [ ] Email templates configured
- [ ] Error monitoring set up
- [ ] Database backups enabled

### Post-Deployment

- [ ] Smoke tests passed
- [ ] Performance baselines met
- [ ] Error rates acceptable
- [ ] User acceptance testing complete
- [ ] Documentation updated
- [ ] Team trained on new features
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

---

## Conclusion

FuelFlo represents a modern approach to field operations management, combining offline-first architecture with real-time synchronization. The application is designed for reliability, scalability, and user experience, with comprehensive role-based access control ensuring data security and operational integrity.

The technology stack is production-ready, with mature frameworks (Next.js, React, Supabase) providing stability and community support. The offline-first approach ensures field operations continue seamlessly regardless of connectivity, while the PWA technology enables deployment without app store friction.

Future enhancements will focus on advanced analytics, mobile expansion, and enterprise features, positioning FuelFlo as a comprehensive platform for fuel operations management.

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2026 | System Generated | Initial comprehensive architecture report |

---

**Contact & Support**

For questions about this architecture or project specifics:
- GitHub: OlgaGoryszewska/fuelflo-demo-app-router
- Documentation: See ARCHITECTURE_REPORT.md
- Issues: GitHub Issues

