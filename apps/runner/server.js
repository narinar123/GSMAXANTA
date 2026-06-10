const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.RUNNER_PORT || 3001;
const WORKSPACE_DIR = path.resolve(process.env.WORKSPACE_DIR || path.join(__dirname, '../workspace'));

// Ensure workspace directory exists and has default files
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  fs.writeFileSync(path.join(WORKSPACE_DIR, 'README.md'), '# GSMAXALL Workspace\nWelcome to your AI Operating System IDE workspace!\n\nYou can edit files, run commands in the terminal, or deploy agents here.');
  fs.writeFileSync(path.join(WORKSPACE_DIR, 'index.js'), '// Hello GSMAXALL OS\nconsole.log("Welcome to the workspace!");\n\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\nmodule.exports = { calculateSum };');
  fs.writeFileSync(path.join(WORKSPACE_DIR, 'package.json'), JSON.stringify({
    name: "workspace-project",
    version: "1.0.0",
    dependencies: {}
  }, null, 2));
}

// REST Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', workspace: WORKSPACE_DIR });
});

// Store active processes per socket client
const activeShells = new Map();
const activeAgents = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send initial workspace layout
  socket.emit('workspace:ready', { path: WORKSPACE_DIR });

  // 1. FILE OPERATIONS HANDLERS
  socket.on('file:list', (dirPath = '') => {
    const targetDir = path.join(WORKSPACE_DIR, dirPath);
    try {
      if (!fs.existsSync(targetDir)) {
        return socket.emit('file:error', { message: 'Directory does not exist' });
      }
      const files = fs.readdirSync(targetDir).map(name => {
        const fullPath = path.join(targetDir, name);
        const stats = fs.statSync(fullPath);
        return {
          name,
          path: path.relative(WORKSPACE_DIR, fullPath),
          isDirectory: stats.isDirectory(),
          size: stats.size,
          updatedAt: stats.mtime
        };
      });
      socket.emit('file:list:response', { files, dirPath });
    } catch (err) {
      socket.emit('file:error', { message: err.message });
    }
  });

  socket.on('file:read', (filePath) => {
    const fullPath = path.join(WORKSPACE_DIR, filePath);
    try {
      if (!fs.existsSync(fullPath)) {
        return socket.emit('file:error', { message: `File not found: ${filePath}` });
      }
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        return socket.emit('file:error', { message: 'Cannot read directory contents as file' });
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      socket.emit('file:read:response', { path: filePath, content });
    } catch (err) {
      socket.emit('file:error', { message: err.message });
    }
  });

  socket.on('file:write', ({ path: filePath, content }) => {
    const fullPath = path.join(WORKSPACE_DIR, filePath);
    try {
      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(fullPath, content, 'utf-8');
      socket.emit('file:write:response', { path: filePath, success: true });
    } catch (err) {
      socket.emit('file:error', { message: err.message });
    }
  });

  socket.on('file:create-dir', (dirPath) => {
    const fullPath = path.join(WORKSPACE_DIR, dirPath);
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      socket.emit('file:create-dir:response', { path: dirPath, success: true });
    } catch (err) {
      socket.emit('file:error', { message: err.message });
    }
  });

  socket.on('file:delete', (filePath) => {
    const fullPath = path.join(WORKSPACE_DIR, filePath);
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true });
        } else {
          fs.unlinkSync(fullPath);
        }
        socket.emit('file:delete:response', { path: filePath, success: true });
      }
    } catch (err) {
      socket.emit('file:error', { message: err.message });
    }
  });

  // 2. TERMINAL SHELL HANDLER (Persistent child process spawn per connection)
  socket.on('terminal:init', () => {
    // Clean up existing shell if any
    if (activeShells.has(socket.id)) {
      activeShells.get(socket.id).kill();
    }

    const allowReal = process.env.RUNNER_ALLOW_REAL_SHELL === 'true';
    if (!allowReal) {
      // Mock Terminal Shell (Safely isolated fallback)
      socket.emit('terminal:output', 'GSMAXALL Sandbox Shell v1.0.0 (Simulated Environment)\r\n$ ');
      
      let currentDir = '/';
      socket.on('terminal:input', (data) => {
        const cmd = data.trim();
        if (cmd === 'clear') {
          socket.emit('terminal:output', '\x1b[2J\x1b[H$ ');
          return;
        }
        
        let output = '';
        if (cmd.startsWith('cd ')) {
          const target = cmd.slice(3).trim();
          currentDir = target === '..' ? '/' : `/${target}`;
          output = `\r\n`;
        } else if (cmd === 'pwd') {
          output = `\r\n${currentDir}\r\n`;
        } else if (cmd === 'ls') {
          output = '\r\nindex.js   package.json   README.md   src/   public/\r\n';
        } else if (cmd.startsWith('cat ')) {
          const filename = cmd.slice(4).trim();
          if (filename === 'index.js') {
            output = '\r\n// Hello GSMAXALL OS\r\nconsole.log("Welcome to the workspace!");\r\n';
          } else if (filename === 'README.md') {
            output = '\r\n# GSMAXALL Workspace\r\nWelcome to your AI Operating System IDE workspace!\r\n';
          } else {
            output = `\r\ncat: ${filename}: No such file or directory\r\n`;
          }
        } else if (cmd === 'npm run dev' || cmd === 'node index.js') {
          output = '\r\n> workspace-project@1.0.0 start\r\n> node index.js\r\n\r\nWelcome to the workspace!\r\n';
        } else if (cmd) {
          output = `\r\nsh: command not found: ${cmd.split(' ')[0]}\r\n`;
        } else {
          output = '\r\n';
        }
        socket.emit('terminal:output', output + `${currentDir === '/' ? '' : currentDir.slice(1)} $ `);
      });
      return;
    }

    // Real Bash Terminal Shell
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
    const ptyProcess = spawn(shell, [], {
      cwd: WORKSPACE_DIR,
      env: { ...process.env, PATH: process.env.PATH + ':/usr/local/bin:/usr/bin:/bin' }
    });

    activeShells.set(socket.id, ptyProcess);

    ptyProcess.stdout.on('data', (data) => {
      socket.emit('terminal:output', data.toString());
    });

    ptyProcess.stderr.on('data', (data) => {
      socket.emit('terminal:output', data.toString());
    });

    socket.on('terminal:input', (data) => {
      if (ptyProcess.writable) {
        ptyProcess.stdin.write(data);
      }
    });

    ptyProcess.on('close', () => {
      socket.emit('terminal:output', '\r\nProcess exited.\r\n');
      activeShells.delete(socket.id);
    });
  });

  // 3. AUTONOMOUS AGENT EXECUTION LOOP (Shared LangGraph AgentRuntime executor)
  socket.on('agent:start', async ({ task, agentType }) => {
    console.log(`Agent of type ${agentType} started for task: ${task}`);
    
    // Clean existing agent tasks
    if (activeAgents.has(socket.id)) {
      clearTimeout(activeAgents.get(socket.id));
    }

    try {
      const { AgentRuntime } = require('@gsmaxall/agents');
      
      // Execute the shared LangGraph agent loops
      await AgentRuntime.execute({
        agentId: agentType,
        goalPrompt: task,
        workspaceDir: WORKSPACE_DIR
      }, (step) => {
        socket.emit('agent:step', step);
      });
    } catch (err) {
      console.error(err);
      socket.emit('agent:step', {
        id: `step-err-${Date.now()}`,
        status: 'error',
        message: err.message,
        progress: 100,
        logs: `[SYSTEM ERROR] Failed executing agent: ${err.message}`
      });
    }
  });

  socket.on('agent:stop', () => {
    socket.emit('agent:stopped', { success: true });
  });

  // 4. WORKFLOW EXECUTION ENGINE (n8n-style node flow executor)
  socket.on('workflow:execute', ({ nodes, edges }) => {
    console.log(`Executing workflow with ${nodes.length} nodes and ${edges.length} edges`);
    
    // Find trigger node
    const trigger = nodes.find(n => n.type === 'trigger' || n.id === 'trigger');
    if (!trigger) {
      return socket.emit('workflow:error', { message: 'No trigger node found' });
    }

    let currentNodes = [trigger];
    const executed = new Set();

    const runNext = () => {
      if (currentNodes.length === 0) {
        return socket.emit('workflow:completed', { success: true });
      }

      const node = currentNodes.shift();
      if (executed.has(node.id)) return runNext();

      executed.add(node.id);
      socket.emit('workflow:step', {
        nodeId: node.id,
        status: 'running',
        timestamp: new Date().toISOString()
      });

      // Simulate node processing latency
      setTimeout(() => {
        socket.emit('workflow:step', {
          nodeId: node.id,
          status: 'success',
          output: { result: `Success executing action in ${node.data?.label || node.id}` },
          timestamp: new Date().toISOString()
        });

        // Find connected target nodes
        const nextEdges = edges.filter(e => e.source === node.id);
        const nextNodes = nextEdges.map(e => nodes.find(n => n.id === e.target)).filter(Boolean);
        
        currentNodes.push(...nextNodes);
        runNext();
      }, 1500);
    };

    runNext();
  });

  // 5. CHOKIDAR FILE SYSTEM WATCHER
  const watcher = chokidar.watch(WORKSPACE_DIR, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher.on('all', (event, filePath) => {
    const relativePath = path.relative(WORKSPACE_DIR, filePath);
    if (relativePath) {
      socket.emit('file:change', { event, path: relativePath });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    watcher.close();
    
    // Clean up terminal shell
    if (activeShells.has(socket.id)) {
      activeShells.get(socket.id).kill();
      activeShells.delete(socket.id);
    }
    
    // Clean up agent interval
    if (activeAgents.has(socket.id)) {
      clearInterval(activeAgents.get(socket.id));
      activeAgents.delete(socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Runner WebSocket Server listening on port ${PORT}`);
  console.log(`Workspace directory: ${WORKSPACE_DIR}`);
});
