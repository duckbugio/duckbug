# DuckBug 🦆

Мониторинг ошибок и логов для веб-приложений с современным интерфейсом и мощным API.

## 🏗️ Архитектура

Проект состоит из двух основных компонентов:

- **Backend** (`/backend`) - Go API сервер с PostgreSQL
- **Frontend** (`/frontend`) - React приложение с TypeScript

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Make
- Git

### Запуск в режиме разработки

```bash
# Клонируйте репозиторий
git clone https://github.com/duckbugio/duckbug.git
cd duckbug

# Запустите все сервисы
make dev
```

После запуска приложение будет доступно по адресам:
- **Frontend**: http://duckbug.localhost
- **Backend API**: http://api.duckbug.localhost
- **Database**: localhost:5432

## 📋 Доступные команды

### Основные команды

```bash
make help          # Показать все доступные команды
make dev           # Запустить среду разработки
make init          # Полная инициализация проекта
make up            # Запустить все сервисы
make down          # Остановить все сервисы
make restart       # Перезапустить сервисы
```

### Тестирование и линтинг

```bash
make test          # Запустить все тесты
make test-frontend # Тесты только frontend
make test-backend  # Тесты только backend

make lint          # Запустить все линтеры
make lint-frontend # Линтеры только frontend
make lint-backend  # Линтер только backend
```

### База данных

```bash
make db-up         # Запустить базу данных
make db-down       # Остановить базу данных
make db-reset      # Сбросить базу данных (ОСТОРОЖНО!)
```

### Логи и мониторинг

```bash
make logs          # Показать логи всех сервисов
make logs-backend  # Логи backend
make logs-frontend # Логи frontend
make logs-db       # Логи базы данных
make health        # Проверить состояние сервисов
```

### Очистка

```bash
make clean         # Очистить среду разработки
make clean-all     # Полная очистка (включая образы)
```

## 🛠️ Разработка

### Структура проекта

```
duckbug/
├── backend/                 # Go API сервер
│   ├── cmd/                # Точки входа приложения
│   ├── internal/           # Внутренние модули
│   │   ├── modules/        # Бизнес-логика
│   │   ├── server/         # HTTP сервер
│   │   └── storage/        # Работа с БД
│   ├── pkg/                # Публичные пакеты
│   └── deployments/        # Docker конфигурации
├── frontend/               # React приложение
│   ├── src/
│   │   ├── app/            # Конфигурация приложения
│   │   ├── entities/       # API слой
│   │   ├── features/       # Функциональность
│   │   ├── pages/          # Страницы
│   │   ├── shared/         # Общие компоненты
│   │   └── styles/         # Стили
│   └── docker/             # Docker конфигурации
├── .github/workflows/      # CI/CD пайплайны
├── docker-compose.yml      # Общая конфигурация для разработки
└── Makefile               # Команды для разработки
```

### Backend разработка

```bash
# Перейти в папку backend
cd backend

# Запустить тесты
make test

# Запустить линтер
make lint

# Создать новую миграцию
make migrations-new name=add_user_table

# Запустить только backend
make up
```

### Frontend разработка

```bash
# Перейти в папку frontend
cd frontend

# Установить зависимости
make init

# Запустить линтеры
make check

# Запустить тесты
npm run test:ci

# Запустить только frontend
make up
```

## 🐳 Docker

### Разработка

Используйте общий `docker-compose.yml` для разработки:

```bash
# Запустить все сервисы
docker compose up -d

# Запустить только определенные сервисы
docker compose up -d backend frontend postgres
```

### Production

Для production доступны два варианта:

**1. Отдельные образы (рекомендуется для масштабирования):**

```bash
# Собрать production образы
make build-production

# Или вручную
docker build -f backend/build/duckbug/Dockerfile -t duckbug-api:latest ./backend
docker build -f frontend/docker/production/nginx/Dockerfile -t duckbug-web:latest ./frontend
```

**2. Единый образ (простое развертывание):**

```bash
# Собрать единый образ (frontend + backend)
make build-unified

# Или вручную
docker build -t duckbug:latest .

# Запустить
docker run -d --name duckbug-app -p 80:80 duckbug:latest
```

Единый образ содержит:
- Frontend (React) - статические файлы через nginx
- Backend (Go API) - работает на порту 8080 внутри контейнера
- Nginx - проксирует API запросы к backend

## 🚀 Production Deployment

Для production деплоя используйте каталог `deploy/production/`:

```bash
# Настройте переменные окружения
cd deploy/production
cp env.example .env
nano .env

# Запустите деплой
docker compose -f docker-compose-production.yml pull
docker compose -f docker-compose-production.yml up -d
```

Или через Makefile:
```bash
make deploy-production
```

**Особенности production системы:**
- 🔒 **Traefik** - reverse proxy с автоматическими SSL сертификатами
- 🌐 **HTTPS** - автоматические Let's Encrypt сертификаты
- 🔄 **Автоматические редиректы** - www → основной домен
- 📊 **Мониторинг** - health checks для всех сервисов
- 🐳 **Единый образ** - frontend + backend в одном контейнере

Подробная документация: [deploy/production/README.md](deploy/production/README.md)

## 🔧 CI/CD

Проект использует GitHub Actions для автоматизации:

- **Анализ кода**: ESLint, StyleLint, Prettier, GolangCI-lint
- **Тестирование**: Jest (frontend), Go tests (backend)
- **Сборка**: Docker образы для production
- **Деплой**: Автоматический деплой на production при push в main

### Переменные окружения

Для работы CI/CD необходимо настроить следующие секреты в GitHub:

- `PRODUCTION_KEY` - SSH ключ для доступа к production серверу
- `DOCKERHUB_TOKEN` - Токен для Docker Hub (если используется)

И переменные:

- `PRODUCTION_HOST` - Хост production сервера
- `PRODUCTION_PORT` - Порт SSH
- `PROJECT_NAME` - Имя проекта
- `DOMAIN` - Домен приложения

## 📚 API Документация

После запуска backend, Swagger документация доступна по адресу:
http://api.duckbug.localhost/swagger/

## 🗄️ База данных

### Миграции

```bash
# Создать новую миграцию
make migrations-new name=migration_name

# Применить миграции (автоматически при запуске)
docker compose up -d postgres
```

### Подключение к БД

```bash
# Подключиться к PostgreSQL
docker compose exec postgres psql -U duckbug -d duckbug
```

## 🐛 Отладка

### Backend отладка

Backend настроен для отладки с Delve:

```bash
# Запустить с отладчиком
docker compose up backend

# Подключиться к отладчику (порт 2345)
# В IDE настройте remote debug на localhost:2345
```

### Frontend отладка

Frontend использует hot reload для разработки:

```bash
# Логи frontend
make logs-frontend

# Перезапустить frontend
docker compose restart frontend frontend-dev
```

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте [Issues](https://github.com/duckbugio/duckbug/issues)
2. Создайте новый Issue с подробным описанием
3. Приложите логи: `make logs > logs.txt`

---

**DuckBug** - делаем мониторинг ошибок простым и эффективным! 🦆✨
