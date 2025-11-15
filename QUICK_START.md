# 🚀 Быстрый старт Docker деплоя

## Быстрая установка на VPS

### 1. Подключитесь к серверу

```bash
ssh user@your-server-ip
```

### 2. Установите Docker (если не установлен)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Выйдите и войдите снова
```

### 3. Установите Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Клонируйте проект

```bash
cd /opt
sudo git clone https://github.com/your-repo/cat-dog.git
cd cat-dog
sudo chown -R $USER:$USER .
```

### 5. Настройте переменные окружения

```bash
cp .env.example .env
nano .env
```

Заполните:
```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=catdog
FRONTEND_URL=http://your-server-ip
NODE_ENV=production
```

### 6. Запустите деплой

```bash
chmod +x deploy.sh
./deploy.sh
```

Или вручную:

```bash
docker compose build
docker compose up -d
docker compose exec backend npx sequelize-cli db:migrate
```

### 7. Проверьте статус

```bash
docker compose ps
docker compose logs -f
```

### 8. Откройте в браузере

```
http://your-server-ip
```

## Полезные команды

```bash
# Просмотр логов
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Обновление
git pull
docker compose build --no-cache
docker compose up -d
```

## Настройка домена и SSL

См. полную инструкцию в `DOCKER_DEPLOY.md`

