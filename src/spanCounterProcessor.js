// spanCounterProcessor.js
import { SpanProcessor } from '@opentelemetry/sdk-trace-base';

class SpanCounterProcessor {
    constructor(initialCounts) {
        this.spanCount = initialCounts.spanCount || 0;
        this.spanEventCount = initialCounts.spanEventCount || 0;
    }

    updateCounts() {
        window.postMessage({ 
            type: 'UPDATE_SPAN_COUNT', 
            spans: this.spanCount, 
            events: this.spanEventCount
        }, '*');
    }

    onStart(span, context) {
        // We don't need to do anything when a span starts
    }

    onEnd(span) {
        this.spanCount++;
        this.spanEventCount += span.events.length;

        console.log(`Processed a span. Total count: ${this.spanCount}, Event count: ${this.spanEventCount}`);
        this.updateCounts();
    }

    shutdown() {
        console.log('SpanCounterProcessor shutdown');
        return Promise.resolve();
    }

    forceFlush() {
        return Promise.resolve();
    }

    resetCount() {
        this.spanCount = 0;
        this.spanEventCount = 0;
        console.log('Counts reset to 0');
        this.updateCounts();
    }
}

export default SpanCounterProcessor;