export const COMPANY_PROFILE = `TrackPulse Employee Tracking Assistant

Welcome to the TrackPulse Employee Monitoring Platform.

I can help organizations track employee activity, monitor locations, and manage field workforce operations.

Features Available

- User Registration
- User Login
- Supervisor Login
- Live Location Tracking
- Real-Time Monitoring
- Video Update Sharing
- Google Maps Integration
- Employee Activity Tracking
- Date Range Filtering
- Employee Management

User Module

Employees can:

* Register an Account
* Login Securely
* Access Personal Dashboard
* Start Live Location Tracking
* Send Video Updates
* Share Location Continuously
* Logout to Stop Tracking

How does user tracking work?

After login, the application automatically starts live location tracking. The user's location and video updates are securely shared with the assigned supervisor until logout.

Can users stop tracking?

Yes. Tracking automatically stops when the user logs out from the application.

Supervisor Module

Supervisors can:

* Login Securely
* Monitor Employee Activity
* View Employee Login Records
* Track Live Locations
* Open Google Maps Location Links
* View Activity Date and Time
* Filter Data by Employee Name
* Filter Data by Date Range
* Manage Employee Accounts

Employee Information Available

Supervisors can view:

* Employee Name
* Login Time
* Logout Time
* Current Location
* Google Maps URL
* Video Updates
* Tracking Status

How does location monitoring work?

TrackPulse continuously receives location updates from logged-in employees and displays them in the supervisor dashboard.

Google Maps Integration

Each location update includes a Google Maps URL that allows supervisors to instantly open and view the employee's location.

Filtering Options

Supervisors can search records using:

* Employee Name
* Start Date
* End Date
* Custom Date Range

Employee Management

If an employee leaves the organization, supervisors can:

* Delete Employee Account
* Remove Login Credentials
* Disable Access
* Manage User Records

Frequently Asked Questions

Q: Does tracking start automatically?
A: Yes. Tracking starts once the employee logs in.

Q: Does tracking stop automatically?
A: Yes. Tracking stops when the employee logs out.

Q: Can supervisors see historical records?
A: Yes. All tracking information can be filtered and viewed using date ranges.

Q: Can supervisors view locations on Google Maps?
A: Yes. Every location update includes a Google Maps link.

Q: Can employee accounts be removed?
A: Yes. Supervisors can delete employee login credentials when required.

Benefits

- Real-Time Employee Monitoring
- Live Location Tracking
- Google Maps Integration
- Video-Based Updates
- Workforce Management
- Activity History Tracking
- Easy Employee Administration
- Date Range Reporting
- Secure Login System
- Mobile Friendly

Ask me about employee registration, live tracking, supervisor dashboard, Google Maps locations, video updates, or employee account management.`

export const TVH_STATS = [
  {
    n: 'LIVE',
    l: 'Location Tracking',
    icon: 'bi bi-lightning-charge-fill',
    color: '#3B82F6',
  },
  {
    n: 'GPS',
    l: 'Google Maps',
    icon: 'bi bi-geo-alt-fill',
    color: '#F97316',
  },
  {
    n: 'VIDEO',
    l: 'Status Updates',
    icon: 'bi bi-camera-video-fill',
    color: '#10B981',
  },
  {
    n: '24/7',
    l: 'Monitoring',
    icon: 'bi bi-shield-check',
    color: '#EAB308',
  },
]

export const TVH_CLIENTS = [
  'Field Employees',
  'Sales Teams',
  'Service Engineers',
  'Supervisors',
  'Managers',
  'Operations Teams',
  'Logistics Teams',
  'Construction Teams',
  'Organizations',
]

export const TVH_PARTNERS = [
  'Businesses',
  'Enterprises',
  'Manufacturing',
  'Healthcare',
  'Logistics',
  'Service Providers',
]

export const COURSES = [
  {
    icon: 'bi bi-geo-alt-fill',
    color: '#3B82F6',
    name: 'Live Tracking',
    dur: 'Real-Time',
    desc: 'Monitor employee location continuously',
  },
  {
    icon: 'bi bi-shield-lock-fill',
    color: '#F59E0B',
    name: 'Employee Login',
    dur: 'Secure',
    desc: 'Authentication and access control',
  },
  {
    icon: 'bi bi-camera-video-fill',
    color: '#8B5CF6',
    name: 'Video Updates',
    dur: 'Instant',
    desc: 'Share field activity videos',
  },
  {
    icon: 'bi bi-bar-chart-fill',
    color: '#10B981',
    name: 'Reports',
    dur: 'Filtered',
    desc: 'Search by name and date range',
  },
  {
    icon: 'bi bi-layers-fill',
    color: '#EC4899',
    name: 'Supervisor Dashboard',
    dur: 'Advanced',
    desc: 'Monitor all employee activities',
  },
  {
    icon: 'bi bi-cpu-fill',
    color: '#EF4444',
    name: 'GPS Tracking',
    dur: 'Live',
    desc: 'Accurate employee location monitoring',
  },
  {
    icon: 'bi bi-cloud-fill',
    color: '#06B6D4',
    name: 'Google Maps',
    dur: 'Integrated',
    desc: 'Open employee location instantly',
  },
  {
    icon: 'bi bi-shield-fill-check',
    color: '#14B8A6',
    name: 'User Management',
    dur: 'Controlled',
    desc: 'Delete and manage employee accounts',
  },
]

export const NEXION_PLANS = [
  {
    name: 'STARTER',
    price: 'Basic',
    unit: '',
    hot: false,
    cta: 'Get Started',
    feats: [
      'User Registration',
      'User Login',
      'Live Tracking',
      'Location History',
      'Google Maps Link',
    ],
  },
  {
    name: 'GROWTH',
    price: 'Professional',
    unit: '',
    hot: true,
    cta: 'Most Popular',
    feats: [
      'Everything in Starter',
      'Video Updates',
      'Supervisor Dashboard',
      'Date Filters',
      'Advanced Monitoring',
    ],
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    unit: '',
    hot: false,
    cta: 'Contact Sales',
    feats: [
      'Unlimited Employees',
      'Custom Reports',
      'Organization Management',
      'Priority Support',
      'Custom Integrations',
    ],
  },
]

export const CONTACT = {
  phone1: '+91 9629600230',
  phone2: '+91 9003530230',
  email: 'technovahubcareer@gmail.com',
  website: 'https://technovahub.in',
  address: 'No.48 Lawspet Main Road, Puducherry - 605008',
  whatsapp: 'https://wa.me/919629600230',
}
