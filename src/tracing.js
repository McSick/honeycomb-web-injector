import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

console.log('Tracing script loaded');

function startTracing(apiKey, serviceName) {
  console.log('Initializing HoneycombWebSDK for Service Name:', serviceName);
  const sdk = new HoneycombWebSDK({
    apiKey: apiKey,
    serviceName: serviceName,
    instrumentations: [getWebAutoInstrumentations()],
  });
  sdk.start();
  console.log('Tracing started');
}

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data.type || event.data.type !== 'START_TRACING') {
    return;
  }
  const { apiKey, serviceName } = event.data;
  startTracing(apiKey, serviceName);
});
