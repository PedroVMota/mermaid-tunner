export interface MermaidSample {
  name: string
  code: string
}

export const MERMAID_SAMPLES: Record<string, MermaidSample> = {
  Flowchart: {
    name: "Flowchart",
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  },
  Class: {
    name: "Class",
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
        +fetch()
    }
    class Cat {
        +String color
        +meow()
        +scratch()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  Sequence: {
    name: "Sequence",
    code: `sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Click Login
    Frontend->>API: POST /auth/login
    API->>Database: Query user
    Database-->>API: User data
    API-->>Frontend: JWT Token
    Frontend-->>User: Redirect to dashboard`,
  },
  "Entity Relationship": {
    name: "Entity Relationship",
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string name
        string email
        int id PK
    }
    ORDER ||--|{ LINE_ITEM : contains
    ORDER {
        int id PK
        date created_at
        string status
    }
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    PRODUCT {
        int id PK
        string name
        float price
    }`,
  },
  State: {
    name: "State",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry
    Error --> [*]: Abort`,
  },
  Mindmap: {
    name: "Mindmap",
    code: `mindmap
  root((Project))
    Planning
      Requirements
      Timeline
      Resources
    Development
      Frontend
        React
        TypeScript
      Backend
        Node.js
        Database
    Testing
      Unit Tests
      Integration
      E2E`,
  },
  Git: {
    name: "Git",
    code: `gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
    commit id: "Feature B"
    checkout main
    merge develop id: "Merge develop"
    commit id: "Hotfix"
    branch release
    checkout release
    commit id: "v1.0.0"`,
  },
  Pie: {
    name: "Pie",
    code: `pie showData
    title Browser Market Share
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 8
    "Edge" : 5
    "Other" : 3`,
  },
  Quadrant: {
    name: "Quadrant",
    code: `quadrantChart
    title Feature Prioritization
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Plan
    quadrant-2 Do First
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Auth System: [0.8, 0.9]
    Dark Mode: [0.2, 0.7]
    Refactor DB: [0.9, 0.4]
    Update Docs: [0.3, 0.2]`,
  },
  Gantt: {
    name: "Gantt",
    code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
        Requirements    :a1, 2024-01-01, 7d
        Design          :a2, after a1, 14d
    section Development
        Frontend        :b1, after a2, 21d
        Backend         :b2, after a2, 28d
    section Testing
        QA Testing      :c1, after b1, 14d
        UAT             :c2, after c1, 7d`,
  },
  Timeline: {
    name: "Timeline",
    code: `timeline
    title Project Milestones
    2024-Q1 : Planning Phase
           : Requirements gathering
           : Architecture design
    2024-Q2 : Development Phase
           : Core features
           : API implementation
    2024-Q3 : Testing Phase
           : QA testing
           : Bug fixes
    2024-Q4 : Launch
           : Production deployment
           : User onboarding`,
  },
  "User Journey": {
    name: "User Journey",
    code: `journey
    title User Shopping Experience
    section Browse
      Visit homepage: 5: User
      Search for product: 4: User
      View product details: 4: User
    section Purchase
      Add to cart: 5: User
      Checkout: 3: User
      Payment: 2: User
    section Delivery
      Track order: 4: User
      Receive package: 5: User`,
  },
}

export const SAMPLE_NAMES = Object.keys(MERMAID_SAMPLES)
