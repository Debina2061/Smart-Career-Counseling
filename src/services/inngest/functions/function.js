import { inngest } from "../client.js";

export const singleStage = inngest.createFunction(
  { id: "event-first" },
  { event: "test/event.first" },
  async ({ event, step }) => {
    console.log(`event-first-starting`);
    await step.run("event-first-first", () => {
      console.log(`hello`);
      return `hello`;
    });
    step.sleep("sleeping", "60s");
    return {
      message: "Let's go",
      eventId: event.id
    };
  }
);