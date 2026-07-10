const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(cors());
app.use(express.json());

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  readingTime: { type: String, default: '1 min read' },
  isPremium: { type: Boolean, default: false },
  seoScore: { type: Number, default: 0 }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Seed Data
const seedPosts = [
  {
    title: 'Mastering React Server Components',
    content: `# The Era of React Server Components\n\nReact Server Components (RSC) represent a fundamental shift in how we build React applications. By executing components on the server ahead of time, we can drastically reduce the JavaScript bundle sent to the client.\n\n## Why use RSC?\n\n1. **Performance**: Zero bundle size for server components.\n2. **Direct Backend Access**: Safely query your database directly from your component.\n3. **SEO Friendly**: HTML is streamed directly to the browser.\n\n### Code Example\n\n\`\`\`javascript\nexport default async function Page() {\n  const data = await db.query('SELECT * FROM users');\n  return <div>{data.name}</div>;\n}\n\`\`\`\n\nRSCs change the game forever.`,
    tags: ['React', 'Next.js', 'Frontend'],
    status: 'published',
    readingTime: '4 min read',
    isPremium: false,
    seoScore: 95
  },
  {
    title: 'Advanced Tailwind CSS Techniques',
    content: `# Tailwind like a Pro\n\nTailwind CSS is an incredible utility-first CSS framework. But are you using it to its full potential? Let's explore some advanced techniques.\n\n## Arbitrary Values\nSometimes you need a specific value that isn't in your theme. Tailwind allows you to use square bracket notation:\n\n\`\`\`html\n<div class="top-[117px] bg-[#bada55]"></div>\n\`\`\`\n\n## Custom Plugins\nYou can write plugins to add custom utilities or components directly into your Tailwind config. This keeps your codebase clean and reusable.`,
    tags: ['CSS', 'Tailwind', 'Design'],
    status: 'published',
    readingTime: '3 min read',
    isPremium: false,
    seoScore: 88
  },
  {
    title: 'The Future of AI in Web Development',
    content: `# AI is Coding Now\n\nArtificial Intelligence is rapidly changing the landscape of software engineering. With tools like GitHub Copilot and ChatGPT, developers are experiencing unprecedented productivity boosts.\n\n## How AI helps\n- **Boilerplate generation**: Stop writing the same setup code over and over.\n- **Debugging**: Paste your error, get the solution.\n- **Refactoring**: Ask the AI to clean up your messy code.\n\nHowever, understanding the fundamentals is still critical. AI is a tool, not a replacement for a skilled engineer.`,
    tags: ['AI', 'Tech', 'Future'],
    status: 'published',
    readingTime: '5 min read',
    isPremium: true,
    seoScore: 99
  },
  {
    title: 'Draft: My Next Big Project',
    content: `# Brainstorming\n\nI am currently thinking about building a new SaaS product... more to come soon.`,
    tags: ['Personal', 'Startup'],
    status: 'draft',
    readingTime: '1 min read',
    isPremium: false,
    seoScore: 40
  }
];

// Routes

// Fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}, '-__v').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Fetch single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Create/Update Post
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error });
  }
});

// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Mock AI Content Generation
app.post('/api/ai/generate', (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }
  
  const aiGeneratedContent = `\n\n## Generated Content for ${topic}\n\nThis is an automatically generated section provided by the AI integration. When discussing ${topic}, it is important to consider the underlying architectural patterns and modern best practices.\n\n- Improved efficiency\n- Better developer experience\n- Enhanced performance`;
  
  // Simulate network delay
  setTimeout(() => res.json({ content: aiGeneratedContent }), 1000);
});

// Mock AI SEO Analyzer
app.post('/api/ai/analyze', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required for analysis' });
  }
  
  const score = Math.floor(Math.random() * 30) + 70; // Random score between 70 and 100
  const suggestions = [
    "Consider adding more H2 headings to break up text.",
    "Include relevant keywords in the first paragraph.",
    "Add more bulleted lists for readability.",
    "Ensure your title contains the primary keyword."
  ];
  
  // Return random 2 suggestions
  const shuffled = suggestions.sort(() => 0.5 - Math.random());
  
  setTimeout(() => res.json({ 
    score, 
    suggestions: shuffled.slice(0, 2) 
  }), 1500);
});

// Initialization
let mongoServer;
const startServer = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');

    // Seed database
    await Post.deleteMany({});
    await Post.insertMany(seedPosts);
    console.log('Database seeded with 4 detailed dummy posts');

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();
