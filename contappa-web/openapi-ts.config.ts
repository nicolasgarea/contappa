import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: '../doc/openapi.yaml',
    output: {
        path: 'src/api/__generated__',
        format: 'prettier',
    },
    plugins: [
        {
            name: '@hey-api/typescript',
            enums: 'typescript'
        },
    ],
})
