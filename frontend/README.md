# GenAI Eng Prompt - Frontend

Interface web responsiva para otimização de prompts usando React + Vite.

## 🚀 Tecnologias

- **React 18.3** - Biblioteca UI
- **Vite 5.3** - Build tool e dev server
- **TailwindCSS 3.4** - Framework CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 🎨 Design

- **Paleta de cores**: Laranja e marrom
- **Fundo principal**: Laranja (#FF8C42, #FFA500)
- **Bordas**: Marrom claro (#8B4513, #A0522D)
- **Frames**: Tom sobre tom laranja
- **Texto**: Branco para contraste

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173` com proxy para API em `http://localhost:3010`

## 🏗️ Build

```bash
# Build para produção
npm run build

# Build e copiar para backend
npm run build:prod
```

O comando `build:prod` gera os arquivos em `dist/` e copia para `../backend/public/`

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── services/       # Serviços de API
│   ├── hooks/          # Hooks customizados
│   ├── utils/          # Utilitários
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globais
├── public/             # Arquivos estáticos
├── index.html          # HTML template
├── vite.config.js      # Configuração Vite
└── tailwind.config.js  # Configuração TailwindCSS
```

## 🔧 Scripts

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint
- `npm run build:prod` - Build e copia para backend
