import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: './src/api/schema.json',
    output: {
        path: 'src/api/__generated__',
        format: 'prettier',
    },
    plugins: [
        {
            name: '@hey-api/typescript',
            enums: 'typescript',
            client: 'false',
        },
    ],
})
