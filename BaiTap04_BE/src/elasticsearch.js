const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ES_URL || 'http://localhost:9201',
  // Nếu bật security thì bỏ comment:
  // auth: {
  //   username: process.env.ES_USERNAME || 'elastic',
  //   password: process.env.ES_PASSWORD || 'changeme'
  // }
});

async function checkConnection() {
  try {
    const health = await esClient.cluster.health();
    console.log('✅ Elasticsearch cluster health:', health.status);
  } catch (err) {
    console.error('❌ Elasticsearch connection failed:', err);
  }
}

module.exports = { esClient, checkConnection };
