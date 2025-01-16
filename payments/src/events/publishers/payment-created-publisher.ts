import { Subjects, Publisher, PaymentCreatedEvent } from "@clarklindev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}