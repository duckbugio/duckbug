# DuckBug Production Deployment

Этот каталог содержит все файлы для production деплоя DuckBug с использованием Traefik и единого Docker образа.

## 📁 Структура

```
deploy/production/
├── docker-compose-production.yml  # Docker Compose конфигурация с Traefik
├── Dockerfile                     # Единый образ (frontend + backend)
├── nginx.conf                     # Nginx конфигурация
├── start.sh                       # Скрипт запуска приложения
├── env.example                    # Пример переменных окружения
└── README.md                      # Эта документация
```

## 🚀 Быстрый старт

1. **Настройте переменные окружения:**
   ```bash
   cd deploy/production
   cp env.example .env
   nano .env
   ```

2. **Запустите деплой:**
   ```bash
   docker compose -f docker-compose-production.yml pull
   docker compose -f docker-compose-production.yml up -d
   ```

## ⚙️ Конфигурация

### Переменные окружения (.env)

**Docker Configuration:**
- `COMPOSE_PROJECT_NAME` - Имя проекта Docker Compose
- `REGISTRY` - Docker registry (по умолчанию: ghcr.io/duckbugio/duckbug)
- `IMAGE_TAG` - Версия образа (по умолчанию: latest)

**Domain Configuration:**
- `DOMAIN` - Основной домен приложения
- `ACME_EMAIL` - Email для Let's Encrypt сертификатов

**Database Configuration:**
- `POSTGRES_DB` - Имя базы данных
- `POSTGRES_USER` - Пользователь PostgreSQL
- `POSTGRES_PASSWORD` - Пароль PostgreSQL
- `DATABASE_URL` - Полный URL подключения к БД

**Security:**
- `JWT_SECRET` - Секретный ключ для JWT токенов

### Docker Compose Services

**Traefik (Reverse Proxy):**
- Автоматические SSL сертификаты через Let's Encrypt
- Редиректы www → основной домен
- Маршрутизация трафика

**DuckBug (Application):**
- Единый образ с frontend + backend
- Nginx для статических файлов
- Go API на порту 8080

**PostgreSQL (Database):**
- Health checks
- Автоматические бэкапы через volumes

## 🔧 Ручное управление

### Запуск
```bash
docker compose -f docker-compose-production.yml up -d
```

### Остановка
```bash
docker compose -f docker-compose-production.yml down
```

### Просмотр логов
```bash
docker compose -f docker-compose-production.yml logs -f
```

### Обновление
```bash
docker compose -f docker-compose-production.yml pull
docker compose -f docker-compose-production.yml up -d
```

## 🔒 Безопасность

- **SSL/TLS**: Автоматические Let's Encrypt сертификаты
- **Network Isolation**: Отдельные сети для разных сервисов
- **Strong Passwords**: Используйте сложные пароли для PostgreSQL
- **JWT Security**: Длинный случайный JWT_SECRET
- **Firewall**: Настройте firewall для ограничения доступа

## 📊 Мониторинг

- **Приложение**: https://your-domain.com
- **API документация**: https://your-domain.com/swagger/
- **Статус контейнеров**: `docker compose -f docker-compose-production.yml ps`
- **Логи Traefik**: `docker compose -f docker-compose-production.yml logs traefik`
- **Логи приложения**: `docker compose -f docker-compose-production.yml logs duckbug`

## 🚨 Troubleshooting

### SSL сертификаты не генерируются
- Проверьте, что домен указывает на ваш сервер
- Убедитесь, что порты 80 и 443 открыты
- Проверьте логи Traefik: `docker logs traefik`

### Приложение не запускается
- Проверьте переменные окружения в .env
- Убедитесь, что PostgreSQL запущен
- Проверьте логи: `docker compose -f docker-compose-production.yml logs duckbug`

### База данных недоступна
- Проверьте пароли в .env
- Убедитесь, что PostgreSQL контейнер запущен
- Проверьте сетевые настройки

## 🔄 CI/CD Integration

Этот деплой интегрирован с GitHub Actions:
- Автоматическая сборка единого образа
- Push в Docker registry
- Автоматический деплой при push в main ветку