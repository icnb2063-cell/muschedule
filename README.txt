공연 일정표 Cloudflare Workers & Pages + D1 배포 안내

이 패키지는 처음 제공한 공연 일정표 HTML을 Cloudflare D1 공유 DB 방식으로 바꾼 버전입니다.
여러 명이 같은 Cloudflare 주소로 접속하면 같은 공연 목록을 함께 보고 수정할 수 있습니다.

[파일 구조]
public/index.html
src/worker.js
schema.sql
wrangler.jsonc
README.txt

[1] GitHub 업로드
압축을 푼 뒤 위 파일과 폴더를 GitHub 저장소 맨 위(root)에 그대로 올립니다.
중요: public 폴더 안에 index.html이 있어야 합니다.

[2] Cloudflare 연결
Cloudflare → Workers 및 Pages → 응용 프로그램 생성 → GitHub 저장소 연결
저장소를 선택한 뒤 배포합니다.

[3] D1 데이터베이스 확인
wrangler.jsonc에는 아래 D1 정보가 들어 있습니다.
- binding: DB
- database_name: muscheddb
- database_id: e2d0edbd-ba88-4684-a0e1-88ab49ffd135

다른 D1을 쓰려면 wrangler.jsonc의 database_name과 database_id를 수정하세요.

[4] schema.sql 실행
Cloudflare → 스토리지 및 데이터베이스 → D1 SQLite 데이터베이스 → muscheddb → 콘솔
schema.sql 내용을 붙여넣고 실행합니다.

[5] 재배포
Cloudflare → Workers 및 Pages → muschedule → 배포 → 새 배포 또는 다시 배포

[6] 테스트
Cloudflare에서 제공한 workers.dev 주소로 접속합니다.
공연 추가 → 저장 → 새로고침 후 남아 있으면 성공입니다.
다른 기기나 시크릿 창에서 같은 주소에 접속했을 때 같은 공연이 보이면 공유 DB 연결이 성공한 것입니다.

주의:
GitHub Pages 주소(github.io)가 아니라 Cloudflare workers.dev 주소로 접속해야 D1 저장이 작동합니다.
