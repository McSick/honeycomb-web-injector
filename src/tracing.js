import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import SpanCounterProcessor from './spanCounterProcessor';
console.log('Tracing script loaded');
let spanCounterProcessor;
const configDefaults = {
  ignoreNetworkEvents: true,
  // propagateTraceHeaderCorsUrls: [
  // /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
  // ]
}
function startTracing(apiKey, serviceName, initialCounts) {
  console.log('Initializing HoneycombWebSDK for Service Name:', serviceName);

  spanCounterProcessor = new SpanCounterProcessor(initialCounts);
  // Request initial counts when the script loads
  window.postMessage({ type: 'GET_COUNTS' }, '*');
  const sdk = new HoneycombWebSDK({
    apiKey: apiKey,
    serviceName: serviceName,
    instrumentations: [getWebAutoInstrumentations({
      // Loads custom configuration for xml-http-request instrumentation.
      '@opentelemetry/instrumentation-xml-http-request': configDefaults,
      '@opentelemetry/instrumentation-fetch': configDefaults,
      '@opentelemetry/instrumentation-document-load': configDefaults,
    })],
    spanProcessors: [spanCounterProcessor],
  });
  sdk.start();
  spanCounterProcessor.updateCounts();
  console.log('Tracing started');
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  switch (event.data.type) {
    case 'START_TRACING':
      if(spanCounterProcessor) {
        return;
      }
      const { apiKey, serviceName, initialCounts } = event.data;
      startTracing(apiKey, serviceName, initialCounts);
      break;
    case 'START_NEW_SESSION':
      if (spanCounterProcessor) {
        spanCounterProcessor.resetCount();
      }
      break;
  }
});
