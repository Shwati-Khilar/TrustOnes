export const notificationStats = [
  {
    title: "Unread Alerts",
    value: 0,
    subtitle: "Need your attention",
    icon: "🔔",
  },
  {
    title: "High Priority",
    value: 0,
    subtitle: "Important active alerts",
    icon: "⚠️",
  },
  {
    title: "Deadline Alerts",
    value: 1,
    subtitle: "Upcoming milestone due dates",
    icon: "⏰",
  },
  {
    title: "Payment Updates",
    value: 2,
    subtitle: "Funding and wallet changes",
    icon: "💰",
  },
];

export const notifications = [
  {
    id: 1,
    type: "Invite",
    priority: "High",
    title: "New project invite received",
    project: "E-Commerce Landing Page",
    description:
      "Rahul Mehta invited you to work on an E-Commerce Landing Page with an estimated budget of ₹18,000.",
    action: "View Invite",
    time: "2 hours ago",
    color: "blue",
  },
  {
    id: 2,
    type: "Payment",
    priority: "High",
    title: "Milestone funded",
    project: "Backend API Integration",
    description:
      "Milestone has been funded and is ready for submission.",
    action: "Submit Work",
    time: "4 hours ago",
    color: "green",
  },
  {
    id: 3,
    type: "Deadline",
    priority: "Medium",
    title: "Deadline approaching",
    project: "Backend API Integration",
    description:
      "Milestone deadline is tomorrow. Submit before due date.",
    action: "Open Milestone",
    time: "Today",
    color: "yellow",
  },
  {
    id: 4,
    type: "Message",
    priority: "Medium",
    title: "New message from client",
    project: "Backend API Integration",
    description:
      "Cara Wilson sent a message regarding API endpoints.",
    action: "Open Chat",
    time: "Today",
    color: "purple",
  },
  {
    id: 5,
    type: "Revision",
    priority: "Medium",
    title: "Revision requested",
    project: "Healthcare Appointment UI",
    description:
      "Client requested changes in dashboard UI milestone.",
    action: "Review Request",
    time: "Yesterday",
    color: "orange",
  },
  {
    id: 6,
    type: "Dispute",
    priority: "High",
    title: "Dispute moved to admin review",
    project: "Healthcare Appointment UI",
    description:
      "Your dispute is now under admin review.",
    action: "View Dispute",
    time: "Yesterday",
    color: "red",
  },
  {
    id: 7,
    type: "Wallet",
    priority: "Low",
    title: "Milestone amount released",
    project: "Dashboard Polish",
    description:
      "₹7,500 has been released to your wallet.",
    action: "Open Wallet",
    time: "2 days ago",
    color: "wallet",
  },
  {
    id: 8,
    type: "Review",
    priority: "Low",
    title: "New client review received",
    project: "TrustOnes Client Portal",
    description:
      "Cara Wilson gave you a 5-star review.",
    action: "View Review",
    time: "3 days ago",
    color: "review",
  },
];