package seeds

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/duckbugio/duckbug/internal/modules/technology"
	"github.com/jmoiron/sqlx"
)

// SeedTechnologies inserts initial technology data into the database
func SeedTechnologies(db *sqlx.DB) error {
	now := time.Now().Unix()

	javascriptMarkdown := "## Install\n\n" +
		"To install the DuckBug JavaScript SDK, use npm, yarn or pnpm:\n\n" +
		"```bash\nnpm install @duckbug/js\n# or\nyarn add @duckbug/js\n# or\npnpm add @duckbug/js\n```\n\n" +
		"## Configure SDK\n\n" +
		"To capture all errors, initialize the DuckBug JavaScript SDK as soon as possible:\n\n" +
		"```javascript\nimport { DuckSDK, DuckBugProvider } from '@duckbug/js';\n\n// Initialize with DuckBug.io provider\nconst providers = [\n  new DuckBugProvider({\n    dsn: 'YOUR_DSN_HERE'\n  })\n];\n\n// Create SDK instance with optional configuration\nconst duck = new DuckSDK(providers, {\n  logReports: {\n    log: false,\n    warn: true,\n    error: true,\n  }\n});\n```\n\n" +
		"## Verify\n\n" +
		"You can start logging and capture errors:\n\n" +
		"```javascript\n// Log messages\n duck.log('Info message', { userId: 123, action: 'user_login' });\n duck.debug('Debug message', { debugInfo: 'Connection established' });\n duck.warn('Warning message', { warning: 'Rate limit approaching' });\n duck.error('Error message', { error: 'Database connection failed' });\n duck.fatal('Fatal message', { error: 'Critical system failure' });\n\n// Capture exceptions\n try {\n   functionThatFails();\n } catch (error) {\n   duck.quack('ERROR_TAG', error);\n }\n```"

	phpMarkdown := "## Install\n\n" +
		"Install the SDK using Composer:\n\n" +
		"```bash\ncomposer require duckbug/duckbug\n```\n\n" +
		"## Configure SDK\n\n" +
		"Initialize the SDK as early as possible in your application:\n\n" +
		"```php\n\\DuckBug\\Duck::wake([\n    new \\DuckBug\\Core\\ProviderSetup(\n        \\DuckBug\\Providers\\DuckBugProvider::create('YOUR_DSN_HERE'),\n        true, // enable catching Throwable\n        false // disable Debug level logs\n    )\n]);\n```\n\n" +
		"## Verify\n\n" +
		"You can log exceptions and messages with different severity levels:\n\n" +
		"```php\n// Log exceptions using quack()\ntry {\n    throw new \\Exception('Quack quack');\n} catch (\\Exception $exception) {\n    \\DuckBug\\Duck::get()->quack($exception);\n}\n\n// Log messages with severity levels\n\\DuckBug\\Duck::get()->warning('User not found', ['userId' => 8]);\n```"

	reactMarkdown := "## Install\n\n" +
		"To install the DuckBug React SDK, use npm, yarn or pnpm:\n\n" +
		"```bash\nnpm install duckbug-react\n# or\nyarn add duckbug-react\n# or\npnpm add duckbug-react\n```\n\n" +
		"## Configure SDK\n\n" +
		"Wrap your app with DuckBugWrapper in your React app entry point:\n\n" +
		"```jsx\nimport { DuckBugWrapper, DuckBugProvider } from 'duckbug-react';\n\nconst providers = [\n  new DuckBugProvider({ dsn: 'YOUR_DSN_HERE' }),\n];\n\nconst config = {\n  logReports: {\n    log: false,\n    warn: true,\n    error: true,\n  }\n};\n\n<DuckBugWrapper providers={providers} config={config}>\n  <YourApp />\n</DuckBugWrapper>\n```\n\n" +
		"## Verify\n\n" +
		"You can use the useDuckBug hook to access logging methods:\n\n" +
		"```jsx\nimport { useDuckBug } from 'duckbug-react';\n\nfunction MyComponent() {\n  const duck = useDuckBug();\n\n  const handleClick = () => {\n    try {\n      // Some code...\n    } catch (err) {\n      duck.error(err);\n    }\n  };\n\n  // Logging methods\n  duck.log('Info message', { userId: 123, action: 'user_login' });\n  duck.debug('Debug message', { debugInfo: 'Connection established' });\n  duck.warn('Warning message', { warning: 'Rate limit approaching' });\n  duck.error('Error message', { error: 'Database connection failed' });\n  duck.fatal('Fatal message', { error: 'Critical system failure' });\n\n  return <button onClick={handleClick}>Send Message</button>;\n}\n```"

	technologies := []*technology.Technology{
		{
			Name:                 "JavaScript",
			Description:          "JavaScript programming language",
			ExampleDSNConnection: javascriptMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
		{
			Name:                 "PHP",
			Description:          "PHP programming language",
			ExampleDSNConnection: phpMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
		{
			Name:                 "React",
			Description:          "A JavaScript library for building user interfaces",
			ExampleDSNConnection: reactMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
	}

	ctx := context.Background()
	const checkQuery = `SELECT id FROM technologies WHERE name = $1`
	const insertQuery = `
		INSERT INTO technologies (name, description, example_dsn_connection, created_at, updated_at)
		VALUES (:name, :description, :example_dsn_connection, :created_at, :updated_at)
	`

	for _, tech := range technologies {
		var existingID int
		err := db.GetContext(ctx, &existingID, checkQuery, tech.Name)
		if err != nil {
			if !errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("failed to check technology existence for %s: %w", tech.Name, err)
			}
			_, err = db.NamedExecContext(ctx, insertQuery, tech)
			if err != nil {
				return fmt.Errorf("failed to insert technology %s: %w", tech.Name, err)
			}
		} else {
			continue
		}
	}

	return nil
}
