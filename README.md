# 🎬 YouTube Content Creator Machine

AI-powered workflow builder for creating YouTube scripts and thumbnails using OpenRouter API.

## ✨ Features

- **AI Script Generation** - Generate YouTube video scripts using `prime-intellect/intellect-3`
- **AI Thumbnail Creation** - Create 16:9 thumbnails using `google/gemini-2.5-flash-image`
- **Visual Workflow Builder** - Drag-and-drop interface powered by React Flow
- **OpenRouter Integration** - Single API for both text and image generation
- **Real-time Execution** - See results instantly in the execution panel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

```bash
# Clone the repository
git clone https://github.com/filiksyos/youtube-content-creator-machine.git
cd youtube-content-creator-machine

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your API key to .env.local
# OPENROUTER_API_KEY=your_openrouter_key

# Run the app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## 🎨 How It Works

1. **Drag Nodes** - Add Script Generation and Thumbnail Generation nodes to the canvas
2. **Configure** - Click nodes to set parameters (topic, tone, style, etc.)
3. **Execute** - Run the workflow to generate content
4. **View Results** - See generated scripts and thumbnails in the execution panel
5. **Export** - Download or copy your generated content

## 📦 Workflow Nodes

### Script Generation Node
- **Input**: Video topic, target audience, video length, tone
- **Output**: Complete YouTube video script with intro, main content, and outro
- **Model**: `prime-intellect/intellect-3` via OpenRouter

### Thumbnail Generation Node
- **Input**: Video title, key elements, style preferences
- **Output**: 16:9 aspect ratio thumbnail image (1344×768)
- **Model**: `google/gemini-2.5-flash-image` via OpenRouter

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with React 19
- **Workflow Canvas**: React Flow (@xyflow/react)
- **AI Provider**: OpenRouter API
- **UI**: Tailwind CSS with Radix UI components
- **Type Safety**: TypeScript
- **HTTP Client**: Axios

## 📝 Environment Variables

Create a `.env.local` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 🔧 Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

Inspired by [vercel-labs/workflow-builder-template](https://github.com/vercel-labs/workflow-builder-template)
