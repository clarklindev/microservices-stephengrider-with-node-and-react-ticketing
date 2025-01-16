import { Publisher, TicketCreatedEvent, Subjects } from '@clarklindev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}