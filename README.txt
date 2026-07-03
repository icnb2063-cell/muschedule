공연 일정표 Cloudflare D1 공유 배포 순서

1. 이 압축 파일을 풀고, 아래 파일/폴더를 GitHub 저장소 최상단에 업로드합니다.
   - index.html
   - functions/api/shows.js
   - schema.sql
   - README.txt

2. Cloudflare에서 Workers 및 Pages → 응용 프로그램 생성 → GitHub 저장소 연결로 프로젝트를 만듭니다.
   - GitHub Pages 주소가 아니라 Cloudflare가 만들어 준 workers.dev 또는 pages.dev 주소를 사용합니다.

3. Cloudflare에서 D1 SQLite 데이터베이스를 만듭니다.
   - 예: muscheddb

4. 만든 프로젝트의 바인딩에 D1 데이터베이스를 연결합니다.
   - 변수 이름: DB
   - 데이터베이스: muscheddb

5. D1 데이터베이스 → 콘솔에서 schema.sql 내용을 붙여넣고 실행합니다.

6. Cloudflare 프로젝트를 다시 배포합니다.

7. Cloudflare 주소로 접속해 테스트합니다.
   - 공연 추가 → 새로고침 → 그대로 남아 있으면 성공
   - 다른 기기에서 같은 주소 접속 → 같은 공연이 보이면 공유 DB 성공

주의:
- github.io 주소로 접속하면 D1 공유 저장이 작동하지 않습니다.
- 반드시 Cloudflare가 제공한 주소로 접속해야 합니다.
