// Article data structure and sample data
export interface Article {
  id: number
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  heroImage?: string
  content?: {
    introduction: string
    sections: {
      title: string
      content: string
    }[]
    conclusion: string
  }
}

export const articles: Article[] = [
  {
    id: 1,
    title: "Cybersecurity Essentials Every Developer Should Know",
    description: "Learn the fundamental security practices that every developer should implement to protect their applications and users.",
    date: "April 13, 2025",
    author: "Admin",
    category: "Technology",
    tags: ["Technology", "Security"],
    content: {
      introduction: "In today's digital landscape, cybersecurity is not just a concern for IT departments—it's a fundamental responsibility for every developer. As we build applications that handle sensitive data and serve millions of users, understanding and implementing security best practices becomes crucial.",
      sections: [
        {
          title: "Authentication & Authorization",
          content: "The foundation of any secure application lies in robust authentication and authorization mechanisms. Implement multi-factor authentication (MFA) wherever possible, use strong password policies, and never store passwords in plain text.\n\n• Use bcrypt or similar for password hashing\n• Implement JWT tokens with proper expiration\n• Use OAuth 2.0 for third-party authentication\n• Implement role-based access control (RBAC)"
        },
        {
          title: "Data Protection",
          content: "Protecting user data should be your top priority. This includes both data at rest and data in transit.\n\n• Encrypt sensitive data using AES-256\n• Use HTTPS for all communications\n• Implement proper input validation and sanitization\n• Use parameterized queries to prevent SQL injection"
        },
        {
          title: "Secure Development Practices",
          content: "Security should be built into your development process from the beginning, not added as an afterthought.\n\n• Follow the principle of least privilege\n• Keep dependencies updated and scan for vulnerabilities\n• Implement proper error handling without exposing sensitive information\n• Use security headers and CORS policies"
        }
      ],
      conclusion: "Remember, security is an ongoing process, not a one-time implementation. Stay updated with the latest security trends and continuously improve your application's security posture."
    }
  },
  {
    id: 2,
    title: "The Future of Work: Remote-First Teams and Digital Tools",
    description: "Explore how remote work is reshaping the tech industry and the tools that are making it possible.",
    date: "April 12, 2025",
    author: "Admin",
    category: "Technology",
    tags: ["Technology", "Work"],
    content: {
      introduction: "The global shift to remote work has fundamentally changed how we think about productivity, collaboration, and work-life balance. As we move forward, remote-first approaches are becoming the new standard for tech companies worldwide.",
      sections: [
        {
          title: "The Remote-First Advantage",
          content: "Remote-first companies are discovering significant advantages in terms of talent acquisition, employee satisfaction, and operational efficiency.\n\n• Access to global talent pool\n• Reduced overhead costs\n• Improved work-life balance for employees\n• Increased productivity and focus"
        },
        {
          title: "Essential Digital Tools",
          content: "The right tools can make or break a remote team's success. Here are the essential categories every remote team needs:\n\n• Communication: Slack, Microsoft Teams, Discord\n• Project Management: Asana, Trello, Jira\n• Video Conferencing: Zoom, Google Meet, Whereby\n• Document Collaboration: Google Workspace, Notion, Confluence"
        }
      ],
      conclusion: "The future of work is remote-first, and companies that adapt to this new reality will have a significant competitive advantage in attracting and retaining top talent."
    }
  },
  {
    id: 7,
    title: "Figma's New Dev Mode: A Game-Changer for Designers & Developers",
    description: "Explore how Figma's latest features are bridging the gap between design and development.",
    date: "February 4, 2025",
    author: "Admin",
    category: "Design",
    tags: ["Design", "Tools"],
    content: {
      introduction: "In the ever-evolving world of digital product design, collaboration between designers and developers has always been a critical factor in project success. Figma's latest innovation, Dev Mode, is revolutionizing this collaboration, making the handoff process smoother and more efficient than ever before.",
      sections: [
        {
          title: "What is Dev Mode?",
          content: "Dev Mode is a specialized workspace within Figma that's designed specifically for developers. It strips away the design-focused UI elements and presents a clean, developer-friendly interface that focuses on what matters most during the implementation phase.\n\nIn Dev Mode, developers can access ready-to-implement specs including precise spacing measurements, exact color values, font styles, and asset exports. This eliminates the guesswork and back-and-forth communication that often slows down the development process."
        },
        {
          title: "Bridging the Gap Between Design & Development",
          content: "One of the most significant advantages of Dev Mode is how it streamlines the design-to-development handoff. Instead of exporting static images and manually extracting specifications, developers now have access to:\n\n• Live Design Specs: Real-time access to measurements, colors, and typography\n• Code Snippets: Pre-generated CSS, iOS Swift, and Android XML code snippets\n• Version History Access: See how designs have evolved over time\n• Integrated Comments: Direct communication channel with designers"
        },
        {
          title: "Why It Matters",
          content: "For agile design teams, Dev Mode represents a significant step forward in productivity and collaboration. By providing developers with the exact specifications they need, teams can reduce errors, shorten build times, and improve the overall quality of the final product."
        },
        {
          title: "Final Thoughts",
          content: "Figma's Dev Mode is more than just a new feature—it's a fundamental shift in how we approach the design-to-development workflow. By making the handoff process more seamless and developer-friendly, it's helping teams build better products faster."
        }
      ],
      conclusion: "What do you think of Dev Mode? Have you tried it yet? Share your experience in the comments!"
    }
  },
  {
    id: 3,
    title: "Design Systems: Why Your Team Needs One in 2025",
    description: "Discover the benefits of implementing a design system and how it can improve your team's productivity.",
    date: "April 11, 2025",
    author: "Admin",
    category: "Design",
    tags: ["Design", "Technology"],
    content: {
      introduction: "Design systems have evolved from nice-to-have to essential tools for modern product teams. In 2025, they're not just about consistency—they're about efficiency, scalability, and team collaboration.",
      sections: [
        {
          title: "What Makes a Great Design System",
          content: "A successful design system goes beyond just colors and typography. It includes:\n\n• Component libraries with clear documentation\n• Design tokens for consistent spacing and colors\n• Clear guidelines for usage and accessibility\n• Regular updates and maintenance processes"
        },
        {
          title: "Benefits for Your Team",
          content: "Implementing a design system can transform how your team works:\n\n• Faster development cycles\n• Consistent user experience across products\n• Reduced design debt\n• Better collaboration between designers and developers"
        }
      ],
      conclusion: "Ready to build your design system? Start small with your most commonly used components and gradually expand from there."
    }
  },
  {
    id: 4,
    title: "Web3 and the Decentralized Internet: What You Need to Know",
    description: "A comprehensive guide to understanding Web3, blockchain technology, and the decentralized web.",
    date: "April 10, 2025",
    author: "Admin",
    category: "Technology",
    tags: ["Technology", "Web3"]
  },
  {
    id: 5,
    title: "Debugging Like a Pro: Tools & Techniques for Faster Fixes",
    description: "Master the art of debugging with these proven techniques and tools used by professional developers.",
    date: "April 9, 2025",
    author: "Admin",
    category: "Technology",
    tags: ["Technology", "Development"]
  },
  {
    id: 6,
    title: "Accessibility in Design: More Than Just Compliance",
    description: "Learn why accessibility should be a core part of your design process, not just a checkbox.",
    date: "April 8, 2025",
    author: "Admin",
    category: "Design",
    tags: ["Design", "Accessibility"]
  },
  {
    id: 8,
    title: "How AI Is Changing the Game in Front-End Development",
    description: "Discover how artificial intelligence is revolutionizing the way we build user interfaces.",
    date: "April 6, 2025",
    author: "Admin",
    category: "Technology",
    tags: ["Technology", "AI"]
  },
  {
    id: 9,
    title: "10 UI Trends Dominating 2025",
    description: "Stay ahead of the curve with these emerging UI design trends that are shaping the digital landscape.",
    date: "April 5, 2025",
    author: "Admin",
    category: "Design",
    tags: ["Design", "UI"],
    content: {
      introduction: "The UI design landscape is constantly evolving, and 2025 brings exciting new trends that are reshaping how we interact with digital products. From bold typography to immersive experiences, here are the trends that are defining the year.",
      sections: [
        {
          title: "Bold Typography & Micro-Interactions",
          content: "Typography is taking center stage in 2025 with larger, bolder fonts that command attention. Combined with subtle micro-interactions, these elements create engaging user experiences.\n\n• Oversized headings with custom fonts\n• Animated text reveals and transitions\n• Contextual typography that adapts to content\n• Improved readability with better contrast ratios"
        },
        {
          title: "Immersive 3D Elements",
          content: "Three-dimensional elements are becoming more accessible and are being used to create depth and engagement:\n\n• Subtle 3D buttons and cards\n• Parallax scrolling effects\n• Glassmorphism and neumorphism\n• Interactive 3D product showcases"
        },
        {
          title: "Dark Mode & Accessibility",
          content: "Dark mode is no longer optional—it's expected. But 2025 brings a focus on true accessibility:\n\n• High contrast ratios for better readability\n• Reduced motion options for sensitive users\n• Voice navigation and screen reader optimization\n• Color-blind friendly palettes"
        }
      ],
      conclusion: "These trends aren't just about aesthetics—they're about creating more inclusive, engaging, and functional user experiences. Which trend are you most excited to implement?"
    }
  }
]

export function getArticleById(id: number): Article | undefined {
  return articles.find(article => article.id === id)
}

export function getRelatedArticles(currentId: number, limit: number = 3): Article[] {
  return articles
    .filter(article => article.id !== currentId)
    .slice(0, limit)
}
