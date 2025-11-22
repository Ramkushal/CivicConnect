// Mock Data based on database.md schema

// 1. Users (Citizens and Officers)
export const mockUsers = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 (555) 123-4567',
    role: 'citizen',
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    created_at: '2023-01-15T08:00:00Z',
  },
  {
    id: 'u2',
    name: 'Sarah Smith',
    email: 'sarah.s@example.com',
    phone: '+1 (555) 987-6543',
    role: 'citizen',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    created_at: '2023-03-10T09:30:00Z',
  },
  {
    id: 'o1',
    name: 'Officer Sarah Jenkins',
    email: 's.jenkins@city.gov',
    role: 'officer',
    profile_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    area: 'Downtown',
    created_at: '2022-11-01T08:00:00Z',
  },
  {
    id: 'o2',
    name: 'Officer Mike Ross',
    email: 'm.ross@city.gov',
    role: 'officer',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    area: 'North Avenue',
    created_at: '2022-11-05T08:00:00Z',
  }
];

// 2. Officers (Extended details linked to Users)
export const mockOfficers = [
  {
    id: 'off1',
    user_id: 'o1',
    designation: 'Senior Inspector',
    department: 'Road Maintenance',
    area_of_responsibility: 'Downtown Sector 1-4',
    ward: 'Ward 10',
    area: 'Indiranagar',
    active: true,
    stats: { solved: 142, rating: 4.8, avgTime: '2d' } // Derived stats for UI
  },
  {
    id: 'off2',
    user_id: 'o2',
    designation: 'Field Supervisor',
    department: 'Waste Management',
    area_of_responsibility: 'North Avenue Zone',
    ward: 'Ward 5',
    area: 'North Avenue',
    active: true,
    stats: { solved: 98, rating: 4.5, avgTime: '1d' }
  }
];

// 3. Issues
export const mockIssues = [
  {
    id: 1,
    user_id: 'u1',
    category: 'Road',
    title: 'Deep Pothole on Main St', // Added title for UI compatibility
    description: 'A very deep pothole causing traffic slowdowns near the market entrance.',
    ai_summary: 'Pothole reported on Main St, potential traffic hazard.',
    status: 'Pending',
    priority: 'High',
    location: 'Downtown Area', // Simplified for UI
    address: '123 Main St, Downtown',
    distance: '0.5 km', // UI helper
    timestamp: '2 hours ago', // UI helper
    created_at: '2023-10-28T10:00:00Z',
    updated_at: '2023-10-28T10:00:00Z',
    upvotes: 12, // UI helper
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    user_id: 'u2',
    category: 'Waste',
    title: 'Garbage Pileup',
    description: 'Garbage has not been collected for 3 days.',
    ai_summary: 'Uncollected garbage reported at North Avenue.',
    status: 'In Progress',
    priority: 'Medium',
    location: 'North Avenue',
    address: '45 North Ave, Block B',
    distance: '1.2 km',
    timestamp: '5 hours ago',
    created_at: '2023-10-28T07:00:00Z',
    updated_at: '2023-10-28T08:30:00Z',
    upvotes: 8,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    photo_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    user_id: 'u1',
    category: 'Water',
    title: 'Leaking Pipe',
    description: 'Water pipe leaking significantly on the sidewalk.',
    ai_summary: 'Water leakage reported at West Park.',
    status: 'Solved',
    priority: 'High',
    location: 'West Park',
    address: 'West Park Entrance',
    distance: '2.0 km',
    timestamp: '1 day ago',
    created_at: '2023-10-27T14:00:00Z',
    updated_at: '2023-10-28T09:00:00Z',
    upvotes: 25,
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=400',
    photo_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    user_id: 'u2',
    category: 'Electricity',
    title: 'Streetlight Broken',
    description: 'Streetlight blinking and then went off completely.',
    ai_summary: 'Broken streetlight reported in Residential Block C.',
    status: 'Pending',
    priority: 'Low',
    location: 'Residential Block C',
    address: 'Block C, Street 4',
    distance: '0.8 km',
    timestamp: '3 hours ago',
    created_at: '2023-10-28T09:00:00Z',
    updated_at: '2023-10-28T09:00:00Z',
    upvotes: 5,
    image: 'https://images.unsplash.com/photo-1562619425-c307bb83bc42?auto=format&fit=crop&q=80&w=400',
    photo_url: 'https://images.unsplash.com/photo-1562619425-c307bb83bc42?auto=format&fit=crop&q=80&w=400',
  }
];

// 4. Assignments
export const mockAssignments = [
  {
    id: 'a1',
    issue_id: 2,
    officer_id: 'off2',
    assigned_at: '2023-10-28T08:00:00Z',
    status: 'in_progress',
    status_note: 'Crew dispatched for cleanup.'
  },
  {
    id: 'a2',
    issue_id: 3,
    officer_id: 'off1', // Assuming cross-department assignment or just mock data
    assigned_at: '2023-10-27T15:00:00Z',
    resolved_at: '2023-10-28T09:00:00Z',
    status: 'resolved',
    status_note: 'Pipe repaired and tested.'
  }
];

// 5. Feedback
export const mockFeedback = [
  {
    id: 'f1',
    issue_id: 3,
    user_id: 'u1',
    rating: 5,
    comment: 'Very fast response, thank you!',
    created_at: '2023-10-28T10:00:00Z'
  }
];

// 6. Notifications
export const mockNotifications = [
  {
    id: 'n1',
    user_id: 'u1',
    title: 'Issue Resolved',
    message: 'Your report "Leaking Pipe" has been resolved.',
    type: 'issue_update',
    is_read: false,
    created_at: '2023-10-28T09:05:00Z'
  },
  {
    id: 'n2',
    user_id: 'u2',
    title: 'Status Update',
    message: 'Your report "Garbage Pileup" is now In Progress.',
    type: 'issue_update',
    is_read: true,
    created_at: '2023-10-28T08:00:00Z'
  }
];

// 7. Activity Logs
export const mockActivityLogs = [
  {
    id: 'l1',
    user_id: 'u1',
    action: 'Reported Issue',
    entity: 'issue',
    entity_id: 1,
    timestamp: '2023-10-28T10:00:00Z'
  },
  {
    id: 'l2',
    user_id: 'o2',
    action: 'Updated Status',
    entity: 'issue',
    entity_id: 2,
    timestamp: '2023-10-28T08:00:00Z'
  }
];

// 8. Votes
export const mockVotes = [
  { issue_id: 1, user_id: 'u1', vote_type: 'up' },
  { issue_id: 3, user_id: 'u1', vote_type: 'up' }
];

// 9. Comments
export const mockComments = [
  {
    id: 'c1',
    issue_id: 1,
    user_id: 'u2',
    text: 'I saw this too, it is getting worse.',
    created_at: '2023-10-28T10:30:00Z',
    users: { name: 'Sarah Smith', role: 'citizen', profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: 'c2',
    issue_id: 1,
    user_id: 'o1',
    text: 'We have dispatched a team to inspect.',
    created_at: '2023-10-28T11:00:00Z',
    users: { name: 'Officer Sarah Jenkins', role: 'officer', profile_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' }
  }
];

// 10. Resolutions
export const mockResolutions = [
  {
    id: 'r1',
    issue_id: 3,
    officer_id: 'o1',
    photo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'Pipe has been replaced and sealed.',
    created_at: '2023-10-28T09:00:00Z'
  }
];

// 11. Status History
export const mockStatusHistory = [
  { issue_id: 1, status: 'Pending', changed_at: '2023-10-28T10:00:00Z' },
  { issue_id: 2, status: 'Pending', changed_at: '2023-10-28T07:00:00Z' },
  { issue_id: 2, status: 'In Progress', changed_at: '2023-10-28T08:00:00Z' },
  { issue_id: 3, status: 'Pending', changed_at: '2023-10-27T14:00:00Z' },
  { issue_id: 3, status: 'Solved', changed_at: '2023-10-28T09:00:00Z' }
];
