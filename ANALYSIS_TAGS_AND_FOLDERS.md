# Анализ разработки функционала тегов и папок

## Резюме

Данный документ содержит полный анализ разработки функционала тегов и папок для системы логирования DuckBug. Анализ включает:

- **Проектирование базы данных**: структура таблиц, индексы, связи
- **Архитектура бэкенда**: модули, сервисы, репозитории, HTTP-хэндлеры
- **Архитектура фронтенда**: entities, features, pages, UI-компоненты
- **Интеграция с ingest API**: поддержка двух вариантов передачи тегов
- **План разработки**: поэтапный план с оценкой времени
- **Дополнительные улучшения**: обработка множественных тегов, валидация, статистика, оптимизация производительности, edge cases

**Основные особенности реализации:**
- Поддержка множественных тегов (строка или массив)
- Автоматическое создание тегов из логов
- Гибкая фильтрация логов по тегам и папкам
- Обратная совместимость с существующим API
- Масштабируемая архитектура с нормализованной БД

## 1. Текущая архитектура системы

### 1.1. Структура логов
- **Таблица `logs`**: содержит поля `id`, `project_id`, `fingerprint`, `level`, `message`, `context` (JSON), `time`, `created_at`, `updated_at`
- **Context**: хранится как JSON-текст в поле `context` типа TEXT
- **Фильтрация**: по `project_id`, `fingerprint` (log group), `level`, `time`, поиск по `message`

### 1.2. Модульная архитектура бэкенда
- Модули в `backend/internal/modules/<module>`: `entity.go`, `models.go`, `repository.go`, `service.go`
- HTTP-слой: хэндлеры в `backend/internal/server/http/handlers/*`
- Версионирование API: префикс `/v1` для авторизованных эндпоинтов

### 1.3. Архитектура фронтенда (FSD)
- **entities/**: типы и модели данных, API для сущностей
- **features/**: прикладные сценарии/хуки/компоненты
- **pages/**: композиции features и entities
- **shared/**: общие утилиты, UI-компоненты, конфиги

## 2. Требования к функционалу

### 2.1. Теги (Tags)
- Можно создавать неограниченное количество тегов
- Теги генерируются автоматически из логов (извлекаются из `context.tag` или отдельного поля `tag`)
- Теги привязаны к проекту (`project_id`)
- В списке логов можно фильтровать по тегам
- Можно зайти в конкретный тег и фильтровать по папкам

### 2.2. Папки (Folders)
- Папки создаются вручную через UI
- При создании папки выбираются теги (один или несколько)
- Папка определяет набор тегов, которые в неё входят
- В списке логов можно фильтровать по папкам
- Можно зайти в конкретную папку и фильтровать по тегам

### 2.3. Интеграция с ingest API
- **Вариант 1 (loggerInterface)**: тег передаётся через `context['tag']` (костыль, зарезервированное имя)
- **Вариант 2 (duckInterface)**: тег передаётся отдельным полем `tag: "Ter"` в запросе
- Оба варианта должны поддерживаться для обратной совместимости

## 3. Проектирование базы данных

### 3.1. Новая таблица `tags`
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at INT NOT NULL,
    updated_at INT NOT NULL,
    UNIQUE(project_id, name)
);

CREATE INDEX idx_tags_project_id ON tags(project_id);
CREATE INDEX idx_tags_name ON tags(name);
```

**Обоснование**:
- Теги уникальны в рамках проекта
- Индекс по `project_id` для быстрой фильтрации
- Индекс по `name` для поиска

### 3.2. Новая таблица `log_tags` (связь many-to-many)
```sql
CREATE TABLE log_tags (
    log_id UUID NOT NULL REFERENCES logs(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (log_id, tag_id)
);

CREATE INDEX idx_log_tags_log_id ON log_tags(log_id);
CREATE INDEX idx_log_tags_tag_id ON log_tags(tag_id);
```

**Обоснование**:
- Один лог может иметь несколько тегов
- Один тег может быть у многих логов
- Составной первичный ключ предотвращает дубликаты
- Индексы для быстрого поиска логов по тегам и наоборот

### 3.3. Новая таблица `folders`
```sql
CREATE TABLE folders (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at INT NOT NULL,
    updated_at INT NOT NULL,
    UNIQUE(project_id, name)
);

CREATE INDEX idx_folders_project_id ON folders(project_id);
```

**Обоснование**:
- Папки уникальны в рамках проекта
- Опциональное описание для удобства пользователя

### 3.4. Новая таблица `folder_tags` (связь many-to-many)
```sql
CREATE TABLE folder_tags (
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (folder_id, tag_id)
);

CREATE INDEX idx_folder_tags_folder_id ON folder_tags(folder_id);
CREATE INDEX idx_folder_tags_tag_id ON folder_tags(tag_id);
```

**Обоснование**:
- Одна папка может содержать несколько тегов
- Один тег может быть в нескольких папках
- Индексы для быстрого поиска

### 3.5. Изменения в таблице `logs`
- **Не требуется**: теги хранятся в отдельной таблице `log_tags`
- Поле `context` остаётся для обратной совместимости (может содержать `tag` в JSON)

## 4. Проектирование бэкенда

### 4.1. Модуль `tags`

#### 4.1.1. `backend/internal/modules/tags/models.go`
```go
type Create struct {
    Name      string `json:"name" validate:"required"`
    ProjectID string `json:"-"`
}

type Update struct {
    Name string `json:"name" validate:"required"`
}

type Entity struct {
    ID        string `json:"id"`
    ProjectID string `json:"projectId"`
    Name      string `json:"name"`
    CreatedAt int64  `json:"createdAt"`
    UpdatedAt int64  `json:"updatedAt"`
}

type GetAllParams struct {
    ProjectID string
    Search    string
    Limit    int
    Offset   int
}

type EntityList struct {
    Count int      `json:"count"`
    Items []Entity `json:"items"`
}
```

#### 4.1.2. `backend/internal/modules/tags/entity.go`
```go
type Tag struct {
    ID        string `db:"id"`
    ProjectID string `db:"project_id"`
    Name      string `db:"name"`
    CreatedAt int64  `db:"created_at"`
    UpdatedAt int64  `db:"updated_at"`
}
```

#### 4.1.3. `backend/internal/modules/tags/repository.go`
- `GetAll(ctx, params)` - получение списка тегов с фильтрацией
- `GetByID(ctx, id)` - получение тега по ID
- `GetByProjectID(ctx, projectID)` - получение всех тегов проекта
- `GetByLogID(ctx, logID)` - получение тегов для конкретного лога
- `Create(ctx, tag)` - создание тега
- `Update(ctx, id, tag)` - обновление тега
- `Delete(ctx, id)` - удаление тега
- `AttachToLog(ctx, logID, tagID)` - привязка тега к логу
- `DetachFromLog(ctx, logID, tagID)` - отвязка тега от лога
- `GetOrCreateByName(ctx, projectID, name)` - получение или создание тега по имени (для автоматической генерации)

#### 4.1.4. `backend/internal/modules/tags/service.go`
- Бизнес-логика работы с тегами
- Валидация уникальности имени в рамках проекта
- Автоматическое создание тегов при ingest (если тег указан в `context.tag` или поле `tag`)

### 4.2. Модуль `folders`

#### 4.2.1. `backend/internal/modules/folders/models.go`
```go
type Create struct {
    Name        string   `json:"name" validate:"required"`
    Description string   `json:"description"`
    TagIDs      []string `json:"tagIds" validate:"required,min=1"`
    ProjectID   string   `json:"-"`
}

type Update struct {
    Name        string   `json:"name" validate:"required"`
    Description string   `json:"description"`
    TagIDs      []string `json:"tagIds" validate:"required,min=1"`
}

type Entity struct {
    ID          string   `json:"id"`
    ProjectID   string   `json:"projectId"`
    Name        string   `json:"name"`
    Description string   `json:"description"`
    TagIDs      []string `json:"tagIds"`
    CreatedAt   int64    `json:"createdAt"`
    UpdatedAt   int64    `json:"updatedAt"`
}

type GetAllParams struct {
    ProjectID string
    Search    string
    Limit     int
    Offset    int
}

type EntityList struct {
    Count int      `json:"count"`
    Items []Entity `json:"items"`
}
```

#### 4.2.2. `backend/internal/modules/folders/entity.go`
```go
type Folder struct {
    ID          string `db:"id"`
    ProjectID   string `db:"project_id"`
    Name        string `db:"name"`
    Description string `db:"description"`
    CreatedAt   int64  `db:"created_at"`
    UpdatedAt   int64  `db:"updated_at"`
}
```

#### 4.2.3. `backend/internal/modules/folders/repository.go`
- `GetAll(ctx, params)` - получение списка папок с фильтрацией
- `GetByID(ctx, id)` - получение папки по ID с тегами
- `GetByProjectID(ctx, projectID)` - получение всех папок проекта
- `GetByTagID(ctx, tagID)` - получение папок, содержащих тег
- `Create(ctx, folder, tagIDs)` - создание папки с тегами
- `Update(ctx, id, folder, tagIDs)` - обновление папки и её тегов
- `Delete(ctx, id)` - удаление папки
- `GetTagIDs(ctx, folderID)` - получение тегов папки

### 4.3. Изменения в модуле `log`

#### 4.3.1. Обновление `log/models.go`
```go
type FilterParams struct {
    ProjectID   string
    Fingerprint string
    TimeFrom    int64
    TimeTo      int64
    Level       string
    Search      string
    TagIDs      []string  // НОВОЕ: фильтрация по тегам
    FolderIDs   []string  // НОВОЕ: фильтрация по папкам
}
```

#### 4.3.2. Обновление `log/repository.go`
- В `applyFilters()` добавить условия для `TagIDs` и `FolderIDs`
- Для `TagIDs`: `JOIN log_tags ON logs.id = log_tags.log_id WHERE tag_id IN (...)`
- Для `FolderIDs`: `JOIN folder_tags ON log_tags.tag_id = folder_tags.tag_id WHERE folder_id IN (...)`

#### 4.3.3. Обновление `log/service.go`
- В `Create()` после создания лога:
  - Вызвать функцию `extractTagNames(req)` для извлечения всех тегов (поддержка строки и массива)
  - Для каждого тега:
    - Вызвать `tagsService.GetOrCreateByName()` для получения/создания тега
    - Вызвать `tagsService.AttachToLog()` для привязки тега к логу
  - Ошибки при создании/привязке тегов логировать, но не прерывать создание лога

**Примечание**: Функция `extractTagNames()` описана в разделе 11.1.1 и обрабатывает:
- Тег в отдельном поле `tag` (строка или массив)
- Тег в `context.tag` (строка или массив, для обратной совместимости)
- Удаление дубликатов

#### 4.3.4. Обновление `log/models.go` (Create)
```go
type Create struct {
    Time    int64  `json:"time" validate:"required"`
    Level   string `json:"level" validate:"required,oneof=DEBUG INFO WARN ERROR FATAL"`
    Message string `json:"message" validate:"required"`
    Context *interface{} `json:"context"`
    Tag     interface{} `json:"tag,omitempty"`  // НОВОЕ: отдельное поле для тега (string или []string)
    ProjectID string `json:"-"`
}
```

**Примечание**: Поле `Tag` может быть строкой (один тег) или массивом строк (несколько тегов). Подробности обработки в разделе 11.1.1.

### 4.4. HTTP-хэндлеры

#### 4.4.1. `backend/internal/server/http/handlers/tagHandler.go`
- `GET /v1/tags` - список тегов проекта (с фильтрацией)
- `GET /v1/tags/{id}` - получение тега по ID
- `POST /v1/tags` - создание тега
- `PUT /v1/tags/{id}` - обновление тега
- `DELETE /v1/tags/{id}` - удаление тега
- `GET /v1/tags/{id}/logs` - получение логов с этим тегом (опционально)

#### 4.4.2. `backend/internal/server/http/handlers/folderHandler.go`
- `GET /v1/folders` - список папок проекта
- `GET /v1/folders/{id}` - получение папки по ID
- `POST /v1/folders` - создание папки
- `PUT /v1/folders/{id}` - обновление папки
- `DELETE /v1/folders/{id}` - удаление папки
- `GET /v1/folders/{id}/logs` - получение логов в этой папке (опционально)

#### 4.4.3. Обновление `logHandler.go`
- В `GetAll()` добавить параметры `tagIds` и `folderIds` в query string
- Парсинг массивов: `tagIds=tag1&tagIds=tag2` или `tagIds=tag1,tag2`

### 4.5. Регистрация хэндлеров
В `backend/internal/server/http/handler.go`:
```go
RegisterTagHandlers(router, logger, tagService, jwtKey)
RegisterFolderHandlers(router, logger, folderService, jwtKey)
```

## 5. Проектирование фронтенда

### 5.1. Entity `tag`

#### 5.1.1. `frontend/src/entities/tag/model/types.ts`
```typescript
export interface Tag {
    id: string;
    projectId: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}
```

#### 5.1.2. `frontend/src/entities/tag/api/`
- `fetchTags.ts` - получение списка тегов
- `fetchTagById.ts` - получение тега по ID
- `createTag.ts` - создание тега
- `updateTag.ts` - обновление тега
- `deleteTag.ts` - удаление тега

### 5.2. Entity `folder`

#### 5.2.1. `frontend/src/entities/folder/model/types.ts`
```typescript
export interface Folder {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    tagIds: string[];
    createdAt: number;
    updatedAt: number;
}
```

#### 5.2.2. `frontend/src/entities/folder/api/`
- `fetchFolders.ts` - получение списка папок
- `fetchFolderById.ts` - получение папки по ID
- `createFolder.ts` - создание папки
- `updateFolder.ts` - обновление папки
- `deleteFolder.ts` - удаление папки

### 5.3. Feature `tags`

#### 5.3.1. `frontend/src/features/tags/`
- `hooks/useTags.ts` - хук для работы с тегами
- `hooks/useTag.ts` - хук для работы с одним тегом
- `ui/TagsList/TagsList.tsx` - компонент списка тегов
- `ui/TagCard/TagCard.tsx` - карточка тега
- `ui/TagSelect/TagSelect.tsx` - селект для выбора тегов

### 5.4. Feature `folders`

#### 5.4.1. `frontend/src/features/folders/`
- `hooks/useFolders.ts` - хук для работы с папками
- `hooks/useFolder.ts` - хук для работы с одной папкой
- `ui/FoldersList/FoldersList.tsx` - компонент списка папок
- `ui/FolderCard/FolderCard.tsx` - карточка папки
- `ui/CreateFolderModal/CreateFolderModal.tsx` - модальное окно создания папки
  - Поле "Название папки"
  - Поле "Описание" (опционально)
  - Мультиселект тегов (список всех тегов проекта)
  - Кнопка "Создать"

### 5.5. Обновление feature `logs`

#### 5.5.1. Обновление `frontend/src/features/logs/hooks/useLogs.ts`
```typescript
const [filters, setFilters] = useState({
    level: '',
    search: '',
    timeFrom: null,
    timeTo: null,
    tagIds: [],      // НОВОЕ
    folderIds: [],  // НОВОЕ
});
```

#### 5.5.2. Обновление `frontend/src/features/logs/ui/LogsFilters/LogsFilters.tsx`
- Добавить компонент `TagSelect` для фильтрации по тегам
- Добавить компонент `FolderSelect` для фильтрации по папкам
- Мультиселект для обоих фильтров

#### 5.5.3. Обновление `frontend/src/entities/log/api/fetchLogs.ts`
```typescript
interface FetchLogsParams {
    // ... существующие поля
    tagIds?: string[];
    folderIds?: string[];
}
```

### 5.6. Новые страницы

#### 5.6.1. `frontend/src/pages/TagsPage/TagsPage.tsx`
- Список всех тегов проекта
- Возможность создания/редактирования/удаления тегов
- При клике на тег - переход на страницу логов с фильтром по этому тегу

#### 5.6.2. `frontend/src/pages/FoldersPage/FoldersPage.tsx`
- Список всех папок проекта
- Кнопка "Создать папку" (открывает модальное окно)
- При клике на папку - переход на страницу логов с фильтром по этой папке

#### 5.6.3. `frontend/src/pages/TagPage/TagPage.tsx`
- Информация о теге
- Список логов с этим тегом
- Фильтры (включая фильтр по папкам)

#### 5.6.4. `frontend/src/pages/FolderPage/FolderPage.tsx`
- Информация о папке (название, описание, список тегов)
- Список логов в этой папке
- Фильтры (включая фильтр по тегам)

### 5.7. Обновление роутинга
В `frontend/src/app/routes.tsx`:
```typescript
{
    path: '/projects/:projectId/tags',
    element: <TagsPage />,
},
{
    path: '/projects/:projectId/tags/:tagId',
    element: <TagPage />,
},
{
    path: '/projects/:projectId/folders',
    element: <FoldersPage />,
},
{
    path: '/projects/:projectId/folders/:folderId',
    element: <FolderPage />,
},
```

### 5.8. Навигация
- В боковом меню или на странице проекта добавить ссылки:
  - "Теги" → `/projects/:projectId/tags`
  - "Папки" → `/projects/:projectId/folders`

## 6. Интеграция с ingest API

### 6.1. Обработка тегов при создании лога

#### 6.1.1. В `logHandler.Create()`
```go
// После валидации req и создания лога (entity)
// Извлекаем теги из запроса (поддержка строки и массива)
tagNames := extractTagNames(&req)

// Создание/получение тегов и привязка к логу
for _, tagName := range tagNames {
    tag, err := tagService.GetOrCreateByName(ctx, req.ProjectID, tagName)
    if err != nil {
        // Логировать ошибку, но не прерывать создание лога
        logger.Warn(fmt.Sprintf("Failed to create tag %s: %v", tagName, err))
        continue
    }
    
    err = tagService.AttachToLog(ctx, entity.ID, tag.ID)
    if err != nil {
        logger.Warn(fmt.Sprintf("Failed to attach tag %s to log: %v", tagName, err))
    }
}
```

**Примечание**: Функция `extractTagNames()` описана в разделе 11.1.1 и поддерживает:
- Одиночный тег (string)
- Массив тегов ([]string или []interface{})
- Теги из `context.tag` (строка или массив)
- Автоматическое удаление дубликатов

### 6.2. Документация для интеграции

#### 6.2.1. Примеры использования

**Вариант 1: через context (legacy)**
```php
$this->loggerInterface->warning(
    message: 'текст лога',
    context: [
        'tag' => 'тег',  // зарезервированное имя
        'foo' => 'bar'
    ]
);
```

**Вариант 2: через отдельное поле (рекомендуется)**
```php
$this->duckInterface->warning(
    message: 'текст лога',
    context: [
        'foo' => 'bar'
    ],
    tag: 'Ter'  // отдельное поле
);
```

**JSON для ingest API (одиночный тег):**
```json
{
    "time": 1704067200000,
    "level": "WARN",
    "message": "текст лога",
    "context": {
        "foo": "bar"
    },
    "tag": "Ter"
}
```

**JSON для ingest API (несколько тегов):**
```json
{
    "time": 1704067200000,
    "level": "WARN",
    "message": "текст лога",
    "context": {
        "foo": "bar"
    },
    "tag": ["Ter", "production", "api"]
}
```

**JSON для ingest API (теги в context):**
```json
{
    "time": 1704067200000,
    "level": "WARN",
    "message": "текст лога",
    "context": {
        "tag": ["Ter", "production"],
        "foo": "bar"
    }
}
```

## 7. План разработки (поэтапно)

### Этап 1: База данных
1. Создать миграции для таблиц `tags`, `log_tags`, `folders`, `folder_tags`
2. Добавить индексы
3. Протестировать миграции (up/down)

### Этап 2: Бэкенд - модуль Tags
1. Создать модуль `tags` (entity, models, repository, service)
2. Создать HTTP-хэндлер `tagHandler.go`
3. Зарегистрировать роуты в `handler.go`
4. Написать тесты

### Этап 3: Бэкенд - модуль Folders
1. Создать модуль `folders` (entity, models, repository, service)
2. Создать HTTP-хэндлер `folderHandler.go`
3. Зарегистрировать роуты в `handler.go`
4. Написать тесты

### Этап 4: Бэкенд - интеграция с логами
1. Обновить `log/models.go` (добавить `Tag`, `TagIDs`, `FolderIDs` в фильтры)
2. Обновить `log/repository.go` (добавить JOIN'ы для фильтрации)
3. Обновить `log/service.go` (обработка тегов при создании)
4. Обновить `logHandler.go` (параметры фильтрации)
5. Написать тесты

### Этап 5: Фронтенд - entities
1. Создать entity `tag` (types, api, schemas)
2. Создать entity `folder` (types, api, schemas)
3. Обновить entity `log` (добавить фильтры)

### Этап 6: Фронтенд - features
1. Создать feature `tags` (hooks, UI компоненты)
2. Создать feature `folders` (hooks, UI компоненты)
3. Обновить feature `logs` (добавить фильтры по тегам и папкам)

### Этап 7: Фронтенд - pages
1. Создать `TagsPage`
2. Создать `FoldersPage`
3. Создать `TagPage`
4. Создать `FolderPage`
5. Обновить роутинг
6. Добавить навигацию

### Этап 8: Тестирование и документация
1. E2E тесты для создания тегов и папок
2. Тесты фильтрации логов
3. Обновить Swagger документацию
4. Создать документацию для интеграции (примеры кода)

## 8. Важные замечания

### 8.1. Производительность
- При фильтрации логов по папкам требуется JOIN через `folder_tags` → `log_tags` → `logs`
- Рассмотреть возможность денормализации (кэширование тегов папки)
- Для больших объёмов данных может потребоваться материализованное представление

### 8.2. Безопасность
- Все операции с тегами и папками должны проверять `project_id` (пользователь не должен иметь доступ к тегам/папкам других проектов)
- Валидация уникальности имён тегов/папок в рамках проекта

### 8.3. Обратная совместимость
- Поддержка обоих способов передачи тега (`context.tag` и отдельное поле `tag`)
- При миграции существующих логов можно создать скрипт для извлечения тегов из `context`

### 8.4. UX соображения
- Автодополнение при вводе названия тега (показывать существующие теги проекта)
- Валидация: тег не может быть пустым, папка должна содержать хотя бы один тег
- При удалении тега/папки показать предупреждение, если есть связанные логи

## 9. Альтернативные подходы

### 9.1. Хранение тегов в JSON
**Плюсы**: проще, не нужны JOIN'ы
**Минусы**: сложнее фильтрация, нет нормализации, сложнее управление тегами

### 9.2. Папки как виртуальные фильтры
**Плюсы**: не нужна таблица `folders`, папка = сохранённый набор тегов
**Минусы**: сложнее управление, нет описания папки

**Вывод**: выбранный подход с отдельными таблицами более гибкий и масштабируемый.

## 10. Оценка сложности

- **База данных**: 2-3 часа (миграции, индексы)
- **Бэкенд - Tags**: 4-6 часов (модуль + хэндлер + тесты)
- **Бэкенд - Folders**: 4-6 часов (модуль + хэндлер + тесты)
- **Бэкенд - интеграция**: 3-4 часа (обновление модуля log)
- **Фронтенд - entities**: 2-3 часа
- **Фронтенд - features**: 6-8 часов
- **Фронтенд - pages**: 6-8 часов
- **Тестирование и документация**: 4-6 часов

**Итого**: ~35-45 часов разработки

## 11. Дополнительные улучшения и детали

### 11.1. Обработка множественных тегов

#### 11.1.1. Поддержка массива тегов
В описании задания упоминается возможность передачи нескольких тегов. Необходимо поддержать:

**В ingest API:**
- `tag` может быть строкой (один тег) или массивом строк (несколько тегов)
- `context.tag` также может быть строкой или массивом

**Обновление `log/models.go` (Create):**
```go
type Create struct {
    Time    int64  `json:"time" validate:"required"`
    Level   string `json:"level" validate:"required,oneof=DEBUG INFO WARN ERROR FATAL"`
    Message string `json:"message" validate:"required"`
    Context *interface{} `json:"context"`
    Tag     interface{} `json:"tag,omitempty"`  // string или []string
    ProjectID string `json:"-"`
}
```

**Обновление обработки в `log/service.go`:**
```go
func extractTagNames(req *Create) []string {
    var tagNames []string
    
    // Вариант 1: отдельное поле tag
    if req.Tag != nil {
        switch v := req.Tag.(type) {
        case string:
            if v != "" {
                tagNames = append(tagNames, v)
            }
        case []interface{}:
            for _, item := range v {
                if str, ok := item.(string); ok && str != "" {
                    tagNames = append(tagNames, str)
                }
            }
        case []string:
            for _, tag := range v {
                if tag != "" {
                    tagNames = append(tagNames, tag)
                }
            }
        }
    }
    
    // Вариант 2: тег в context
    if req.Context != nil {
        contextMap, ok := (*req.Context).(map[string]interface{})
        if ok {
            if tagValue, exists := contextMap["tag"]; exists {
                switch v := tagValue.(type) {
                case string:
                    if v != "" {
                        tagNames = append(tagNames, v)
                    }
                case []interface{}:
                    for _, item := range v {
                        if str, ok := item.(string); ok && str != "" {
                            tagNames = append(tagNames, str)
                        }
                    }
                }
            }
        }
    }
    
    // Удаление дубликатов
    seen := make(map[string]bool)
    result := []string{}
    for _, tag := range tagNames {
        if !seen[tag] {
            seen[tag] = true
            result = append(result, tag)
        }
    }
    
    return result
}
```

### 11.2. Валидация тегов

#### 11.2.1. Правила валидации
- **Максимальная длина**: 255 символов (соответствует VARCHAR(255) в БД)
- **Минимальная длина**: 1 символ (не пустая строка)
- **Допустимые символы**: рекомендуется разрешить любые Unicode символы, но можно ограничить специальными символами
- **Trim пробелов**: автоматически обрезать пробелы в начале и конце
- **Нормализация**: привести к единому регистру (опционально, но не рекомендуется - теги могут быть чувствительны к регистру)

**Обновление `tags/service.go`:**
```go
func (s *service) validateTagName(name string) error {
    name = strings.TrimSpace(name)
    
    if len(name) == 0 {
        return errors.New("tag name cannot be empty")
    }
    
    if len(name) > 255 {
        return errors.New("tag name cannot exceed 255 characters")
    }
    
    // Опционально: проверка на недопустимые символы
    // if containsInvalidChars(name) {
    //     return errors.New("tag name contains invalid characters")
    // }
    
    return nil
}
```

### 11.3. Статистика по тегам и папкам

#### 11.3.1. Статистика тегов
Добавить в `tags/models.go`:
```go
type TagStats struct {
    TagID    string `json:"tagId"`
    LogsCount int   `json:"logsCount"`
    Last24h  int    `json:"last24h"`
    Last7d   int    `json:"last7d"`
    Last30d  int    `json:"last30d"`
}
```

**Эндпоинт**: `GET /v1/tags/{id}/stats` - статистика по тегу

#### 11.3.2. Статистика папок
Добавить в `folders/models.go`:
```go
type FolderStats struct {
    FolderID  string `json:"folderId"`
    LogsCount int    `json:"logsCount"`
    TagsCount int    `json:"tagsCount"`
    Last24h   int    `json:"last24h"`
    Last7d    int    `json:"last7d"`
    Last30d   int    `json:"last30d"`
}
```

**Эндпоинт**: `GET /v1/folders/{id}/stats` - статистика по папке

### 11.4. Миграция существующих данных

#### 11.4.1. Скрипт миграции
Создать отдельную миграцию для извлечения тегов из существующих логов:

```sql
-- Миграция: извлечение тегов из context существующих логов
-- Выполняется после создания таблиц tags и log_tags

-- Функция для извлечения тегов из JSON context
CREATE OR REPLACE FUNCTION extract_tags_from_logs()
RETURNS void AS $$
DECLARE
    log_record RECORD;
    tag_value TEXT;
    tag_id UUID;
    context_json JSONB;
BEGIN
    FOR log_record IN 
        SELECT id, project_id, context 
        FROM logs 
        WHERE context IS NOT NULL AND context != ''
    LOOP
        BEGIN
            -- Парсим context как JSON
            context_json := log_record.context::JSONB;
            
            -- Извлекаем тег из context.tag
            tag_value := context_json->>'tag';
            
            IF tag_value IS NOT NULL AND tag_value != '' THEN
                -- Получаем или создаём тег
                INSERT INTO tags (id, project_id, name, created_at, updated_at)
                VALUES (
                    gen_random_uuid(),
                    log_record.project_id,
                    tag_value,
                    EXTRACT(EPOCH FROM NOW())::INT,
                    EXTRACT(EPOCH FROM NOW())::INT
                )
                ON CONFLICT (project_id, name) DO NOTHING
                RETURNING id INTO tag_id;
                
                -- Если тег уже существовал, получаем его ID
                IF tag_id IS NULL THEN
                    SELECT id INTO tag_id 
                    FROM tags 
                    WHERE project_id = log_record.project_id AND name = tag_value;
                END IF;
                
                -- Привязываем тег к логу
                INSERT INTO log_tags (log_id, tag_id)
                VALUES (log_record.id, tag_id)
                ON CONFLICT DO NOTHING;
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                -- Пропускаем логи с некорректным JSON
                CONTINUE;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Выполняем миграцию
SELECT extract_tags_from_logs();

-- Удаляем функцию после использования
DROP FUNCTION IF EXISTS extract_tags_from_logs();
```

**Примечание**: Миграцию лучше выполнять в отдельном скрипте или через отдельную команду, чтобы не блокировать основную миграцию.

### 11.5. Оптимизация производительности JOIN'ов

#### 11.5.1. Составные индексы
Для улучшения производительности фильтрации по тегам и папкам добавить составные индексы:

```sql
-- Составной индекс для фильтрации логов по тегам с учётом времени
CREATE INDEX idx_log_tags_tag_time ON log_tags(tag_id, log_id);

-- Составной индекс для фильтрации по папкам
CREATE INDEX idx_folder_tags_folder_tag ON folder_tags(folder_id, tag_id);

-- Составной индекс для быстрого поиска логов с тегами проекта
CREATE INDEX idx_log_tags_project_time ON log_tags(log_id) 
INCLUDE (tag_id);
```

#### 11.5.2. Материализованное представление (опционально)
Для очень больших объёмов данных можно создать материализованное представление:

```sql
CREATE MATERIALIZED VIEW log_tags_summary AS
SELECT 
    lt.tag_id,
    t.project_id,
    COUNT(DISTINCT lt.log_id) as logs_count,
    MAX(l.time) as last_log_time
FROM log_tags lt
JOIN tags t ON lt.tag_id = t.id
JOIN logs l ON lt.log_id = l.id
GROUP BY lt.tag_id, t.project_id;

CREATE INDEX idx_log_tags_summary_project ON log_tags_summary(project_id);
CREATE INDEX idx_log_tags_summary_tag ON log_tags_summary(tag_id);

-- Обновление представления (можно через cron или триггер)
REFRESH MATERIALIZED VIEW CONCURRENTLY log_tags_summary;
```

### 11.6. Обработка edge cases

#### 11.6.1. Удаление тегов
При удалении тега:
- **Вариант 1 (мягкое удаление)**: пометить тег как удалённый, но не удалять связи
- **Вариант 2 (жёсткое удаление)**: удалить тег и все связи (через CASCADE)
- **Рекомендация**: использовать жёсткое удаление с CASCADE, так как связи уже настроены в БД

**Валидация перед удалением:**
```go
func (s *service) Delete(ctx context.Context, id string) error {
    // Опционально: проверить количество связанных логов
    count, err := s.repo.GetLogsCountByTagID(ctx, id)
    if err != nil {
        return err
    }
    
    // Можно вернуть предупреждение, но не блокировать удаление
    if count > 0 {
        s.logger.Warn(fmt.Sprintf("Deleting tag %s with %d associated logs", id, count))
    }
    
    return s.repo.Delete(ctx, id)
}
```

#### 11.6.2. Удаление папок
Аналогично тегам - удаление папки удаляет только связи `folder_tags`, но не теги и не логи.

#### 11.6.3. Удаление логов
При удалении лога связи `log_tags` удаляются автоматически через CASCADE.

#### 11.6.4. Удаление проектов
При удалении проекта все теги, папки и связи удаляются автоматически через CASCADE.

### 11.7. Дополнительные API эндпоинты

#### 11.7.1. Поиск тегов
`GET /v1/tags?search=<query>` - поиск тегов по имени с автодополнением

#### 11.7.2. Популярные теги
`GET /v1/tags/popular?projectId=<id>&limit=10` - самые популярные теги проекта (по количеству логов)

#### 11.7.3. Массовые операции
- `POST /v1/tags/batch` - создание нескольких тегов за раз
- `POST /v1/logs/{id}/tags` - добавление нескольких тегов к логу
- `DELETE /v1/logs/{id}/tags` - удаление всех тегов у лога

### 11.8. Отображение тегов в UI

#### 11.8.1. В списке логов
- Показывать теги как badges/chips под каждым логом
- Цветовая индикация (можно использовать хэш имени тега для генерации цвета)
- Клик по тегу - переход на страницу фильтрации по этому тегу

#### 11.8.2. В карточке лога
- Полный список тегов с возможностью добавления/удаления
- Быстрое создание нового тега прямо из карточки лога

#### 11.8.3. Облако тегов
- Визуализация популярности тегов через размер шрифта
- Интерактивное облако тегов на странице проекта

### 11.9. Документация для разработчиков

#### 11.9.1. Примеры интеграции
Добавить в документацию примеры для разных языков:
- PHP (уже есть)
- Python
- JavaScript/Node.js
- Go
- Java

#### 11.9.2. SDK/Библиотеки
Рассмотреть создание SDK для популярных языков программирования для упрощения интеграции.

### 11.10. Мониторинг и метрики

#### 11.10.1. Метрики для отслеживания
- Количество тегов на проект
- Количество папок на проект
- Среднее количество тегов на лог
- Популярность использования тегов
- Производительность запросов с фильтрацией по тегам/папкам

#### 11.10.2. Алерты
- Предупреждение при большом количестве тегов без использования
- Предупреждение при медленных запросах фильтрации
