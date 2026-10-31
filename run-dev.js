const { spawn } = require("child_process");
const path = require("path");

console.log("=================================================");
console.log("🚀 Memulai Kostara Fullstack Development Server");
console.log("   - Backend Express API : http://localhost:5000");
console.log("   - Frontend Next.js    : http://localhost:3000");
console.log("=================================================\n");

const backend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "backend"),
  shell: true,
  stdio: "inherit",
});

// Beri jeda 1.5 detik agar backend sempat binding port 5000 sebelum frontend mulai request
setTimeout(() => {
  const frontend = spawn("npm", ["run", "dev"], {
    cwd: path.join(__dirname, "frontend"),
    shell: true,
    stdio: "inherit",
  });

  const cleanup = () => {
    backend.kill();
    frontend.kill();
    process.exit();
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}, 1500);
