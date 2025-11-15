# 🐳 Docker Deployment Guide

Полное руководство по деплою React + Node.js приложения на VPS с использованием Docker.

## 📋 Содержание

1. [Требования](#требования)
2. [Настройка сервера](#настройка-сервера)
3. [Подготовка проекта](#подготовка-проекта)
4. [Деплой](#деплой)
5. [Управление](#управление)
6. [Настройка SSL](#настройка-ssl)
7. [Troubleshooting](#troubleshooting)

## 🔧 Требования

- VPS с Ubuntu 20.04+ или Debian 11+
- Минимум 2GB RAM, 2 CPU cores
- Root доступ к серверу
- Доменное имя (опционально, для SSL)

## 🖥️ Настройка сервера

### Автоматическая настройка

```bash
# На сервере выполните:
wget https://raw.githubusercontent.com/your-repo/cat-dog/main/setup-server.sh
chmod +x setup-server.sh
sudo ./setup-server.sh
```

### Ручная настройка

#### 1. Обновление системы

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

#### 2. Установка Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Выйдите и войдите снова для применения изменений
```

#### 3. Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 4. Настройка файрвола

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📦 Подготовка проекта

### 1. Клонирование репозитория

```bash
cd /opt
sudo git clone https://github.com/your-repo/cat-dog.git
cd cat-dog
sudo chown -R $USER:$USER .
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
nano .env
```

Заполните `.env` файл:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=catdog

# Application URLs
FRONTEND_URL=http://your-domain.com
# или для IP: FRONTEND_URL=http://YOUR_SERVER_IP

# Node Environment
NODE_ENV=production
```

### 3. Настройка Nginx (для production с доменом)

Если у вас есть домен, отредактируйте `nginx/nginx.conf`:

```bash
nano nginx/nginx.conf
```

Раскомментируйте секцию HTTPS и замените `your-domain.com` на ваш домен.

## 🚀 Деплой

### Автоматический деплой

```bash
chmod +x deploy.sh
./deploy.sh
```

### Ручной деплой

```bash
# Сборка и запуск контейнеров
docker compose build
docker compose up -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

### Запуск миграций базы данных

```bash
docker compose exec backend npx sequelize-cli db:migrate
```

## 🎛️ Управление

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f postgres
```

### Перезапуск сервисов

```bash
# Все сервисы
docker compose restart

# Конкретный сервис
docker compose restart backend
```

### Остановка и запуск

```bash
# Остановка
docker compose stop

# Запуск
docker compose start

# Остановка и удаление контейнеров
docker compose down

# Остановка с удалением volumes (⚠️ удалит данные БД)
docker compose down -v
```

### Обновление приложения

```bash
# Получить последние изменения
git pull

# Пересобрать и перезапустить
docker compose build --no-cache
docker compose up -d

# Запустить миграции (если есть новые)
docker compose exec backend npx sequelize-cli db:migrate
```

### Резервное копирование базы данных

```bash
# Создать бэкап
docker compose exec postgres pg_dump -U postgres catdog > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
docker compose exec -T postgres psql -U postgres catdog < backup.sql
```

## 🔒 Настройка SSL (Let's Encrypt)

### 1. Установка Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### 2. Получение сертификата

```bash
sudo certbot certonly --standalone -d your-domain.com
```

### 3. Копирование сертификатов в контейнер

```bash
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem
```

### 4. Настройка Nginx для HTTPS

Раскомментируйте секцию HTTPS в `nginx/nginx.conf` и замените `your-domain.com`.

### 5. Перезапуск Nginx

```bash
docker compose restart nginx
```

### 6. Автоматическое обновление сертификата

Добавьте в crontab:

```bash
sudo crontab -e
```

Добавьте строку:

```
0 3 * * * certbot renew --quiet && docker compose restart nginx
```

## 🔍 Troubleshooting

### Проблема: Контейнеры не запускаются

```bash
# Проверить логи
docker compose logs

# Проверить статус
docker compose ps

# Проверить использование ресурсов
docker stats
```

### Проблема: База данных не подключается

```bash
# Проверить логи базы данных
docker compose logs postgres

# Проверить подключение
docker compose exec backend node -e "console.log(process.env.DATABASE_URL)"

# Проверить доступность базы
docker compose exec postgres psql -U postgres -l
```

### Проблема: Nginx не проксирует запросы

```bash
# Проверить конфигурацию Nginx
docker compose exec nginx nginx -t

# Перезагрузить Nginx
docker compose exec nginx nginx -s reload

# Проверить логи
docker compose logs nginx
```

### Проблема: Фронтенд не загружается

```bash
# Проверить сборку
docker compose logs frontend

# Пересобрать фронтенд
docker compose build --no-cache frontend
docker compose up -d frontend
```

### Проблема: Порты заняты

```bash
# Проверить занятые порты
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Остановить другие сервисы или изменить порты в docker-compose.yml
```

### Очистка Docker

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Полная очистка (⚠️ осторожно!)
docker system prune -a --volumes
```

## 📊 Мониторинг

### Проверка использования ресурсов

```bash
docker stats
```

### Проверка здоровья контейнеров

```bash
docker compose ps
```

### Проверка API

```bash
curl http://localhost/api/status
```

## 🔄 CI/CD с GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/cat-dog
            git pull
            docker compose build
            docker compose up -d
            docker compose exec -T backend npx sequelize-cli db:migrate
```

## 📝 Полезные команды

```bash
# Войти в контейнер
docker compose exec backend sh
docker compose exec frontend sh

# Выполнить команду в контейнере
docker compose exec backend node -e "console.log('test')"

# Просмотр переменных окружения
docker compose exec backend env

# Перезапуск с пересборкой
docker compose up -d --build

# Просмотр использования диска
docker system df
```

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker compose logs -f`
2. Проверьте статус: `docker compose ps`
3. Проверьте ресурсы: `docker stats`
4. Проверьте конфигурацию: `docker compose config`

---

**Готово!** Ваше приложение должно быть доступно по адресу вашего сервера или домена.

