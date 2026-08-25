import { AppAction, AppState, Bookmark, Collection } from './types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'networking',
    name: 'Networking',
    description: 'Computer networking concepts and resources',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'Architecture patterns and distributed systems',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'react',
    name: 'React',
    description: 'React ecosystem, hooks, and frontend patterns',
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Database internals, indexing, and query optimization',
    createdAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 'ai',
    name: 'AI',
    description: 'Machine learning, LLMs, and AI engineering',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Java, JVM internals, and Spring Boot',
    createdAt: '2024-07-10T00:00:00Z',
  },
  {
    id: 'read-later',
    name: 'Read Later',
    description: 'Long reads to revisit when I have time',
    createdAt: '2024-07-15T00:00:00Z',
  },
];

const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'b1',
    tweet: {
      id: 't1',
      author: { id: 'a1', displayName: 'Julia Evans', username: 'b0rk' },
      text: "TCP slow start is wild. Every new connection starts by sending 1 packet, then 2, then 4... it's exponential until packet loss happens. Your \"slow\" first request isn't a bug — it's the network calibrating itself.",
      createdAt: '2024-08-15T14:23:00Z',
      url: 'https://x.com/b0rk/status/1234567890',
    },
    savedAt: '2024-08-20T09:15:00Z',
    collectionId: 'networking',
    tags: ['#networking', '#tcp', '#systems'],
    note: 'Great explanation of TCP slow start. Review before the networking module.',
    isFavorite: true,
    isRead: true,
  },
  {
    id: 'b2',
    tweet: {
      id: 't2',
      author: { id: 'a2', displayName: 'Martin Kleppmann', username: 'martinkl' },
      text: 'Distributed transactions are often the wrong solution. If you need to coordinate writes across services, first ask: can I restructure the data model so that a single service owns all the data? If yes, do that instead.',
      createdAt: '2024-08-10T11:00:00Z',
      url: 'https://x.com/martinkl/status/1234567891',
    },
    savedAt: '2024-08-18T15:30:00Z',
    collectionId: 'system-design',
    tags: ['#distributed-systems', '#system-design', '#databases'],
    note: 'Key insight from DDIA author. Think about this when designing the payment service.',
    isFavorite: true,
    isRead: true,
  },
  {
    id: 'b3',
    tweet: {
      id: 't3',
      author: { id: 'a3', displayName: 'Dan Abramov', username: 'dan_abramov' },
      text: "People get confused by useEffect cleanup. It doesn't run when the component unmounts — it runs before the NEXT effect. This means every render that changes deps produces a cleanup of the previous run. Think of it as \"undo the last effect\".",
      createdAt: '2024-08-12T18:45:00Z',
      url: 'https://x.com/dan_abramov/status/1234567892',
    },
    savedAt: '2024-08-17T10:00:00Z',
    collectionId: 'react',
    tags: ['#react', '#hooks', '#javascript'],
    note: 'Finally a clear explanation of cleanup timing. Share with the team.',
    isFavorite: false,
    isRead: true,
  },
  {
    id: 'b4',
    tweet: {
      id: 't4',
      author: { id: 'a4', displayName: 'Kelsey Hightower', username: 'kelseyhightower' },
      text: "Kubernetes is not a platform. It's a foundation for building platforms. If you're using it raw and wondering why it's so hard, you're probably missing a layer of abstraction between k8s and your application teams.",
      createdAt: '2024-08-08T09:15:00Z',
      url: 'https://x.com/kelseyhightower/status/1234567893',
    },
    savedAt: '2024-08-16T14:00:00Z',
    collectionId: 'system-design',
    tags: ['#kubernetes', '#platform-engineering', '#devops'],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b5',
    tweet: {
      id: 't5',
      author: { id: 'a5', displayName: 'Josh W. Comeau', username: 'JoshWComeau' },
      text: "CSS Custom Properties are not just \"CSS variables\". They cascade. They inherit. They can be overridden at any level of the DOM. This makes them fundamentally different from preprocessor variables and way more powerful for theming.",
      createdAt: '2024-08-05T16:30:00Z',
      url: 'https://x.com/JoshWComeau/status/1234567894',
    },
    savedAt: '2024-08-15T11:20:00Z',
    collectionId: 'react',
    tags: ['#css', '#javascript', '#frontend'],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b6',
    tweet: {
      id: 't6',
      author: { id: 'a6', displayName: 'Gunnar Morling', username: 'gunnarmorling' },
      text: "PostgreSQL partial indexes are criminally underused. If 90% of your queries filter on status='active', an index on just those rows is 10x smaller and faster. CREATE INDEX WHERE status = 'active' — that's it.",
      createdAt: '2024-08-03T13:00:00Z',
      url: 'https://x.com/gunnarmorling/status/1234567895',
    },
    savedAt: '2024-08-14T09:45:00Z',
    collectionId: 'databases',
    tags: ['#postgresql', '#databases', '#performance'],
    note: "Check our user_sessions table — probably not using partial indexes there.",
    isFavorite: true,
    isRead: true,
  },
  {
    id: 'b7',
    tweet: {
      id: 't7',
      author: { id: 'a7', displayName: 'Sam Newman', username: 'samnewman' },
      text: "The most common microservices mistake: splitting by nouns instead of capabilities. You don't want a \"User Service\" — you want an \"Authentication Service\" and a \"Profile Service\". Nouns cut across capabilities and create coupling.",
      createdAt: '2024-08-01T10:00:00Z',
      url: 'https://x.com/samnewman/status/1234567896',
    },
    savedAt: '2024-08-13T16:30:00Z',
    collectionId: 'system-design',
    tags: ['#microservices', '#system-design', '#architecture'],
    note: '',
    isFavorite: false,
    isRead: true,
  },
  {
    id: 'b8',
    tweet: {
      id: 't8',
      author: { id: 'a8', displayName: 'Andrej Karpathy', username: 'karpathy' },
      text: "The GPT-4 context window now fits more text than most technical books. We keep thinking about LLMs as \"text generators\" but they're really \"document reasoners\". The question isn't what they generate — it's what you put in the context.",
      createdAt: '2024-07-28T22:00:00Z',
      url: 'https://x.com/karpathy/status/1234567897',
    },
    savedAt: '2024-08-12T08:00:00Z',
    collectionId: 'ai',
    tags: ['#ai', '#llm', '#gpt'],
    note: 'Reframe how we think about RAG architecture with this insight.',
    isFavorite: true,
    isRead: false,
  },
  {
    id: 'b9',
    tweet: {
      id: 't9',
      author: { id: 'a9', displayName: 'Vlad Mihalcea', username: 'vlad_mihalcea' },
      text: "Spring Boot's @Transactional on a public method won't work if you call it from another method in the same class. The proxy won't intercept internal calls. Use self-injection or restructure your services.",
      createdAt: '2024-07-25T14:00:00Z',
      url: 'https://x.com/vlad_mihalcea/status/1234567898',
    },
    savedAt: '2024-08-11T11:30:00Z',
    collectionId: 'java',
    tags: ['#java', '#spring-boot', '#transactions'],
    note: 'This bit us last quarter. Document in the team wiki.',
    isFavorite: false,
    isRead: true,
  },
  {
    id: 'b10',
    tweet: {
      id: 't10',
      author: { id: 'a10', displayName: 'Evan You', username: 'youyuxi' },
      text: "Vite's dev server is fast not just because of ESM, but because it doesn't bundle. Each import is resolved individually. 1000 files = 1000 requests in dev, but native ESM + HTTP/2 makes this faster than a 3MB bundle.",
      createdAt: '2024-07-20T09:00:00Z',
      url: 'https://x.com/youyuxi/status/1234567899',
    },
    savedAt: '2024-08-10T14:00:00Z',
    collectionId: 'react',
    tags: ['#vite', '#javascript', '#bundling', '#performance'],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b11',
    tweet: {
      id: 't11',
      author: { id: 'a11', displayName: 'Charity Majors', username: 'mipsytipsy' },
      text: "Observability is not about collecting more data. It's about being able to ask arbitrary questions of your system without predicting them in advance. Metrics tell you something is wrong. Traces tell you where. Logs tell you why.",
      createdAt: '2024-07-18T16:00:00Z',
      url: 'https://x.com/mipsytipsy/status/1234567900',
    },
    savedAt: '2024-08-09T09:00:00Z',
    collectionId: 'system-design',
    tags: ['#observability', '#distributed-systems', '#devops'],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b12',
    tweet: {
      id: 't12',
      author: { id: 'a12', displayName: 'Brian Goetz', username: 'BrianGoetz' },
      text: "Java's virtual threads don't make your code faster in isolation. They make it faster when you're waiting. If your bottleneck is CPU, virtual threads won't help. But if it's I/O — and most services are — they're transformative.",
      createdAt: '2024-07-15T11:00:00Z',
      url: 'https://x.com/BrianGoetz/status/1234567901',
    },
    savedAt: '2024-08-08T15:00:00Z',
    collectionId: 'java',
    tags: ['#java', '#concurrency', '#project-loom'],
    note: 'Evaluate for our background job processor.',
    isFavorite: true,
    isRead: false,
  },
  {
    id: 'b13',
    tweet: {
      id: 't13',
      author: { id: 'a1', displayName: 'Julia Evans', username: 'b0rk' },
      text: "DNS is not just for looking up IP addresses. A single DNS query can return multiple record types: A, AAAA, CNAME, MX, TXT, SRV. Modern service discovery in k8s heavily abuses SRV records to expose service endpoints.",
      createdAt: '2024-08-21T10:00:00Z',
      url: 'https://x.com/b0rk/status/1234567902',
    },
    savedAt: '2024-08-22T08:30:00Z',
    collectionId: 'inbox',
    tags: [],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b14',
    tweet: {
      id: 't14',
      author: { id: 'a13', displayName: 'Kent C. Dodds', username: 'kentcdodds' },
      text: "Testing implementation details is the source of most testing pain. Test what users see and do, not how components work internally. If your test breaks when you refactor without changing behavior, it's testing implementation details.",
      createdAt: '2024-08-20T14:00:00Z',
      url: 'https://x.com/kentcdodds/status/1234567903',
    },
    savedAt: '2024-08-21T16:00:00Z',
    collectionId: 'inbox',
    tags: [],
    note: '',
    isFavorite: false,
    isRead: false,
  },
  {
    id: 'b15',
    tweet: {
      id: 't15',
      author: { id: 'a14', displayName: 'Simon Willison', username: 'simonw' },
      text: 'SQLite is underrated for production use. It handles 100k writes/second on modern NVMe. No network round-trips. No connection pooling. If your app fits on one server — and most do — SQLite + Litestream beats Postgres for simplicity.',
      createdAt: '2024-08-19T09:00:00Z',
      url: 'https://x.com/simonw/status/1234567904',
    },
    savedAt: '2024-08-20T11:00:00Z',
    collectionId: 'inbox',
    tags: [],
    note: '',
    isFavorite: false,
    isRead: false,
  },
];

export const INITIAL_STATE: AppState = {
  bookmarks: INITIAL_BOOKMARKS,
  collections: INITIAL_COLLECTIONS,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id ? { ...b, isFavorite: !b.isFavorite } : b
        ),
      };
    case 'TOGGLE_READ':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id ? { ...b, isRead: !b.isRead } : b
        ),
      };
    case 'SET_NOTE':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id ? { ...b, note: action.note } : b
        ),
      };
    case 'MOVE_TO_COLLECTION':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id ? { ...b, collectionId: action.collectionId } : b
        ),
      };
    case 'ADD_TAG':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id && !b.tags.includes(action.tag)
            ? { ...b, tags: [...b.tags, action.tag] }
            : b
        ),
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id
            ? { ...b, tags: b.tags.filter((t) => t !== action.tag) }
            : b
        ),
      };
    case 'DELETE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.id),
      };
    case 'CREATE_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, action.collection],
      };
    case 'DELETE_COLLECTION':
      return {
        ...state,
        collections: state.collections.filter((c) => c.id !== action.id),
        bookmarks: state.bookmarks.map((b) =>
          b.collectionId === action.id ? { ...b, collectionId: 'inbox' } : b
        ),
      };
    default:
      return state;
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function getAvatarColor(username: string): string {
  const palette = [
    '#0F766E', '#1D4ED8', '#7C3AED', '#BE185D',
    '#B45309', '#047857', '#9333EA', '#0369A1',
  ];
  const idx = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
