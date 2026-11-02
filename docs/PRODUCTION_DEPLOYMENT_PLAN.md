# Panduan & Rencana Deployment Produksi: Oracle Cloud (OCI) + Vercel

Dokumen ini merupakan panduan arsitektur dan langkah-langkah implementasi produksi (*Production Deployment Blueprint*) untuk sistem **Kostara**:
- **Frontend**: Dihosting di **Vercel** (Global CDN Edge Network).
- **Backend & Database PostgreSQL**: Dihosting di **Oracle Cloud Infrastructure (OCI)** (Memanfaatkan fasilitas **OCI Always Free Tier**).

---

## 1. Topologi Arsitektur Produksi

```mermaid
graph TD
    Client[Pengguna / Browser]
    
    subgraph Vercel_Cloud [Vercel Global Edge Network]
        FE[Frontend Next.js 16<br/>https://kostara.vercel.app]
    end

    subgraph Oracle_Cloud [Oracle Cloud Infrastructure - OCI Always Free]
        subgraph OCI_VM [Ubuntu Linux VM Compute]
            NGINX[Nginx Reverse Proxy + Let's Encrypt SSL<br/>Port 80 / 443]
            API[Express.js Backend API<br/>Port 5000]
            DB[(PostgreSQL Database 16<br/>Port 5432 - Internal Only)]
            VOLUME[(Docker Persistent Storage Volume)]
        end
    end

    Client -->|HTTPS :443| FE
    Client -->|HTTPS :443 API Requests| NGINX
    FE -->|Server Fetch / API Proxy| NGINX
    NGINX -->|Proxy Pass :5000| API
    API -->|Prisma Connection| DB
    DB --- VOLUME
```

---

## 2. Keuntungan Kombinasi OCI + Vercel

| Kebutuhan | Solusi | Alasan & Keuntungan |
| :--- | :--- | :--- |
| **Frontend UI** | **Vercel** | - Dibuat oleh tim pencipta Next.js.<br/>- Auto deployment via GitHub (`git push` otomatis rebuild).<br/>- Global CDN cepat diakses dari Indonesia.<br/>- SSL gratis & zero maintenance server web. |
| **Backend & DB** | **Oracle Cloud (OCI)** | - **Always Free Tier** OCI memberikan spesifikasi sangat besar secara cuma-cuma (Hingga **4 OCPU, 24 GB RAM** ARM Ampere atau 2 VM AMD x86).<br/>- Mendapatkan Public IP statis gratis.<br/>- Bebas dari batasan kuota *compute hour* seperti Heroku/Render.<br/>- Database PostgreSQL berjalan di server sendiri dengan performa tinggi tanpa batasan baris data (*no row limit*). |

---

## 3. Komponen Konfigurasi Produksi

### A. Dockerizing Backend (`backend/Dockerfile`)
Menjadikan backend ringan, terisolasi, dan siap jalan di server Linux OCI:

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### B. Docker Compose Produksi (`backend/docker-compose.prod.yml`)
Menjalankan PostgreSQL dan Express API sekaligus dengan jaringan internal yang aman:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: kostara_db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-kostara_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-SuperSecretPassword123}
      POSTGRES_DB: ${POSTGRES_DB:-kostara_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kostara_network
    # Port 5432 tidak diekspos ke publik demi keamanan database

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: kostara_api
    restart: always
    environment:
      PORT: 5000
      DATABASE_URL: postgresql://${POSTGRES_USER:-kostara_user}:${POSTGRES_PASSWORD:-SuperSecretPassword123}@postgres:5432/${POSTGRES_DB:-kostara_db}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "127.0.0.1:5000:5000" # Hanya diakses internal oleh Nginx
    depends_on:
      - postgres
    networks:
      - kostara_network

networks:
  kostara_network:
    driver: bridge

volumes:
  postgres_data:
```

### C. Nginx Reverse Proxy & SSL di OCI
Nginx di server OCI bertugas menerima HTTPS dari luar, lalu mem-forward ke Express di port 5000:

```nginx
server {
    server_name api.namadomainanda.com; # atau IP Publik OCI

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Langkah-Langkah Eksekusi Bertahap

### Langkah 1: Persiapan Server Oracle Cloud (OCI)
1. Buat akun di [Oracle Cloud](https://www.oracle.com/cloud/free/).
2. Buat Compute Instance (*Create VM Instance*):
   - **OS**: Ubuntu 22.04 / 24.04 Minimal LTS.
   - **Shape**: *Always Free-eligible* (VM.Standard.A1.Flex 2 OCPU 12 GB RAM atau VM.Standard.E2.1.Micro).
   - Unduh file SSH Private Key (`.key`) untuk login.
3. Buka Firewall di OCI Console (**Security List**):
   - Buka menu: *Networking → Virtual Cloud Networks → Default Security List → Ingress Rules*.
   - Tambahkan rule port:
     - `80` (HTTP) — Source: `0.0.0.0/0`
     - `443` (HTTPS) — Source: `0.0.0.0/0`
4. Login ke VM via SSH dan buka firewall internal OS:
   ```bash
   ssh -i private_key.key ubuntu@<IP_PUBLIK_OCI>
   
   # Buka port di iptables bawaan Ubuntu OCI:
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```

### Langkah 2: Install Docker & Setup Backend di OCI
1. Install Docker & Docker Compose di VM OCI:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
2. Clone repository ke VM OCI:
   ```bash
   git clone -b development https://github.com/Fajrulislami/kosman.git
   cd kosman/backend
   ```
3. Buat file `.env` produksi:
   ```bash
   nano .env
   ```
   Isi dengan:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://kostara_user:PasswordKuat123@postgres:5432/kostara_db?schema=public"
   JWT_SECRET="buat-secret-jwt-yang-panjang-dan-acak-32-karakter"
   FRONTEND_URL="https://kostara.vercel.app"
   ```
4. Jalankan container:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
5. Eksekusi migrasi skema Prisma & Seeding di PostgreSQL:
   ```bash
   docker exec -it kostara_api npx prisma migrate deploy
   docker exec -it kostara_api npx prisma db seed
   ```

### Langkah 3: Setup SSL Gratis (Let's Encrypt) di Nginx OCI
```bash
sudo certbot --nginx -d api.namadomainanda.com
```
Sekarang backend API Anda aktif di `https://api.namadomainanda.com` dengan SSL terverifikasi.

---

### Langkah 4: Deploy Frontend Next.js ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik **Add New... → Project**.
3. Pilih repository `Fajrulislami/kosman`.
4. Pada bagian **Configure Project**:
   - **Root Directory**: Klik *Edit*, pilih folder **`frontend`**.
   - **Framework Preset**: Pilih **Next.js**.
   - **Environment Variables**: Tambahkan variabel:
     - `NEXT_PUBLIC_API_URL` = `https://api.namadomainanda.com/api` (atau `http://<IP_OCI>:5000/api`)
5. Klik **Deploy**.
6. Dalam 1–2 menit, website publik, dashboard admin, dan tenant portal sudah live di alamat Vercel (misal: `https://kosman.vercel.app`).

---

## 5. Pertimbangan CORS & Autentikasi Cross-Domain

Karena Frontend berada di Vercel (`*.vercel.app`) dan Backend berada di Oracle Cloud (`api.*`):
1. **CORS**: Backend Express kita sudah dikonfigurasi menerima origin `FRONTEND_URL` dengan `credentials: true`.
2. **Cookie Auth**: Cookie `kostara_session` akan otomatis dikirim jika backend memakai HTTPS dengan atribut:
   ```ts
   sameSite: "none",
   secure: true
   ```
   Atau menggunakan header `Authorization: Bearer <token>` yang didukung oleh backend kita.

---

## 6. Ringkasan Biaya Bulanan (Cost Estimation)

| Layanan | Komponen | Biaya |
| :--- | :--- | :--- |
| **Vercel Hobby Plan** | Next.js Frontend, CDN, SSL, CI/CD | **Rp 0 / bulan (Gratis)** |
| **Oracle Cloud Always Free** | VM Compute (Hingga 4 Core ARM / 24 GB RAM) | **Rp 0 / bulan (Gratis)** |
| **PostgreSQL 16** | Self-hosted via Docker di OCI | **Rp 0 / bulan (Gratis)** |
| **SSL Let's Encrypt** | Sertifikat HTTPS otomatis diperpanjang | **Rp 0 / bulan (Gratis)** |
| **Domain Sendiri (.com / .id)** | Opsional (misal: `kostara.id`) | ~Rp 120.000 - Rp 200.000 / tahun |
| **TOTAL BIAYA** | Infrastruktur Fullstack Produksi | **100% GRATIS** |
