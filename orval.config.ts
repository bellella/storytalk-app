import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:3000/api/docs-json',
      filters: {
        tags: ['Story', 'Episode'],
      },
    },
    output: {
      mode: 'tags-split', // 태그별로 파일 분리 (auth.ts, user.ts 등)
      target: 'lib/api/generated', // 생성될 API 함수들 위치
      schemas: 'lib/api/generated/model', // 생성될 타입(DTO) 위치
      client: 'axios-functions', // ★ 중요: Hook 없이 순수 함수만 생성
      override: {
        mutator: {
          path: './lib/api/axios-client.ts', // 위에서 만든 커스텀 인스턴스 경로
          name: 'customInstance', // export한 함수 이름
        },
        transformer: (operation) => {
          operation.operationName = operation.operationName.replace(
            'Controller',
            ''
          );
          return operation;
        },
      },
    },
  },
});
