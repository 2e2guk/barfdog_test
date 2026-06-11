const assert = require("node:assert/strict");

const corpus = require("../data/rag-documents.json");
const { buildRagPrompt, retrieveRagContext } = require("../rag/retriever");

function sourceIds(result) {
  return result.documents.map((doc) => doc.id);
}

const records = corpus.documents.filter((doc) => doc.type === "ngs_record");

assert.equal(corpus.anonymization.sampleSize, 100);
assert.equal(records.length, 100);
assert.ok(records.every((doc) => doc.id.startsWith("ngs_sample_")));
assert.ok(records.every((doc) => doc.metadata?.anonymousId?.startsWith("ANON-DOG-")));
assert.ok(records.every((doc) => !("dogName" in doc.metadata)));
assert.ok(records.every((doc) => !("dogNo" in doc.metadata)));

const digestiveSkin = retrieveRagContext("맥스가 배를 자주 긁고 변이 묽은데 NGS랑 관련이 있을까?", {
  isPetHealthQuestion: true,
  shouldRecommendDiet: false,
});

assert.equal(digestiveSkin.enabled, true);
assert.ok(sourceIds(digestiveSkin).includes("phr_max_demo_profile"));
assert.ok(sourceIds(digestiveSkin).includes("ngs_max_demo_profile"));
assert.ok(digestiveSkin.risks.some((risk) => risk.target.includes("피부염")));
assert.ok(digestiveSkin.risks.some((risk) => risk.target.includes("IBD")));

const diet = retrieveRagContext("알러지 개선을 위해 바프독 식단을 추천해줘", {
  isPetHealthQuestion: true,
  shouldRecommendDiet: true,
});

assert.equal(diet.enabled, true);
assert.ok(sourceIds(diet).includes("nutrition_barf_kangaroo"));

const greeting = retrieveRagContext("안녕 오늘 기분 어때?", {
  isPetHealthQuestion: false,
  shouldRecommendDiet: false,
});

assert.equal(greeting.enabled, false);
assert.equal(greeting.documents.length, 0);

const { prompt } = buildRagPrompt("최신 건강검진 검사 결과를 요약해줘", {
  isPetHealthQuestion: true,
  shouldRecommendDiet: false,
});

assert.match(prompt, /\[INFODOG RAG 입력\]/);
assert.match(prompt, /검색된 PHR\/NGS\/영양 근거/);

console.log("RAG retriever tests passed");
