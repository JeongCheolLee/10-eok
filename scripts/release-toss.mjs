// 검증 → 운영 번들 → 선택적 콘솔 업로드. 검토 요청/출시는 콘솔에서 진행한다.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const toss = path.join(root, 'toss');
const args = process.argv.slice(2);
let upload = false;
let memo = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--upload') upload = true;
  else if (args[i] === '--memo-file' && args[i + 1]) memo = readFileSync(path.resolve(args[++i]), 'utf8').trim();
  else throw new Error(`지원하지 않는 인자: ${args[i]}`);
}
if (memo.length > 1000) throw new Error('출시 메모는 1,000자 이내로 작성해 주세요');
const { loadEnv } = await import(pathToFileURL(path.join(toss, 'node_modules/vite/dist/node/index.js')).href);
const env = loadEnv('production', toss, 'VITE_');
if (!env.VITE_AD_BANNER_ID?.startsWith('ait.v2.live.')) throw new Error('운영 배너 ID(VITE_AD_BANNER_ID)를 설정해 주세요');
if (env.VITE_REWARDED_ADS_ENABLED !== 'false') throw new Error('기본 계산은 무제한 무료예요. VITE_REWARDED_ADS_ENABLED=false를 설정해 주세요');
if (!['true', 'false'].includes(env.VITE_ANALYSIS_REWARDED_ADS_ENABLED)) throw new Error('상세 분석 광고 사용 여부를 명시해 주세요');
if (env.VITE_ANALYSIS_REWARDED_ADS_ENABLED === 'true' && !env.VITE_AD_REWARDED_ID?.startsWith('ait.v2.live.')) throw new Error('운영 리워드 ID(VITE_AD_REWARDED_ID)를 설정해 주세요');
function run(file, argv, cwd = root) {
  const result = spawnSync(file, argv, { cwd, stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(path.join(root, 'node_modules/.bin/vitest'), ['run']);
run(path.join(root, 'node_modules/.bin/tsc'), ['--noEmit', '-p', 'toss/tsconfig.json']);
run(path.join(toss, 'node_modules/.bin/vite'), ['build'], toss);
run(path.join(toss, 'node_modules/.bin/ait'), ['build'], toss);
const artifact = path.join(toss, '10-eok.ait');
const bytes = readFileSync(artifact);
const manifest = { builtAt: new Date().toISOString(), file: '10-eok.ait', bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
writeFileSync(path.join(toss, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`완료: ${artifact} (${bytes.length} bytes)`);
if (upload) {
  // 같은 폴더의 오래된 10eok.ait를 고르지 않도록 파일을 반드시 지정한다.
  const deployArgs = ['deploy', '--location', artifact, '--scheme-only'];
  if (process.env.AIT_PROFILE) deployArgs.push('--profile', process.env.AIT_PROFILE);
  if (process.env.AIT_API_KEY) deployArgs.push('--api-key', process.env.AIT_API_KEY);
  if (memo) deployArgs.push('--memo', memo);
  // CLI는 인증 프롬프트에서 EOF를 받아도 0으로 끝날 수 있다. 테스트 스킴까지 확인한다.
  const deployed = spawnSync(path.join(toss, 'node_modules/.bin/ait'), deployArgs, { cwd: toss, stdio: ['ignore', 'pipe', 'pipe'], env: process.env, encoding: 'utf8', timeout: 180_000 });
  const scheme = deployed.stdout?.match(/intoss-private:\/\/[^\s\x1b]+/)?.[0];
  if (deployed.error || deployed.status !== 0 || !scheme) {
    throw new Error('콘솔 업로드 완료를 확인하지 못했어요. AIT_API_KEY 또는 ait token add로 인증을 등록하고 다시 실행해 주세요. 이름을 지정해 등록했다면 AIT_PROFILE도 지정해 주세요.');
  }
  console.log(scheme);
  console.log('테스트 버전을 업로드했어요. 운영 반영은 콘솔에서 검토 요청 → 승인 → 출시 순서로 진행해 주세요.');
} else console.log('업로드하려면 --upload를 붙여 실행해 주세요.');
